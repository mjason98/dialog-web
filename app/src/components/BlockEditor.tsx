import type {
  DialogueBlock,
  DialogueFile,
  DialogueMethod,
  DialogueOption,
} from "../types/dialogue";
import { VALID_METHODS } from "../types/dialogue";

type Props = {
  blockKey: string;
  block: DialogueBlock;
  dialogue: DialogueFile;
  onMessage: (v: string) => void;
  onMethod: (v: DialogueMethod) => void;
  onAddOption: () => void;
  onSelectOption: (index: number) => void;
  onDeleteOption: (index: number) => void;
  onMoveOption: (from: number, to: number) => void;
  onPatchOption: (index: number, patch: Partial<DialogueOption>) => void;
  selectedOptionIndex: number | null;
};

export default function BlockEditor({
  blockKey,
  block,
  dialogue,
  onMessage,
  onMethod,
  onAddOption,
  onSelectOption,
  onDeleteOption,
  onMoveOption,
  onPatchOption,
  selectedOptionIndex,
}: Props) {
  const blockKeys = Object.keys(dialogue);

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-ink-500 uppercase tracking-widest">
        Block: <span className="font-mono normal-case text-ink">{blockKey}</span>
      </div>

      <div>
        <div className="text-[11px] uppercase font-semibold text-ink-500 tracking-widest mb-1">
          message
        </div>
        <textarea
          value={block.message}
          onChange={(e) => onMessage(e.target.value)}
          rows={4}
          placeholder="what the NPC says…"
          className="w-full px-3 py-2 rounded-card border border-paper-300 focus:border-ink-500 outline-none bg-paper-50 text-sm resize-y"
        />
      </div>

      <div>
        <div className="text-[11px] uppercase font-semibold text-ink-500 tracking-widest mb-1">
          method
        </div>
        <div className="flex flex-wrap gap-1">
          {VALID_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => onMethod(m)}
              className={`text-xs px-3 py-1 rounded-card border font-medium transition-colors ${
                block.method === m
                  ? "bg-ink-900 border-ink-900 text-paper-50"
                  : "bg-paper-50 border-paper-300 hover:bg-paper-200 text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-1">
          <div className="text-[11px] uppercase font-semibold text-ink-500 tracking-widest flex-1">
            options ({block.options.length})
          </div>
          <button
            onClick={onAddOption}
            className="text-xs px-3 py-1 rounded-card bg-paper-50 hover:bg-paper-200 border border-paper-300 font-medium"
          >
            + option
          </button>
        </div>
        <div className="space-y-2">
          {block.options.map((opt, i) => {
            const targetExists =
              opt.key === "exit" || blockKeys.includes(opt.key);
            const isSel = i === selectedOptionIndex;
            return (
              <div
                key={i}
                onClick={() => onSelectOption(i)}
                className={`rounded-card border p-2 cursor-pointer transition-colors ${
                  isSel
                    ? "bg-paper-200 border-ink-500"
                    : "bg-paper-50 border-paper-300 hover:border-ink-300"
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-mono text-ink-500">#{i}</span>
                  <span className="text-sm flex-1 truncate font-serif">
                    {opt.message ? (
                      <span>“{opt.message}”</span>
                    ) : (
                      <span className="text-ink-300 italic">no message</span>
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveOption(i, i - 1);
                    }}
                    disabled={i === 0}
                    className="text-xs w-6 h-6 grid place-items-center rounded-sm hover:bg-paper-200 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveOption(i, i + 1);
                    }}
                    disabled={i === block.options.length - 1}
                    className="text-xs w-6 h-6 grid place-items-center rounded-sm hover:bg-paper-200 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOption(i);
                    }}
                    className="text-xs w-6 h-6 grid place-items-center rounded-sm hover:bg-paper-200"
                    title="delete"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold text-ink-500">
                    →
                  </span>
                  <input
                    value={opt.key}
                    onChange={(e) =>
                      onPatchOption(i, { key: e.target.value })
                    }
                    onClick={(e) => e.stopPropagation()}
                    list="block-key-options"
                    className={`flex-1 px-2 py-1 text-xs rounded-sm border outline-none bg-paper-50 font-mono ${
                      targetExists
                        ? "border-paper-300 focus:border-ink-500"
                        : "border-red-700"
                    }`}
                  />
                  {opt.checks.length > 0 && (
                    <span
                      title={`checks (all must pass): ${opt.checks.join(", ")}`}
                      className="text-xs"
                    >
                      🔒{opt.checks.length}
                    </span>
                  )}
                  {opt.actions.length > 0 && (
                    <span
                      title={`actions: ${opt.actions.join(", ")}`}
                      className="text-xs"
                    >
                      ⚡{opt.actions.length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {block.options.length === 0 && (
            <div className="text-xs text-ink-500 italic">
              no options yet. add one to link to another block.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
