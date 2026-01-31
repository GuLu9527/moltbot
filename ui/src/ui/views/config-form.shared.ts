import type { ConfigUiHints } from "../types";

import { zhCN } from "@openclaw/i18n";

export type JsonSchema = {
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema | JsonSchema[];
  additionalProperties?: JsonSchema | boolean;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  nullable?: boolean;
};

export function schemaType(schema: JsonSchema): string | undefined {
  if (!schema) return undefined;
  if (Array.isArray(schema.type)) {
    const filtered = schema.type.filter((t) => t !== "null");
    return filtered[0] ?? schema.type[0];
  }
  return schema.type;
}

export function defaultValue(schema?: JsonSchema): unknown {
  if (!schema) return "";
  if (schema.default !== undefined) return schema.default;
  const type = schemaType(schema);
  switch (type) {
    case "object":
      return {};
    case "array":
      return [];
    case "boolean":
      return false;
    case "number":
    case "integer":
      return 0;
    case "string":
      return "";
    default:
      return "";
  }
}

export function pathKey(path: Array<string | number>): string {
  return path.filter((segment) => typeof segment === "string").join(".");
}

export function hintForPath(path: Array<string | number>, hints: ConfigUiHints) {
  const key = pathKey(path);
  const direct = hints[key];
  if (direct) return direct;
  const segments = key.split(".");
  for (const [hintKey, hint] of Object.entries(hints)) {
    if (!hintKey.includes("*")) continue;
    const hintSegments = hintKey.split(".");
    if (hintSegments.length !== segments.length) continue;
    let match = true;
    for (let i = 0; i < segments.length; i += 1) {
      if (hintSegments[i] !== "*" && hintSegments[i] !== segments[i]) {
        match = false;
        break;
      }
    }
    if (match) return hint;
  }
  return undefined;
}

export function humanize(raw: string) {
  // 首先检查是否有直接的翻译
  const fieldTranslations = zhCN.commands.configFields as Record<string, string>;
  if (fieldTranslations[raw]) {
    return fieldTranslations[raw];
  }

  // 如果没有直接翻译，尝试驼峰命名转换后的翻译
  const normalized = raw
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  // 将第一个单词转换为小驼峰，检查翻译
  const camelCase = normalized
    .split(" ")
    .map((word, i) => (i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join("");

  if (fieldTranslations[camelCase]) {
    return fieldTranslations[camelCase];
  }

  // 尝试翻译每个单词
  const words = normalized.split(" ");
  const translatedWords = words.map((word) => {
    const lowerWord = word.toLowerCase();
    return fieldTranslations[lowerWord] || word;
  });

  // 如果至少有一个单词被翻译了，返回翻译后的结果
  if (translatedWords.some((word, i) => word !== words[i] && word !== words[i].toLowerCase())) {
    return translatedWords.join(" ");
  }

  // 如果都没有翻译，返回格式化的英文
  return normalized.replace(/^./, (m) => m.toUpperCase());
}

export function translateDescription(description: string | undefined): string | undefined {
  if (!description) return undefined;

  const descTranslations = zhCN.commands.configDescriptions as Record<string, string>;
  return descTranslations[description] || description;
}

export function isSensitivePath(path: Array<string | number>): boolean {
  const key = pathKey(path).toLowerCase();
  return (
    key.includes("token") ||
    key.includes("password") ||
    key.includes("secret") ||
    key.includes("apikey") ||
    key.endsWith("key")
  );
}
