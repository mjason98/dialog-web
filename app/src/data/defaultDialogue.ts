import type { DialogueFile } from "../types/dialogue";

export const defaultDialogue: DialogueFile = {
  root: {
    message: "You are at root",
    method: "select",
    options: [
      { key: "exit", check: "", actions: [], message: "leave" },
    ],
  },
};
