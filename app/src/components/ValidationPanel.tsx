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
    <div className="bg-cream border-t-4 border-rose-200 max-h-44 overflow-y-auto">
      <div className="px-3 py-2 bg-rose-100 border-b-2 border-rose-200 font-extrabold text-sm flex gap-3 items-center sticky top-0">
        <span>🔎 Validation</span>
        <span className="text-red-600">⛔ {errors.length}</span>
        <span className="text-amber-600">⚠️ {warnings.length}</span>
        {issues.length === 0 && (
          <span className="text-mint-500">✓ all good</span>
        )}
      </div>
      <ul className="text-xs divide-y divide-rose-100">
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
            className="px-3 py-1.5 hover:bg-rose-50 cursor-pointer flex gap-2"
          >
            <span>
              {i.type === "error" ? "⛔" : "⚠️"}
            </span>
            <span className="font-mono text-ink/60 shrink-0">{i.path}</span>
            <span className="flex-1 text-ink">{i.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
