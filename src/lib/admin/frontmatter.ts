import matter from "gray-matter";

export interface ParsedContent {
  data: Record<string, unknown>;
  body: string;
  raw: string;
}

export function parseMarkdown(raw: string): ParsedContent {
  const { data, content } = matter(raw);
  return { data, body: content.trim(), raw };
}

export function serializeMarkdown(data: Record<string, unknown>, body: string): string {
  return matter.stringify(body.trim() ? `${body.trim()}\n` : "", data);
}

export const BLOG_FIELDS = [
  { key: "title", label: "כותרת", type: "text" as const, required: true },
  { key: "description", label: "תיאור (SEO)", type: "textarea" as const, required: true },
  { key: "date", label: "תאריך", type: "date" as const, required: true },
  { key: "updatedDate", label: "עודכן", type: "date" as const },
  {
    key: "category",
    label: "קטגוריה",
    type: "select" as const,
    options: ["tech", "sport", "human-nature"],
    required: true,
  },
  { key: "tags", label: "תגיות (מופרדות בפסיק)", type: "tags" as const },
  { key: "draft", label: "טיוטה", type: "checkbox" as const },
];

export const PROJECT_FIELDS = [
  { key: "title", label: "כותרת", type: "text" as const, required: true },
  { key: "description", label: "תיאור", type: "textarea" as const, required: true },
  {
    key: "category",
    label: "קטגוריה",
    type: "select" as const,
    options: ["ai", "trading", "edtech", "academic"],
    required: true,
  },
  {
    key: "status",
    label: "סטטוס",
    type: "select" as const,
    options: ["active", "in-progress", "shipped", "ongoing"],
    required: true,
  },
  { key: "techStack", label: "טכנולוגיות (מופרדות בפסיק)", type: "tags" as const, required: true },
  { key: "order", label: "סדר תצוגה", type: "number" as const },
  { key: "externalUrl", label: "קישור חיצוני", type: "text" as const },
];

export function normalizeFrontmatter(
  kind: "blog" | "projects",
  data: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...data };

  if (kind === "blog") {
    if (typeof out.tags === "string") {
      out.tags = out.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (!Array.isArray(out.tags)) out.tags = [];
    out.draft = Boolean(out.draft);
    if (out.updatedDate === "" || out.updatedDate == null) delete out.updatedDate;
  }

  if (kind === "projects") {
    if (typeof out.techStack === "string") {
      out.techStack = out.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (out.order === "" || out.order == null) {
      out.order = 0;
    } else {
      out.order = Number(out.order);
    }
    if (out.externalUrl === "" || out.externalUrl == null) delete out.externalUrl;
  }

  return out;
}

export function frontmatterToForm(data: Record<string, unknown>): Record<string, string> {
  const form: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      form[key] = value.join(", ");
    } else if (typeof value === "boolean") {
      form[key] = value ? "true" : "false";
    } else if (value instanceof Date) {
      form[key] = value.toISOString().slice(0, 10);
    } else if (value != null) {
      form[key] = String(value);
    }
  }
  return form;
}
