import type {
  DialogueFile,
  DialogueMethod,
  DialogueOption,
} from "../types/dialogue";
import BlockEditor from "./BlockEditor";
import OptionEditor from "./OptionEditor";
import type { EdgeSelection } from "./DialogueGraph";

type Props = {
  dialogue: DialogueFile;
  selectedBlock: string | null;
  selectedEdge: EdgeSelection | null;
  onSelectBlock: (key: string | null) => void;
  onSelectEdge: (sel: EdgeSelection | null) => void;

  onMessage: (key: string, v: string) => void;
  onMethod: (key: string, v: DialogueMethod) => void;
  onAddOption: (key: string) => void;
  onDeleteOption: (key: string, index: number) => void;
  onMoveOption: (key: string, from: number, to: number) => void;
  onPatchOption: (
    key: string,
    index: number,
    patch: Partial<DialogueOption>,
  ) => void;
  onAddAction: (key: string, optIndex: number) => void;
  onChangeAction: (
    key: string,
    optIndex: number,
    actionIndex: number,
    value: string,
  ) => void;
  onDeleteAction: (key: string, optIndex: number, actionIndex: number) => void;
  onMoveAction: (
    key: string,
    optIndex: number,
    from: number,
    to: number,
  ) => void;
};

export default function InspectorPanel(p: Props) {
  const {
    dialogue,
    selectedBlock,
    selectedEdge,
    onSelectBlock,
    onSelectEdge,
  } = p;

  if (selectedEdge) {
    const block = dialogue[selectedEdge.sourceBlockKey];
    const opt = block?.options[selectedEdge.optionIndex];
    if (!block || !opt) {
      return (
        <Empty message="Edge no longer exists." onClear={() => onSelectEdge(null)} />
      );
    }
    return (
      <PanelShell title="✨ Option / Edge">
        <OptionEditor
          dialogue={dialogue}
          sourceBlockKey={selectedEdge.sourceBlockKey}
          optionIndex={selectedEdge.optionIndex}
          option={opt}
          parentMethod={block.method}
          onPatch={(patch) =>
            p.onPatchOption(
              selectedEdge.sourceBlockKey,
              selectedEdge.optionIndex,
              patch,
            )
          }
          onDelete={() => {
            p.onDeleteOption(
              selectedEdge.sourceBlockKey,
              selectedEdge.optionIndex,
            );
            onSelectEdge(null);
          }}
          onActionAdd={() =>
            p.onAddAction(
              selectedEdge.sourceBlockKey,
              selectedEdge.optionIndex,
            )
          }
          onActionChange={(i, v) =>
            p.onChangeAction(
              selectedEdge.sourceBlockKey,
              selectedEdge.optionIndex,
              i,
              v,
            )
          }
          onActionDelete={(i) =>
            p.onDeleteAction(
              selectedEdge.sourceBlockKey,
              selectedEdge.optionIndex,
              i,
            )
          }
          onActionMove={(from, to) =>
            p.onMoveAction(
              selectedEdge.sourceBlockKey,
              selectedEdge.optionIndex,
              from,
              to,
            )
          }
          onJumpToBlock={(k) => {
            onSelectEdge(null);
            onSelectBlock(k);
          }}
        />
      </PanelShell>
    );
  }

  if (selectedBlock) {
    const block = dialogue[selectedBlock];
    if (!block) {
      return (
        <Empty
          message="Block no longer exists."
          onClear={() => onSelectBlock(null)}
        />
      );
    }
    return (
      <PanelShell title="📝 Block">
        <BlockEditor
          blockKey={selectedBlock}
          block={block}
          dialogue={dialogue}
          onMessage={(v) => p.onMessage(selectedBlock, v)}
          onMethod={(v) => p.onMethod(selectedBlock, v)}
          onAddOption={() => p.onAddOption(selectedBlock)}
          onSelectOption={(i) =>
            onSelectEdge({ sourceBlockKey: selectedBlock, optionIndex: i })
          }
          onDeleteOption={(i) => p.onDeleteOption(selectedBlock, i)}
          onMoveOption={(from, to) =>
            p.onMoveOption(selectedBlock, from, to)
          }
          onPatchOption={(i, patch) =>
            p.onPatchOption(selectedBlock, i, patch)
          }
          selectedOptionIndex={null}
        />
      </PanelShell>
    );
  }

  return (
    <PanelShell title="✨ Inspector">
      <div className="text-sm text-ink/60 italic">
        Click a block or an option/edge to start editing.
      </div>
    </PanelShell>
  );
}

function PanelShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto bg-cream border-l-4 border-rose-200">
      <div className="sticky top-0 bg-rose-100 border-b-2 border-rose-200 px-3 py-2 font-extrabold text-sm text-ink">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Empty({
  message,
  onClear,
}: {
  message: string;
  onClear: () => void;
}) {
  return (
    <PanelShell title="✨ Inspector">
      <div className="text-sm text-ink/60 italic mb-2">{message}</div>
      <button
        onClick={onClear}
        className="text-xs px-3 py-1 rounded-full bg-rose-200 hover:bg-rose-300 border-2 border-rose-400 font-bold"
      >
        clear
      </button>
    </PanelShell>
  );
}
