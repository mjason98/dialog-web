import { useRef } from "react";

type Props = {
  onNew: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onPreview: () => void;
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
  onPreview,
  onValidate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasErrors,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-paper-100 border-b border-paper-300">
      <div className="font-serif text-xl font-semibold text-ink mr-3 tracking-tight">
        Dialogue Editor
      </div>
      <Btn onClick={onNew}>New</Btn>
      <Btn onClick={() => fileRef.current?.click()}>Import</Btn>
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
        variant="primary"
        disabled={hasErrors}
        title={
          hasErrors ? "Fix validation errors before exporting." : "Download JSON"
        }
      >
        Export
      </Btn>
      <Btn onClick={onPreview}>Preview</Btn>
      <Btn onClick={onValidate}>Validate</Btn>
      <div className="ml-auto flex items-center gap-2">
        <Btn onClick={onUndo} disabled={!canUndo}>
          ↶ Undo
        </Btn>
        <Btn onClick={onRedo} disabled={!canRedo}>
          ↷ Redo
        </Btn>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "default",
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary";
  disabled?: boolean;
  title?: string;
}) {
  const style =
    variant === "primary"
      ? "bg-ink-900 hover:bg-ink-700 border-ink-900 text-paper-50"
      : "bg-paper-50 hover:bg-paper-200 border-paper-300 text-ink";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${style} font-medium text-sm px-3 py-1.5 rounded-card border shadow-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
    >
      {children}
    </button>
  );
}
