type Props = {
  actions: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onMove: (from: number, to: number) => void;
};

export default function ActionListEditor({
  actions,
  onChange,
  onAdd,
  onDelete,
  onMove,
}: Props) {
  return (
    <div className="space-y-1">
      {actions.length === 0 && (
        <div className="text-xs text-ink/50 italic">no actions</div>
      )}
      {actions.map((a, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={a}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder="e.g. addk_quest1_0"
            className="flex-1 px-2 py-1 text-xs rounded-md border-2 border-mint-200 focus:border-mint-400 outline-none bg-white font-mono"
          />
          <button
            onClick={() => onMove(i, i - 1)}
            disabled={i === 0}
            className="text-xs w-6 h-6 grid place-items-center rounded-md hover:bg-mint-100 disabled:opacity-30"
            title="up"
          >
            ↑
          </button>
          <button
            onClick={() => onMove(i, i + 1)}
            disabled={i === actions.length - 1}
            className="text-xs w-6 h-6 grid place-items-center rounded-md hover:bg-mint-100 disabled:opacity-30"
            title="down"
          >
            ↓
          </button>
          <button
            onClick={() => onDelete(i)}
            className="text-xs w-6 h-6 grid place-items-center rounded-md hover:bg-rose-100"
            title="delete"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs px-3 py-1 rounded-full bg-mint-200 hover:bg-mint-300 border-2 border-mint-400 font-bold shadow-cute"
      >
        ＋ action
      </button>
    </div>
  );
}
