import type { DialogueFile, DialogueOption } from "../types/dialogue";
import StringListEditor from "./StringListEditor";

type Props = {
  dialogue: DialogueFile;
  sourceBlockKey: string;
  optionIndex: number;
  option: DialogueOption;
  parentMethod: string;
  onPatch: (patch: Partial<DialogueOption>) => void;
  onDelete: () => void;
  onCheckAdd: () => void;
  onCheckChange: (i: number, v: string) => void;
  onCheckDelete: (i: number) => void;
  onCheckMove: (from: number, to: number) => void;
  onActionAdd: () => void;
  onActionChange: (i: number, v: string) => void;
  onActionDelete: (i: number) => void;
  onActionMove: (from: number, to: number) => void;
  onJumpToBlock: (key: string) => void;
};

export default function OptionEditor({
  dialogue,
  sourceBlockKey,
  optionIndex,
  option,
  parentMethod,
  onPatch,
  onDelete,
  onCheckAdd,
  onCheckChange,
  onCheckDelete,
  onCheckMove,
  onActionAdd,
  onActionChange,
  onActionDelete,
  onActionMove,
  onJumpToBlock,
}: Props) {
  const blockKeys = Object.keys(dialogue);
  const targetExists =
    option.key === "exit" || blockKeys.includes(option.key);

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-ink-500 uppercase tracking-widest">
        Edge: {sourceBlockKey} → {option.key || "?"} (#{optionIndex})
      </div>

      <Field label="target block">
        <div className="flex gap-1">
          <input
            list="block-key-options"
            value={option.key}
            onChange={(e) => onPatch({ key: e.target.value })}
            className={`flex-1 px-2 py-1 rounded-card border outline-none bg-paper-50 font-mono text-sm ${
              targetExists
                ? "border-paper-300 focus:border-ink-500"
                : "border-red-700 focus:border-red-700"
            }`}
          />
          <datalist id="block-key-options">
            <option value="exit" />
            {blockKeys.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
          {option.key && targetExists && option.key !== "exit" && (
            <button
              onClick={() => onJumpToBlock(option.key)}
              className="text-xs px-2 rounded-card bg-paper-50 hover:bg-paper-200 border border-paper-300 font-medium"
              title="jump to target"
            >
              →
            </button>
          )}
        </div>
        {!targetExists && option.key && (
          <div className="text-[11px] text-red-700 mt-1">
            no such block. use 'exit' or create the block first.
          </div>
        )}
      </Field>

      <Field
        label="player message"
        hint={
          parentMethod === "select"
            ? "shown to player (recommended for select)"
            : "optional"
        }
      >
        <input
          value={option.message ?? ""}
          onChange={(e) => onPatch({ message: e.target.value })}
          placeholder='e.g. "leave"'
          className="w-full px-2 py-1 rounded-card border border-paper-300 focus:border-ink-500 outline-none bg-paper-50 text-sm font-serif"
        />
      </Field>

      <Field
        label={`checks (${option.checks.length})`}
        hint="all must pass · none = always enabled"
      >
        <StringListEditor
          items={option.checks}
          placeholder="e.g. qkey_quest1_0"
          addLabel="check"
          emptyLabel="no checks — always enabled"
          onChange={onCheckChange}
          onAdd={onCheckAdd}
          onDelete={onCheckDelete}
          onMove={onCheckMove}
        />
      </Field>

      <Field label={`actions (${option.actions.length})`}>
        <StringListEditor
          items={option.actions}
          placeholder="e.g. addk_quest1_0"
          addLabel="action"
          emptyLabel="no actions"
          onChange={onActionChange}
          onAdd={onActionAdd}
          onDelete={onActionDelete}
          onMove={onActionMove}
        />
      </Field>

      <button
        onClick={onDelete}
        className="text-xs px-3 py-1.5 rounded-card bg-paper-50 hover:bg-red-50 border border-red-700 font-medium text-red-700"
      >
        delete option
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase font-semibold text-ink-500 tracking-widest mb-1">
        {label}
        {hint && (
          <span className="ml-2 normal-case font-normal text-ink-300">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
