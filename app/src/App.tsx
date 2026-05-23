import { useCallback, useEffect, useMemo, useState } from "react";
import BlockList from "./components/BlockList";
import DialogueGraph, {
  type EdgeSelection,
} from "./components/DialogueGraph";
import InspectorPanel from "./components/InspectorPanel";
import Resizer from "./components/Resizer";
import TopBar from "./components/TopBar";
import ValidationPanel from "./components/ValidationPanel";
import { defaultDialogue } from "./data/defaultDialogue";
import {
  addActionString,
  addBlock,
  addOption,
  deleteActionString,
  deleteBlock,
  deleteOption,
  duplicateBlock,
  moveActionString,
  moveOption,
  renameBlock,
  setActionString,
  setMessage,
  setMethod,
  updateOption,
} from "./logic/dialogueActions";
import { exportDialogueFile, importDialogueFile } from "./logic/importExport";
import type { NodePositions } from "./logic/graphMapping";
import { hasErrors, validateDialogue } from "./logic/validation";
import type {
  DialogueFile,
  DialogueMethod,
  DialogueOption,
} from "./types/dialogue";

type HistoryEntry = { dialogue: DialogueFile };

export default function App() {
  const [dialogue, setDialogue] = useState<DialogueFile>(defaultDialogue);
  const [past, setPast] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>("root");
  const [selectedEdge, setSelectedEdge] = useState<EdgeSelection | null>(null);
  const [positions, setPositions] = useState<NodePositions>({});
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    const v = Number(localStorage.getItem("leftWidth"));
    return Number.isFinite(v) && v > 0 ? v : 224;
  });
  const [rightWidth, setRightWidth] = useState<number>(() => {
    const v = Number(localStorage.getItem("rightWidth"));
    return Number.isFinite(v) && v > 0 ? v : 352;
  });

  const clampLeft = (n: number) => Math.max(160, Math.min(560, n));
  const clampRight = (n: number) => Math.max(240, Math.min(720, n));

  useEffect(() => {
    localStorage.setItem("leftWidth", String(leftWidth));
  }, [leftWidth]);
  useEffect(() => {
    localStorage.setItem("rightWidth", String(rightWidth));
  }, [rightWidth]);

  const apply = useCallback(
    (next: DialogueFile) => {
      setPast((p) => [...p.slice(-49), { dialogue }]);
      setFuture([]);
      setDialogue(next);
    },
    [dialogue],
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [{ dialogue }, ...f].slice(0, 50));
      setDialogue(prev.dialogue);
      return p.slice(0, -1);
    });
  }, [dialogue]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, { dialogue }].slice(-50));
      setDialogue(next.dialogue);
      return f.slice(1);
    });
  }, [dialogue]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (inField) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const issues = useMemo(() => validateDialogue(dialogue), [dialogue]);
  const exportBlocked = hasErrors(issues);

  const handleNew = useCallback(() => {
    if (!confirm("Start a new dialogue? Unsaved changes will be lost.")) return;
    apply(defaultDialogue);
    setSelectedBlock("root");
    setSelectedEdge(null);
    setPositions({});
  }, [apply]);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        const data = await importDialogueFile(file);
        apply(data);
        setSelectedBlock(Object.keys(data)[0] ?? null);
        setSelectedEdge(null);
        setPositions({});
      } catch (err) {
        alert(`Import failed: ${(err as Error).message}`);
      }
    },
    [apply],
  );

  const handleExport = useCallback(() => {
    if (exportBlocked) {
      alert("Fix validation errors before exporting.");
      return;
    }
    exportDialogueFile(dialogue);
  }, [dialogue, exportBlocked]);

  const handleAddBlock = useCallback(
    (key: string) => {
      try {
        const next = addBlock(dialogue, key);
        apply(next);
        setSelectedBlock(key);
        setSelectedEdge(null);
      } catch (e) {
        alert((e as Error).message);
      }
    },
    [dialogue, apply],
  );

  const handleDeleteBlock = useCallback(
    (key: string) => {
      try {
        const next = deleteBlock(dialogue, key);
        apply(next);
        if (selectedBlock === key) setSelectedBlock(null);
        setSelectedEdge(null);
      } catch (e) {
        alert((e as Error).message);
      }
    },
    [dialogue, apply, selectedBlock],
  );

  const handleDuplicate = useCallback(
    (key: string) => {
      try {
        apply(duplicateBlock(dialogue, key));
      } catch (e) {
        alert((e as Error).message);
      }
    },
    [dialogue, apply],
  );

  const handleRename = useCallback(
    (oldKey: string, newKey: string) => {
      if (!newKey || newKey === oldKey) return;
      try {
        apply(renameBlock(dialogue, oldKey, newKey));
        if (selectedBlock === oldKey) setSelectedBlock(newKey);
        setPositions((p) => {
          if (!p[oldKey]) return p;
          const next = { ...p };
          next[newKey] = next[oldKey];
          delete next[oldKey];
          return next;
        });
      } catch (e) {
        alert((e as Error).message);
      }
    },
    [dialogue, apply, selectedBlock],
  );

  const handleAddOption = useCallback(
    (blockKey: string) => {
      apply(
        addOption(dialogue, blockKey, {
          key: "exit",
          check: "",
          actions: [],
          message: "",
        }),
      );
    },
    [dialogue, apply],
  );

  const handleConnect = useCallback(
    (source: string, target: string) => {
      if (target === source) return;
      apply(
        addOption(dialogue, source, {
          key: target,
          check: "",
          actions: [],
          message: "",
        }),
      );
    },
    [dialogue, apply],
  );

  const handleAddBlockAt = useCallback(
    (pos: { x: number; y: number }) => {
      const name = prompt("New block key:");
      if (!name) return;
      const trimmed = name.trim();
      try {
        apply(addBlock(dialogue, trimmed));
        setPositions((p) => ({ ...p, [trimmed]: pos }));
        setSelectedBlock(trimmed);
      } catch (e) {
        alert((e as Error).message);
      }
    },
    [dialogue, apply],
  );

  const handlePatchOption = useCallback(
    (blockKey: string, index: number, patch: Partial<DialogueOption>) => {
      apply(updateOption(dialogue, blockKey, index, patch));
    },
    [dialogue, apply],
  );

  const handleDeleteOption = useCallback(
    (blockKey: string, index: number) => {
      apply(deleteOption(dialogue, blockKey, index));
    },
    [dialogue, apply],
  );

  const handleMoveOption = useCallback(
    (blockKey: string, from: number, to: number) => {
      apply(moveOption(dialogue, blockKey, from, to));
    },
    [dialogue, apply],
  );

  const handleMessage = useCallback(
    (key: string, v: string) => apply(setMessage(dialogue, key, v)),
    [dialogue, apply],
  );

  const handleMethod = useCallback(
    (key: string, v: DialogueMethod) => apply(setMethod(dialogue, key, v)),
    [dialogue, apply],
  );

  const handleAddAction = useCallback(
    (blockKey: string, optIndex: number) =>
      apply(addActionString(dialogue, blockKey, optIndex, "")),
    [dialogue, apply],
  );

  const handleChangeAction = useCallback(
    (blockKey: string, optIndex: number, actionIndex: number, value: string) =>
      apply(setActionString(dialogue, blockKey, optIndex, actionIndex, value)),
    [dialogue, apply],
  );

  const handleDeleteAction = useCallback(
    (blockKey: string, optIndex: number, actionIndex: number) =>
      apply(deleteActionString(dialogue, blockKey, optIndex, actionIndex)),
    [dialogue, apply],
  );

  const handleMoveAction = useCallback(
    (blockKey: string, optIndex: number, from: number, to: number) =>
      apply(moveActionString(dialogue, blockKey, optIndex, from, to)),
    [dialogue, apply],
  );

  return (
    <div className="h-full flex flex-col">
      <TopBar
        onNew={handleNew}
        onImport={handleImport}
        onExport={handleExport}
        onValidate={() => {
          if (issues.length === 0) alert("✓ all good!");
          else
            alert(
              `${issues.filter((i) => i.type === "error").length} errors, ${
                issues.filter((i) => i.type === "warning").length
              } warnings`,
            );
        }}
        onUndo={undo}
        onRedo={redo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        hasErrors={exportBlocked}
      />
      <div className="flex-1 flex min-h-0">
        <div style={{ width: leftWidth }} className="shrink-0 h-full">
          <BlockList
            dialogue={dialogue}
            selected={selectedBlock}
            issues={issues}
            onSelect={(k) => {
              setSelectedBlock(k);
              setSelectedEdge(null);
            }}
            onAdd={handleAddBlock}
            onDelete={handleDeleteBlock}
            onDuplicate={handleDuplicate}
            onRename={handleRename}
          />
        </div>
        <Resizer
          side="left"
          onResize={(delta) => setLeftWidth((w) => clampLeft(w + delta))}
        />
        <div className="flex-1 min-w-0 h-full">
        <DialogueGraph
          dialogue={dialogue}
          issues={issues}
          selectedBlock={selectedBlock}
          selectedEdge={selectedEdge}
          positions={positions}
          onPositionsChange={setPositions}
          onSelectBlock={(k) => {
            setSelectedBlock(k);
            setSelectedEdge(null);
          }}
          onSelectEdge={(s) => {
            setSelectedEdge(s);
            if (s) setSelectedBlock(null);
          }}
          onConnect={handleConnect}
          onAddBlockAt={handleAddBlockAt}
        />
        </div>
        <Resizer
          side="right"
          onResize={(delta) => setRightWidth((w) => clampRight(w + delta))}
        />
        <div style={{ width: rightWidth }} className="shrink-0 h-full">
        <InspectorPanel
          dialogue={dialogue}
          selectedBlock={selectedBlock}
          selectedEdge={selectedEdge}
          onSelectBlock={(k) => {
            setSelectedBlock(k);
            setSelectedEdge(null);
          }}
          onSelectEdge={setSelectedEdge}
          onMessage={handleMessage}
          onMethod={handleMethod}
          onAddOption={handleAddOption}
          onDeleteOption={handleDeleteOption}
          onMoveOption={handleMoveOption}
          onPatchOption={handlePatchOption}
          onAddAction={handleAddAction}
          onChangeAction={handleChangeAction}
          onDeleteAction={handleDeleteAction}
          onMoveAction={handleMoveAction}
        />
        </div>
      </div>
      <ValidationPanel
        issues={issues}
        onJumpToBlock={(k) => {
          setSelectedBlock(k);
          setSelectedEdge(null);
        }}
        onJumpToEdge={(s) => {
          setSelectedEdge(s);
          setSelectedBlock(null);
        }}
      />
    </div>
  );
}
