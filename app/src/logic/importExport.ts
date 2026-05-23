import type { DialogueFile } from "../types/dialogue";

export async function importDialogueFile(file: File): Promise<DialogueFile> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Dialogue file must be a JSON object.");
  }
  return parsed as DialogueFile;
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
