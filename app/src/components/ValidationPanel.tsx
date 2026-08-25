import type { ValidationIssue } from "../types/dialogue";
import type { EdgeSelection } from "./DialogueGraph";

type Props = {
  issues: ValidationIssue[];
  onJumpToBlock: (key: string) => void;
  onJumpToEdge: (sel: EdgeSelection) => void;
};

export default function ValidationPanel({
  issues,
  onJumpToBlock,
  onJumpToEdge,
}: Props) {
  const errors = issues.filter((i) => i.type === "error");
  const warnings = issues.filter((i) => i.type === "warning");

  return (
    <div className="bg-paper-100 border-t border-paper-300 max-h-44 overflow-y-auto">
      <div className="px-3 py-2 bg-paper-100 border-b border-paper-300 font-semibold text-xs uppercase tracking-widest flex gap-3 items-center sticky top-0">
        <span>Validation</span>
        <span className="text-red-700">{errors.length} errors</span>
        <span className="text-amber-700">{warnings.length} warnings</span>
        {issues.length === 0 && (
          <span className="text-ink-500 normal-case tracking-normal">all good</span>
        )}
      </div>
      <ul className="text-xs divide-y divide-paper-200">
        {issues.map((i, idx) => (
          <li
            key={idx}
            onClick={() => {
              if (i.blockKey && i.optionIndex != null) {
                onJumpToEdge({
                  sourceBlockKey: i.blockKey,
                  optionIndex: i.optionIndex,
                });
              } else if (i.blockKey) {
                onJumpToBlock(i.blockKey);
              }
            }}
            className="px-3 py-1.5 hover:bg-paper-200 cursor-pointer flex gap-2"
          >
            <span className={i.type === "error" ? "text-red-700 font-bold" : "text-amber-700 font-bold"}>
              {i.type === "error" ? "!" : "?"}
            </span>
            <span className="font-mono text-ink-500 shrink-0">{i.path}</span>
            <span className="flex-1 text-ink-700">{i.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
