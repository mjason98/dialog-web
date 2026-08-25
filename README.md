# Dialogue Editor

A cute, browser-only editor for creating and editing NPC dialogue JSON files for indie games. Built with React + TypeScript + Vite + React Flow + Tailwind CSS. No database — everything lives in your browser tab.

## Features

- Create, import, and export dialogue JSON files (game-ready, formatted).
- Three resizable panels: block list, graph view, inspector.
- Required graph view (React Flow) — drag nodes, pan, zoom, minimap.
- Top-to-bottom flow: `root` on top, each depth level one row below; edges leave
  the bottom of a node and enter the top of the next. Blocks you have not dragged
  are auto-arranged by that layout.
- Node tags show totals for the block's options: 🔒 checks, ⚡ actions.
- Click a node to edit a block. Click an edge to edit an option.
- Drag from a node handle to another node to create a new option.
- Right-click the canvas to add a new block at that position.
- Add, rename, duplicate, delete blocks. Reorder options, checks, and actions.
- Multiple checks per option (AND), editable as a reorderable list.
- Live validation: broken links, missing fields, duplicates, unreachable blocks, invalid methods. Errors block export.
- Undo / redo (Cmd/Ctrl+Z, Shift+Cmd/Ctrl+Z).
- Special `exit` reserved key, rendered as a separate endpoint node.
- Paper-and-ink styling: warm off-white surfaces, hairline rules, mono keys,
  serif dialogue text. Red/amber are reserved for errors and warnings.

## Dialogue JSON Format

```json
{
  "root": {
    "message": "You are at root",
    "method": "select",
    "options": [
      { "key": "exit", "checks": [], "actions": [], "message": "leave" }
    ]
  }
}
```

- **method**: `select` | `first` | `random` | `all`
- **option.key**: target block key (or `exit`)
- **option.checks**: array of condition strings. **All** must pass (AND) for the
  option to be enabled; an empty array means always enabled.
  Legacy files using a single `"check": "cond"` string are converted to
  `"checks": ["cond"]` on import (`"check": ""` becomes `"checks": []`), and
  export only writes `checks`.
- **option.actions**: array of action strings
- **option.message**: player-facing text (recommended when `method` is `select`)

Editor-only data (node positions, panel widths, selection) is never written to the exported JSON.

## Project Layout

```
.
├── .gitignore
├── README.md
├── react_dialogue_editor_design.pdf
└── app/                          # the Vite project
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── types/dialogue.ts
        ├── data/defaultDialogue.ts
        ├── logic/
        │   ├── dialogueActions.ts
        │   ├── graphMapping.ts
        │   ├── importExport.ts
        │   └── validation.ts
        └── components/
            ├── TopBar.tsx
            ├── BlockList.tsx
            ├── DialogueGraph.tsx
            ├── DialogueNode.tsx
            ├── InspectorPanel.tsx
            ├── BlockEditor.tsx
            ├── OptionEditor.tsx
            ├── StringListEditor.tsx
            ├── ValidationPanel.tsx
            └── Resizer.tsx
```

## Run Locally

Requirements: Node 18+ and npm.

```bash
cd app
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173/`).

## Build for Production

```bash
cd app
npm run build       # outputs to app/dist
npm run preview     # serves the built bundle locally
```

The `dist/` folder is a static site — host it on any static host (GitHub Pages, Netlify, Vercel, S3, etc.).

## Keyboard Shortcuts

| Shortcut                     | Action |
|------------------------------|--------|
| Cmd/Ctrl + Z                 | Undo   |
| Shift + Cmd/Ctrl + Z         | Redo   |
| Cmd/Ctrl + Y                 | Redo   |

## Tech Stack

- **React 19** + **TypeScript** — UI and type-safe dialogue model
- **Vite 8** — dev server and build
- **React Flow 11** — required graph view
- **Tailwind CSS 3** — styling

## License

Personal project. Use freely.
