import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { DialogueNodeData } from "../logic/graphMapping";

const methodEmoji: Record<string, string> = {
  select: "👉",
  first: "1️⃣",
  random: "🎲",
  all: "🌟",
};

export default function DialogueNode({
  data,
  selected,
}: NodeProps<DialogueNodeData>) {
  if (data.isExit) {
    return (
      <div
        className={`px-4 py-2 rounded-full border-2 border-dashed font-bold text-ink shadow-cute bg-butter ${
          selected ? "ring-4 ring-rose-300" : ""
        }`}
      >
        <Handle type="target" position={Position.Left} className="!bg-rose-400" />
        🚪 exit
      </div>
    );
  }
  const isRoot = data.key === "root";
  const border = data.hasError
    ? "border-red-400"
    : data.hasWarning
      ? "border-amber-400"
      : isRoot
        ? "border-rose-400"
        : "border-sky2-300";
  const bg = isRoot ? "bg-rose-100" : "bg-white";
  return (
    <div
      className={`w-56 rounded-chonk ${bg} border-2 ${border} shadow-cute p-3 ${
        selected ? "ring-4 ring-rose-300" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-rose-400" />
      <Handle type="source" position={Position.Right} className="!bg-mint-400" />
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm font-extrabold text-ink truncate flex-1">
          {isRoot ? "🏠 " : ""}
          {data.key}
        </span>
        {data.hasError && <span title="errors">⛔</span>}
        {data.hasWarning && !data.hasError && (
          <span title="warnings">⚠️</span>
        )}
      </div>
      <div className="text-[10px] uppercase font-bold text-ink/60 mb-1">
        {methodEmoji[data.method] ?? ""} {data.method}
      </div>
      <div className="text-xs text-ink/80 line-clamp-3 italic mb-2 min-h-[2.4em]">
        {data.message ? `“${data.message}”` : "—"}
      </div>
      <div className="text-[10px] font-bold text-ink/60">
        {data.optionCount} option{data.optionCount === 1 ? "" : "s"}
      </div>
    </div>
  );
}
