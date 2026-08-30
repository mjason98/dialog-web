import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { DialogueNodeData } from "../logic/graphMapping";

const methodMark: Record<string, string> = {
  select: "◇",
  first: "→",
  random: "⁂",
};

export default function DialogueNode({
  data,
  selected,
}: NodeProps<DialogueNodeData>) {
  if (data.isExit) {
    return (
      <div
        className={`px-4 py-2 rounded-card border border-dashed border-ink-300 bg-paper-100 font-medium text-ink-700 text-sm ${
          selected ? "ring-2 ring-ink-900" : data.isParent ? "ring-2 ring-amber-500" : data.isChild ? "ring-2 ring-sky-500" : ""
        }`}
      >
        <Handle type="target" position={Position.Top} className="!bg-ink-500" />
        exit
      </div>
    );
  }
  const isRoot = data.key === "root";
  const border = data.hasError
    ? "border-red-700"
    : data.hasWarning
      ? "border-amber-700"
      : isRoot
        ? "border-ink-900"
        : "border-paper-300";
  const bg = isRoot ? "bg-paper-100" : "bg-paper-50";
  return (
    <div
      className={`w-56 rounded-card ${bg} border ${border} shadow-soft p-3 ${
        selected ? "ring-2 ring-ink-900" : data.isParent ? "ring-2 ring-amber-500" : data.isChild ? "ring-2 ring-sky-500" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-ink-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-ink-500" />
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm font-semibold text-ink truncate flex-1 font-mono">
          {data.key}
        </span>
        {data.hasError && (
          <span title="errors" className="text-red-700 font-bold">
            !
          </span>
        )}
        {data.hasWarning && !data.hasError && (
          <span title="warnings" className="text-amber-700 font-bold">
            ?
          </span>
        )}
      </div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500 mb-1">
        {methodMark[data.method] ?? ""} {data.method}
      </div>
      <div className="text-xs text-ink-700 line-clamp-3 italic mb-2 min-h-[2.4em] font-serif">
        {data.message ? `“${data.message}”` : "—"}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] font-medium text-ink-500 mr-auto">
          {data.optionCount} option{data.optionCount === 1 ? "" : "s"}
        </span>
        {data.checkCount > 0 && (
          <Tag
            title={`${data.checkCount} check${
              data.checkCount === 1 ? "" : "s"
            } across this block's options`}
          >
            🔒 {data.checkCount}
          </Tag>
        )}
        {data.actionCount > 0 && (
          <Tag
            title={`${data.actionCount} action${
              data.actionCount === 1 ? "" : "s"
            } across this block's options`}
          >
            ⚡ {data.actionCount}
          </Tag>
        )}
      </div>
    </div>
  );
}

function Tag({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className="text-[10px] font-medium text-ink-700 px-1.5 py-0.5 rounded-sm border border-paper-300 bg-paper-100"
    >
      {children}
    </span>
  );
}
