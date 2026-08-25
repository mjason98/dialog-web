type Props = {
  items: string[];
  placeholder: string;
  addLabel: string;
  emptyLabel: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onMove: (from: number, to: number) => void;
};

export default function StringListEditor({
  items,
  placeholder,
  addLabel,
  emptyLabel,
  onChange,
  onAdd,
  onDelete,
  onMove,
}: Props) {
  return (
    <div className="space-y-1">
      {items.length === 0 && (
        <div className="text-xs text-ink-500 italic">{emptyLabel}</div>
      )}
      {items.map((value, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={value}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-2 py-1 text-xs rounded-sm border border-paper-300 focus:border-ink-500 outline-none bg-paper-50 font-mono"
          />
          <button
            onClick={() => onMove(i, i - 1)}
            disabled={i === 0}
            className="text-xs w-6 h-6 grid place-items-center rounded-sm hover:bg-paper-200 disabled:opacity-30"
            title="up"
          >
            ↑
          </button>
          <button
            onClick={() => onMove(i, i + 1)}
            disabled={i === items.length - 1}
            className="text-xs w-6 h-6 grid place-items-center rounded-sm hover:bg-paper-200 disabled:opacity-30"
            title="down"
          >
            ↓
          </button>
          <button
            onClick={() => onDelete(i)}
            className="text-xs w-6 h-6 grid place-items-center rounded-sm hover:bg-paper-200"
            title="delete"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs px-3 py-1 rounded-card border border-paper-300 bg-paper-50 hover:bg-paper-200 font-medium"
      >
        + {addLabel}
      </button>
    </div>
  );
}
