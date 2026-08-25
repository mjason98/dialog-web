import { useRef, useState } from "react";

type Props = {
  json: string;
  onClose: () => void;
};

export default function PreviewModal({ json, onClose }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API failed (insecure context / denied). Fall back to selecting
      // the text so the user can copy it by hand.
      const ta = taRef.current;
      if (ta) {
        ta.focus();
        ta.select();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper-50 rounded-card border border-paper-300 shadow-soft w-full max-w-2xl min-h-[80vh] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-paper-300">
          <span className="font-serif text-lg font-semibold text-ink">
            Preview JSON
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-ink-900 hover:bg-ink-700 border-ink-900 text-paper-50 font-medium text-sm px-3 py-1.5 rounded-card border shadow-soft transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="bg-paper-50 hover:bg-paper-200 border-paper-300 text-ink font-medium text-sm px-3 py-1.5 rounded-card border shadow-soft transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <textarea
          ref={taRef}
          readOnly
          value={json}
          onFocus={(e) => e.target.select()}
          spellCheck={false}
          className="flex-1 m-4 p-3 rounded-card border border-paper-300 bg-paper-100 font-mono text-xs text-ink resize-none focus:outline-none focus:border-ink-500"
        />
      </div>
    </div>
  );
}
