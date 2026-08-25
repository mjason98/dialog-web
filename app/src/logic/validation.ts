import type {
  DialogueFile,
  ValidationIssue,
} from "../types/dialogue";
import { RESERVED_KEYS, VALID_METHODS } from "../types/dialogue";

export function validateDialogue(dialogue: DialogueFile): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const blockKeys = Object.keys(dialogue);

  if (!dialogue || typeof dialogue !== "object" || Array.isArray(dialogue)) {
    issues.push({
      type: "error",
      path: "<root>",
      message: "Top-level data must be an object.",
    });
    return issues;
  }

  if (!dialogue.root) {
    issues.push({
      type: "error",
      path: "root",
      message: "Dialogue must contain a 'root' block.",
    });
  }

  for (const [blockKey, block] of Object.entries(dialogue)) {
    if (!blockKey) {
      issues.push({
        type: "error",
        path: "<empty>",
        message: "Block key is empty.",
      });
    }

    if (typeof block.message !== "string") {
      issues.push({
        type: "error",
        path: blockKey,
        blockKey,
        message: "Block is missing 'message'.",
      });
    }

    if (!block.method) {
      issues.push({
        type: "error",
        path: blockKey,
        blockKey,
        message: "Block is missing 'method'.",
      });
    } else if (!VALID_METHODS.includes(block.method)) {
      issues.push({
        type: "error",
        path: blockKey,
        blockKey,
        message: `Invalid method: ${block.method}`,
      });
    }

    if (!Array.isArray(block.options)) {
      issues.push({
        type: "error",
        path: blockKey,
        blockKey,
        message: "Block is missing 'options' array.",
      });
      continue;
    }

    if (block.options.length === 0) {
      issues.push({
        type: "warning",
        path: blockKey,
        blockKey,
        message:
          "Block has no options. Add an exit option if dialogue should end here.",
      });
    }

    block.options.forEach((option, index) => {
      const path = `${blockKey}.options[${index}]`;
      if (!option.key) {
        issues.push({
          type: "error",
          path,
          blockKey,
          optionIndex: index,
          message: "Option is missing target key.",
        });
      }
      if (
        option.key &&
        !blockKeys.includes(option.key) &&
        !RESERVED_KEYS.includes(option.key)
      ) {
        issues.push({
          type: "error",
          path,
          blockKey,
          optionIndex: index,
          message: `Option links to missing block: '${option.key}'.`,
        });
      }
      if (!Array.isArray(option.checks)) {
        issues.push({
          type: "error",
          path,
          blockKey,
          optionIndex: index,
          message: "Option checks must be an array.",
        });
      } else {
        const seenChecks = new Set<string>();
        option.checks.forEach((c, ci) => {
          if (c === "") {
            issues.push({
              type: "warning",
              path: `${path}.checks[${ci}]`,
              blockKey,
              optionIndex: index,
              message: "Empty check string. Remove it or replace.",
            });
          } else if (seenChecks.has(c)) {
            issues.push({
              type: "warning",
              path: `${path}.checks[${ci}]`,
              blockKey,
              optionIndex: index,
              message: `Duplicate check '${c}'.`,
            });
          }
          seenChecks.add(c);
        });
      }
      if (!Array.isArray(option.actions)) {
        issues.push({
          type: "error",
          path,
          blockKey,
          optionIndex: index,
          message: "Option actions must be an array.",
        });
      } else {
        option.actions.forEach((a, ai) => {
          if (a === "") {
            issues.push({
              type: "warning",
              path: `${path}.actions[${ai}]`,
              blockKey,
              optionIndex: index,
              message: "Empty action string. Remove it or replace.",
            });
          }
        });
      }
      if (block.method === "select" && !option.message) {
        issues.push({
          type: "warning",
          path,
          blockKey,
          optionIndex: index,
          message: "Selectable option should have player-facing message.",
        });
      }
    });
  }

  // Reachability from root
  if (dialogue.root) {
    const reachable = new Set<string>();
    const stack = ["root"];
    while (stack.length) {
      const key = stack.pop()!;
      if (reachable.has(key)) continue;
      reachable.add(key);
      const block = dialogue[key];
      if (!block || !Array.isArray(block.options)) continue;
      for (const opt of block.options) {
        if (!opt.key) continue;
        if (RESERVED_KEYS.includes(opt.key)) continue;
        if (dialogue[opt.key] && !reachable.has(opt.key)) stack.push(opt.key);
      }
    }
    for (const key of blockKeys) {
      if (!reachable.has(key)) {
        issues.push({
          type: "warning",
          path: key,
          blockKey: key,
          message: "Block is unreachable from 'root'.",
        });
      }
    }
  }

  return issues;
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.type === "error");
}
