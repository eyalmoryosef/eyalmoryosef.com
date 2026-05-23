import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(["tech", "sport", "human-nature"]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    category: z.enum(["ai", "trading", "edtech", "academic"]),
    status: z.enum(["active", "in-progress", "shipped", "ongoing"]),
    techStack: z.array(z.string()),
    order: z.number().default(0),
    ogImage: z.string().optional(),
    externalUrl: z.string().url().optional(),
  }),
});

export const collections = { blog, projects };
