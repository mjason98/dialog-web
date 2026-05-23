import type {
  DialogueBlock,
  DialogueFile,
  DialogueMethod,
  DialogueOption,
} from "../types/dialogue";

export function addBlock(dialogue: DialogueFile, key: string): DialogueFile {
  if (!key) throw new Error("Block key cannot be empty.");
  if (dialogue[key]) throw new Error(`Block '${key}' already exists.`);
  return {
    ...dialogue,
    [key]: { message: "", method: "select", options: [] },
  };
}

export function deleteBlock(
  dialogue: DialogueFile,
  key: string,
): DialogueFile {
  if (key === "root") throw new Error("Cannot delete the 'root' block.");
  if (!dialogue[key]) return dialogue;
  const next: DialogueFile = {};
  for (const [k, b] of Object.entries(dialogue)) {
    if (k === key) continue;
    next[k] = b;
  }
  return next;
}

export function duplicateBlock(
  dialogue: DialogueFile,
  key: string,
): DialogueFile {
  if (!dialogue[key]) throw new Error(`Block '${key}' does not exist.`);
  let newKey = `${key}_copy`;
  let i = 1;
  while (dialogue[newKey]) {
    i += 1;
    newKey = `${key}_copy${i}`;
  }
  const original = dialogue[key];
  return {
    ...dialogue,
    [newKey]: {
      ...original,
      options: original.options.map((o) => ({ ...o, actions: [...o.actions] })),
    },
  };
}

export function renameBlock(
  dialogue: DialogueFile,
  oldKey: string,
  newKey: string,
): DialogueFile {
  if (!dialogue[oldKey]) throw new Error(`Block '${oldKey}' does not exist.`);
  if (!newKey) throw new Error("New key cannot be empty.");
  if (oldKey === newKey) return dialogue;
  if (dialogue[newKey]) throw new Error(`Block '${newKey}' already exists.`);

  const updated: DialogueFile = {};
  for (const [key, block] of Object.entries(dialogue)) {
    const finalKey = key === oldKey ? newKey : key;
    updated[finalKey] = {
      ...block,
      options: block.options.map((option) => ({
        ...option,
        key: option.key === oldKey ? newKey : option.key,
        actions: [...option.actions],
      })),
    };
  }
  return updated;
}

export function updateBlock(
  dialogue: DialogueFile,
  key: string,
  patch: Partial<DialogueBlock>,
): DialogueFile {
  if (!dialogue[key]) return dialogue;
  return {
    ...dialogue,
    [key]: { ...dialogue[key], ...patch },
  };
}

export function setMethod(
  dialogue: DialogueFile,
  key: string,
  method: DialogueMethod,
): DialogueFile {
  return updateBlock(dialogue, key, { method });
}

export function setMessage(
  dialogue: DialogueFile,
  key: string,
  message: string,
): DialogueFile {
  return updateBlock(dialogue, key, { message });
}

export function addOption(
  dialogue: DialogueFile,
  blockKey: string,
  option: Partial<DialogueOption> = {},
): DialogueFile {
  if (!dialogue[blockKey]) return dialogue;
  const newOption: DialogueOption = {
    key: option.key ?? "exit",
    check: option.check ?? "",
    actions: option.actions ?? [],
    message: option.message ?? "",
  };
  return {
    ...dialogue,
    [blockKey]: {
      ...dialogue[blockKey],
      options: [...dialogue[blockKey].options, newOption],
    },
  };
}

export function updateOption(
  dialogue: DialogueFile,
  blockKey: string,
  index: number,
  patch: Partial<DialogueOption>,
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const options = block.options.map((o, i) => {
    if (i !== index) return o;
    return { ...o, ...patch };
  });
  return { ...dialogue, [blockKey]: { ...block, options } };
}

export function deleteOption(
  dialogue: DialogueFile,
  blockKey: string,
  index: number,
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const options = block.options.filter((_, i) => i !== index);
  return { ...dialogue, [blockKey]: { ...block, options } };
}

export function moveOption(
  dialogue: DialogueFile,
  blockKey: string,
  from: number,
  to: number,
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const options = [...block.options];
  if (from < 0 || from >= options.length) return dialogue;
  if (to < 0 || to >= options.length) return dialogue;
  const [moved] = options.splice(from, 1);
  options.splice(to, 0, moved);
  return { ...dialogue, [blockKey]: { ...block, options } };
}

export function addActionString(
  dialogue: DialogueFile,
  blockKey: string,
  optIndex: number,
  value = "",
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const option = block.options[optIndex];
  if (!option) return dialogue;
  return updateOption(dialogue, blockKey, optIndex, {
    actions: [...option.actions, value],
  });
}

export function setActionString(
  dialogue: DialogueFile,
  blockKey: string,
  optIndex: number,
  actionIndex: number,
  value: string,
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const option = block.options[optIndex];
  if (!option) return dialogue;
  const actions = option.actions.map((a, i) => (i === actionIndex ? value : a));
  return updateOption(dialogue, blockKey, optIndex, { actions });
}

export function deleteActionString(
  dialogue: DialogueFile,
  blockKey: string,
  optIndex: number,
  actionIndex: number,
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const option = block.options[optIndex];
  if (!option) return dialogue;
  const actions = option.actions.filter((_, i) => i !== actionIndex);
  return updateOption(dialogue, blockKey, optIndex, { actions });
}

export function moveActionString(
  dialogue: DialogueFile,
  blockKey: string,
  optIndex: number,
  from: number,
  to: number,
): DialogueFile {
  const block = dialogue[blockKey];
  if (!block) return dialogue;
  const option = block.options[optIndex];
  if (!option) return dialogue;
  const actions = [...option.actions];
  if (from < 0 || from >= actions.length) return dialogue;
  if (to < 0 || to >= actions.length) return dialogue;
  const [m] = actions.splice(from, 1);
  actions.splice(to, 0, m);
  return updateOption(dialogue, blockKey, optIndex, { actions });
}
