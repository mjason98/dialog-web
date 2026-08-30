import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import type {
  DialogueEdgeData,
  DialogueNodeData,
  NodePositions,
} from "../logic/graphMapping";
import {
  dialogueToEdges,
  dialogueToNodes,
} from "../logic/graphMapping";
import type { DialogueFile, ValidationIssue } from "../types/dialogue";
import DialogueNode from "./DialogueNode";

const nodeTypes = { dialogueNode: DialogueNode };

export type EdgeSelection = {
  sourceBlockKey: string;
  optionIndex: number;
};

type Props = {
  dialogue: DialogueFile;
  issues: ValidationIssue[];
  selectedBlock: string | null;
  selectedEdge: EdgeSelection | null;
  positions: NodePositions;
  onPositionsChange: (positions: NodePositions) => void;
  onSelectBlock: (key: string | null) => void;
  onSelectEdge: (sel: EdgeSelection | null) => void;
  onConnect: (sourceKey: string, targetKey: string) => void;
  onAddBlockAt: (pos: { x: number; y: number }) => void;
};

export default function DialogueGraph({
  dialogue,
  issues,
  selectedBlock,
  selectedEdge,
  positions,
  onPositionsChange,
  onSelectBlock,
  onSelectEdge,
  onConnect,
  onAddBlockAt,
}: Props) {
  const initialNodes = useMemo(
    () => dialogueToNodes(dialogue, positions, issues),
    [dialogue, positions, issues],
  );
  const initialEdges = useMemo(() => dialogueToEdges(dialogue), [dialogue]);

  const [nodes, setNodes] = useState<Node<DialogueNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge<DialogueEdgeData>[]>(initialEdges);

  useEffect(() => {
    let parentIds = new Set<string>();
    let childIds = new Set<string>();
    if (selectedBlock && selectedBlock in dialogue) {
      childIds = new Set(
        dialogue[selectedBlock].options
          .map((o) => o.key)
          .filter((k) => k && k in dialogue),
      );
      for (const [key, block] of Object.entries(dialogue)) {
        if (block.options.some((o) => o.key === selectedBlock)) {
          parentIds.add(key);
        }
      }
    }
    setNodes(
      initialNodes.map((n) => ({
        ...n,
        selected: n.id === selectedBlock,
        data: {
          ...n.data,
          isParent: parentIds.has(n.id),
          isChild: childIds.has(n.id),
        },
      })),
    );
  }, [initialNodes, selectedBlock, dialogue]);

  useEffect(() => {
    setEdges(
      initialEdges.map((e) => ({
        ...e,
        selected:
          !!selectedEdge &&
          e.data?.sourceBlockKey === selectedEdge.sourceBlockKey &&
          e.data?.optionIndex === selectedEdge.optionIndex,
      })),
    );
  }, [initialEdges, selectedEdge]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      const positionChanges = changes.filter(
        (c): c is NodeChange & { type: "position" } => c.type === "position",
      );
      if (positionChanges.some((c) => c.dragging === false)) {
        const next: NodePositions = { ...positions };
        const live = applyNodeChanges(changes, nodes);
        for (const n of live) {
          next[n.id === "exit" ? "__exit__" : n.id] = {
            x: n.position.x,
            y: n.position.y,
          };
        }
        onPositionsChange(next);
      }
    },
    [nodes, positions, onPositionsChange],
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnectHandler = useCallback(
    (c: Connection) => {
      if (!c.source || !c.target) return;
      onConnect(c.source, c.target);
    },
    [onConnect],
  );

  return (
    <div className="h-full w-full bg-paper-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectHandler}
        onNodeClick={(_, n) => {
          if (n.id === "exit") {
            onSelectBlock(null);
            return;
          }
          onSelectBlock(n.id);
        }}
        onEdgeClick={(_, e) => {
          if (!e.data) return;
          onSelectEdge({
            sourceBlockKey: (e.data as DialogueEdgeData).sourceBlockKey,
            optionIndex: (e.data as DialogueEdgeData).optionIndex,
          });
        }}
        onPaneClick={() => {
          onSelectBlock(null);
          onSelectEdge(null);
        }}
        onPaneContextMenu={(e) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          const rect = target
            .closest(".react-flow")!
            .getBoundingClientRect();
          onAddBlockAt({
            x: (e as unknown as MouseEvent).clientX - rect.left,
            y: (e as unknown as MouseEvent).clientY - rect.top,
          });
        }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d7d2c4" gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const d = n.data as DialogueNodeData;
            if (d?.isExit) return "#e9e5db";
            if (d?.hasError) return "#b91c1c";
            if (d?.hasWarning) return "#b45309";
            if (d?.key === "root") return "#23211d";
            return "#9c9585";
          }}
          maskColor="rgba(250,249,246,0.75)"
        />
      </ReactFlow>
    </div>
  );
}
