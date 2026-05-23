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
      <div className="text-xs font-bold text-ink/60 uppercase tracking-wider">
        Block: <span className="font-mono">{blockKey}</span>
      </div>

      <div>
        <div className="text-[11px] uppercase font-bold text-ink/60 tracking-wider mb-1">
          message
        </div>
        <textarea
          value={block.message}
          onChange={(e) => onMessage(e.target.value)}
          rows={4}
          placeholder="what the NPC says…"
          className="w-full px-3 py-2 rounded-xl border-2 border-rose-200 focus:border-rose-400 outline-none bg-white text-sm resize-y"
        />
      </div>

      <div>
        <div className="text-[11px] uppercase font-bold text-ink/60 tracking-wider mb-1">
          method
        </div>
        <div className="flex flex-wrap gap-1">
          {VALID_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => onMethod(m)}
              className={`text-xs px-3 py-1 rounded-full border-2 font-bold transition ${
                block.method === m
                  ? "bg-rose-300 border-rose-500 text-white shadow-cute"
                  : "bg-white border-rose-200 hover:bg-rose-100 text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-1">
          <div className="text-[11px] uppercase font-bold text-ink/60 tracking-wider flex-1">
            options ({block.options.length})
          </div>
          <button
            onClick={onAddOption}
            className="text-xs px-3 py-1 rounded-full bg-mint-200 hover:bg-mint-300 border-2 border-mint-400 font-bold shadow-cute"
          >
            ＋ option
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
                className={`rounded-xl border-2 p-2 cursor-pointer transition ${
                  isSel
                    ? "bg-rose-100 border-rose-400 shadow-cute"
                    : "bg-white border-gray-200 hover:border-rose-200"
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-bold text-ink/60">#{i}</span>
                  <span className="text-sm flex-1 truncate">
                    {opt.message ? (
                      <span>“{opt.message}”</span>
                    ) : (
                      <span className="text-ink/40 italic">no message</span>
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveOption(i, i - 1);
                    }}
                    disabled={i === 0}
                    className="text-xs w-6 h-6 grid place-items-center rounded-md hover:bg-gray-100 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveOption(i, i + 1);
                    }}
                    disabled={i === block.options.length - 1}
                    className="text-xs w-6 h-6 grid place-items-center rounded-md hover:bg-gray-100 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOption(i);
                    }}
                    className="text-xs w-6 h-6 grid place-items-center rounded-md hover:bg-rose-100"
                    title="delete"
                  >
                    🗑️
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold text-ink/60">
                    →
                  </span>
                  <input
                    value={opt.key}
                    onChange={(e) =>
                      onPatchOption(i, { key: e.target.value })
                    }
                    onClick={(e) => e.stopPropagation()}
                    list="block-key-options"
                    className={`flex-1 px-2 py-1 text-xs rounded-md border-2 outline-none bg-white font-mono ${
                      targetExists
                        ? "border-mint-200 focus:border-mint-400"
                        : "border-red-300"
                    }`}
                  />
                  {opt.check && (
                    <span title={`check: ${opt.check}`} className="text-xs">
                      🔒
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
            <div className="text-xs text-ink/50 italic">
              no options yet. add one to link to another block.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
