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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border-4 border-rose-200 shadow-cute w-full max-w-2xl min-h-[80vh] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b-4 border-rose-100">
          <span className="text-lg font-extrabold text-ink flex items-center gap-2">
            <span aria-hidden>👀</span>
            <span>Preview JSON</span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-mint-200 hover:bg-mint-300 border-mint-400 text-ink font-bold text-sm px-3 py-1.5 rounded-full border-2 shadow-cute active:translate-y-[2px] active:shadow-none transition"
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button
              onClick={onClose}
              className="bg-white hover:bg-gray-100 border-gray-300 text-ink font-bold text-sm px-3 py-1.5 rounded-full border-2 shadow-cute active:translate-y-[2px] active:shadow-none transition"
            >
              ✕ Close
            </button>
          </div>
        </div>
        <textarea
          ref={taRef}
          readOnly
          value={json}
          onFocus={(e) => e.target.select()}
          spellCheck={false}
          className="flex-1 m-4 p-3 rounded-xl border-2 border-rose-100 bg-rose-50 font-mono text-xs text-ink resize-none focus:outline-none focus:ring-4 focus:ring-rose-200"
        />
      </div>
    </div>
  );
}
