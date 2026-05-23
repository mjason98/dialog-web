import type { Edge, Node } from "reactflow";
import type { DialogueFile, ValidationIssue } from "../types/dialogue";
import { RESERVED_KEYS } from "../types/dialogue";

export type NodePositions = Record<string, { x: number; y: number }>;

export type DialogueNodeData = {
  key: string;
  message: string;
  method: string;
  optionCount: number;
  isExit?: boolean;
  hasError?: boolean;
  hasWarning?: boolean;
};

export type DialogueEdgeData = {
  sourceBlockKey: string;
  optionIndex: number;
  check: string;
  actions: string[];
  message?: string;
  broken?: boolean;
};

export function shouldShowExitNode(dialogue: DialogueFile): boolean {
  return Object.values(dialogue).some((block) =>
    block.options.some((option) => option.key === "exit"),
  );
}

export function dialogueToNodes(
  dialogue: DialogueFile,
  positions: NodePositions,
  issues: ValidationIssue[],
): Node<DialogueNodeData>[] {
  const issueMap = new Map<string, { error: boolean; warning: boolean }>();
  for (const issue of issues) {
    if (!issue.blockKey) continue;
    const cur = issueMap.get(issue.blockKey) ?? {
      error: false,
      warning: false,
    };
    if (issue.type === "error") cur.error = true;
    else cur.warning = true;
    issueMap.set(issue.blockKey, cur);
  }

  const entries = Object.entries(dialogue);
  const nodes: Node<DialogueNodeData>[] = entries.map(([key, block], i) => {
    const pos =
      positions[key] ?? {
        x: (i % 4) * 280,
        y: Math.floor(i / 4) * 200,
      };
    const flags = issueMap.get(key) ?? { error: false, warning: false };
    return {
      id: key,
      type: "dialogueNode",
      position: pos,
      data: {
        key,
        message: block.message,
        method: block.method,
        optionCount: block.options.length,
        hasError: flags.error,
        hasWarning: flags.warning,
      },
    };
  });

  if (shouldShowExitNode(dialogue)) {
    const exitPos = positions["__exit__"] ?? {
      x: (entries.length % 4) * 280,
      y: Math.floor(entries.length / 4) * 200,
    };
    nodes.push({
      id: "exit",
      type: "dialogueNode",
      position: exitPos,
      data: {
        key: "exit",
        message: "(end dialogue)",
        method: "—",
        optionCount: 0,
        isExit: true,
      },
    });
  }

  return nodes;
}

export function dialogueToEdges(dialogue: DialogueFile): Edge<DialogueEdgeData>[] {
  const blockKeys = new Set(Object.keys(dialogue));
  const edges: Edge<DialogueEdgeData>[] = [];

  for (const [blockKey, block] of Object.entries(dialogue)) {
    block.options.forEach((option, index) => {
      const broken =
        !!option.key &&
        !blockKeys.has(option.key) &&
        !RESERVED_KEYS.includes(option.key);
      const conditional = !!option.check;
      const className = [
        broken ? "broken" : "",
        conditional ? "conditional" : "",
      ]
        .filter(Boolean)
        .join(" ");
      edges.push({
        id: `${blockKey}-${index}-${option.key}`,
        source: blockKey,
        target: option.key || "exit",
        label: option.message || option.key || "?",
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 8,
        labelBgStyle: { fill: "#fff", stroke: "#3a3149", strokeWidth: 0 },
        className,
        data: {
          sourceBlockKey: blockKey,
          optionIndex: index,
          check: option.check,
          actions: option.actions,
          message: option.message,
          broken,
        },
      });
    });
  }
  return edges;
}
