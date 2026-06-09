export type DialogueMethod = "select" | "first" | "random";

export type DialogueOption = {
  key: string;
  check: string;
  actions: string[];
  message?: string;
};

export type DialogueBlock = {
  message: string;
  method: DialogueMethod;
  options: DialogueOption[];
};

export type DialogueFile = Record<string, DialogueBlock>;

export type ValidationIssue = {
  type: "error" | "warning";
  path: string;
  blockKey?: string;
  optionIndex?: number;
  message: string;
};

export const VALID_METHODS: DialogueMethod[] = [
  "select",
  "first",
  "random",
];

export const RESERVED_KEYS = ["exit"];
