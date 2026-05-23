import { useRef } from "react";

type Props = {
  onNew: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onValidate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasErrors: boolean;
};

export default function TopBar({
  onNew,
  onImport,
  onExport,
  onValidate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasErrors,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-rose-100 border-b-4 border-rose-200">
      <div className="text-xl font-extrabold text-ink mr-2 flex items-center gap-2">
        <span aria-hidden>💬</span>
        <span>Dialogue Editor</span>
      </div>
      <Btn onClick={onNew} color="mint">
        ✨ New
      </Btn>
      <Btn onClick={() => fileRef.current?.click()} color="sky">
        📂 Import
      </Btn>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImport(file);
          e.target.value = "";
        }}
      />
      <Btn
        onClick={onExport}
        color="rose"
        disabled={hasErrors}
        title={
          hasErrors ? "Fix validation errors before exporting." : "Download JSON"
        }
      >
        💾 Export
      </Btn>
      <Btn onClick={onValidate} color="butter">
        🔎 Validate
      </Btn>
      <div className="ml-auto flex items-center gap-2">
        <Btn onClick={onUndo} color="white" disabled={!canUndo}>
          ↶ Undo
        </Btn>
        <Btn onClick={onRedo} color="white" disabled={!canRedo}>
          ↷ Redo
        </Btn>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  color,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: "mint" | "sky" | "rose" | "butter" | "white";
  disabled?: boolean;
  title?: string;
}) {
  const map: Record<string, string> = {
    mint: "bg-mint-200 hover:bg-mint-300 border-mint-400",
    sky: "bg-sky2-200 hover:bg-sky2-300 border-sky2-400",
    rose: "bg-rose-200 hover:bg-rose-300 border-rose-400",
    butter: "bg-butter hover:bg-yellow-200 border-yellow-300",
    white: "bg-white hover:bg-gray-100 border-gray-300",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${map[color]} text-ink font-bold text-sm px-3 py-1.5 rounded-full border-2 shadow-cute active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed transition`}
    >
      {children}
    </button>
  );
}
