import type { DialogueFile, DialogueOption } from "../types/dialogue";

/**
 * Older files stored a single `check` string per option. Convert it into the
 * `checks` array (empty string = no check) and drop the legacy field so the
 * next export only contains the current format.
 */
function normalizeChecks(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((c): c is string => typeof c === "string");
  }
  if (typeof raw === "string") return raw ? [raw] : [];
  return [];
}

function normalizeOption(raw: unknown): DialogueOption {
  const o = (raw ?? {}) as Record<string, unknown> & Partial<DialogueOption>;
  const { check: legacyCheck, key, checks, actions, message, ...rest } = o;
  // Keep the canonical field order so exported files stay diff-friendly.
  return {
    key,
    checks: normalizeChecks("checks" in o ? checks : legacyCheck),
    actions,
    ...(message === undefined ? {} : { message }),
    ...rest,
  } as DialogueOption;
}

export function normalizeDialogue(parsed: DialogueFile): DialogueFile {
  const next: DialogueFile = {};
  for (const [key, block] of Object.entries(parsed)) {
    next[key] = {
      ...block,
      options: Array.isArray(block?.options)
        ? block.options.map(normalizeOption)
        : block?.options,
    };
  }
  return next;
}

export async function importDialogueFile(file: File): Promise<DialogueFile> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Dialogue file must be a JSON object.");
  }
  return normalizeDialogue(parsed as DialogueFile);
}

export function exportDialogueFile(
  dialogue: DialogueFile,
  filename = "npc_dialogue.json",
) {
  const json = JSON.stringify(dialogue, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
