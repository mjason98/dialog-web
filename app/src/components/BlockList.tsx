import { useMemo, useState } from "react";
import type { DialogueFile, ValidationIssue } from "../types/dialogue";

type Props = {
  dialogue: DialogueFile;
  selected: string | null;
  issues: ValidationIssue[];
  onSelect: (key: string) => void;
  onAdd: (key: string) => void;
  onDelete: (key: string) => void;
  onDuplicate: (key: string) => void;
  onRename: (oldKey: string, newKey: string) => void;
};

export default function BlockList({
  dialogue,
  selected,
  issues,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onRename,
}: Props) {
  const [search, setSearch] = useState("");
  const [newKey, setNewKey] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const issueByKey = useMemo(() => {
    const map = new Map<string, { error: boolean; warning: boolean }>();
    for (const i of issues) {
      if (!i.blockKey) continue;
      const cur = map.get(i.blockKey) ?? { error: false, warning: false };
      if (i.type === "error") cur.error = true;
      else cur.warning = true;
      map.set(i.blockKey, cur);
    }
    return map;
  }, [issues]);

  const keys = Object.keys(dialogue)
    .filter((k) => k.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a === "root" ? -1 : b === "root" ? 1 : a.localeCompare(b)));

  return (
    <div className="h-full flex flex-col bg-cream border-r-4 border-rose-200">
      <div className="p-3 border-b-2 border-rose-200">
        <div className="font-extrabold text-ink mb-2 text-sm uppercase tracking-wider">
          📜 Blocks
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search…"
          className="w-full px-3 py-1.5 rounded-full border-2 border-rose-200 focus:border-rose-400 outline-none text-sm bg-white"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {keys.map((key) => {
          const flags = issueByKey.get(key);
          const isSel = key === selected;
          if (renaming === key) {
            return (
              <div key={key} className="flex gap-1">
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(key, renameValue.trim());
                      setRenaming(null);
                    } else if (e.key === "Escape") setRenaming(null);
                  }}
                  className="flex-1 px-2 py-1 rounded-md border-2 border-sky2-400 text-sm bg-white"
                />
                <button
                  className="text-xs px-2 bg-mint-200 rounded-md border-2 border-mint-400"
                  onClick={() => {
                    onRename(key, renameValue.trim());
                    setRenaming(null);
                  }}
                >
                  ok
                </button>
              </div>
            );
          }
          return (
            <div
              key={key}
              className={`group flex items-center gap-1 px-3 py-2 rounded-xl cursor-pointer border-2 transition ${
                isSel
                  ? "bg-rose-200 border-rose-400 shadow-cute"
                  : "bg-white border-transparent hover:border-rose-200"
              }`}
              onClick={() => onSelect(key)}
            >
              <span className="text-sm font-bold text-ink truncate flex-1">
                {key === "root" ? "🏠 " : ""}
                {key}
              </span>
              {flags?.error && (
                <span title="errors" className="text-red-500">
                  ⛔
                </span>
              )}
              {flags?.warning && !flags?.error && (
                <span title="warnings" className="text-amber-500">
                  ⚠️
                </span>
              )}
              <div className="opacity-0 group-hover:opacity-100 flex gap-0.5">
                <IconBtn
                  title="rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenaming(key);
                    setRenameValue(key);
                  }}
                >
                  ✏️
                </IconBtn>
                <IconBtn
                  title="duplicate"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(key);
                  }}
                >
                  📋
                </IconBtn>
                {key !== "root" && (
                  <IconBtn
                    title="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete block '${key}'?`)) onDelete(key);
                    }}
                  >
                    🗑️
                  </IconBtn>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2 border-t-2 border-rose-200 flex gap-1">
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="new_block_key"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newKey.trim()) {
              onAdd(newKey.trim());
              setNewKey("");
            }
          }}
          className="flex-1 px-3 py-1.5 rounded-full border-2 border-mint-200 focus:border-mint-400 outline-none text-sm bg-white"
        />
        <button
          onClick={() => {
            if (newKey.trim()) {
              onAdd(newKey.trim());
              setNewKey("");
            }
          }}
          className="px-3 py-1.5 rounded-full bg-mint-200 hover:bg-mint-300 border-2 border-mint-400 text-sm font-bold text-ink shadow-cute"
        >
          ＋
        </button>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="text-xs w-6 h-6 rounded-md hover:bg-rose-50 grid place-items-center"
    >
      {children}
    </button>
  );
}
