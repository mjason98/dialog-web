import type { DialogueFile, DialogueOption } from "../types/dialogue";
import ActionListEditor from "./ActionListEditor";

type Props = {
  dialogue: DialogueFile;
  sourceBlockKey: string;
  optionIndex: number;
  option: DialogueOption;
  parentMethod: string;
  onPatch: (patch: Partial<DialogueOption>) => void;
  onDelete: () => void;
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
      <div className="text-xs font-bold text-ink/60 uppercase tracking-wider">
        Edge: {sourceBlockKey} → {option.key || "?"} (#{optionIndex})
      </div>

      <Field label="target block">
        <div className="flex gap-1">
          <input
            list="block-key-options"
            value={option.key}
            onChange={(e) => onPatch({ key: e.target.value })}
            className={`flex-1 px-2 py-1 rounded-md border-2 outline-none bg-white font-mono text-sm ${
              targetExists
                ? "border-mint-200 focus:border-mint-400"
                : "border-red-300 focus:border-red-500"
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
              className="text-xs px-2 rounded-md bg-sky2-200 hover:bg-sky2-300 border-2 border-sky2-400 font-bold"
              title="jump to target"
            >
              →
            </button>
          )}
        </div>
        {!targetExists && option.key && (
          <div className="text-[11px] text-red-500 mt-1">
            ⛔ no such block. use 'exit' or create the block first.
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
          className="w-full px-2 py-1 rounded-md border-2 border-rose-200 focus:border-rose-400 outline-none bg-white text-sm"
        />
      </Field>

      <Field label="check" hint="empty = always enabled">
        <input
          value={option.check}
          onChange={(e) => onPatch({ check: e.target.value })}
          placeholder="e.g. qkey_quest1_0"
          className="w-full px-2 py-1 rounded-md border-2 border-sky2-200 focus:border-sky2-400 outline-none bg-white font-mono text-sm"
        />
      </Field>

      <Field label="actions">
        <ActionListEditor
          actions={option.actions}
          onChange={onActionChange}
          onAdd={onActionAdd}
          onDelete={onActionDelete}
          onMove={onActionMove}
        />
      </Field>

      <button
        onClick={onDelete}
        className="text-xs px-3 py-1.5 rounded-full bg-red-100 hover:bg-red-200 border-2 border-red-300 font-bold text-red-700"
      >
        🗑️ delete option
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
      <div className="text-[11px] uppercase font-bold text-ink/60 tracking-wider mb-1">
        {label}
        {hint && (
          <span className="ml-2 normal-case font-normal text-ink/40">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
