import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const levelEnum = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

/**
 * `topics` covers every deep-dive article across the Git tab, GitHub tab,
 * and Workflows tab. `primaryTab` + `subtab` place it in the IA; `order`
 * controls prev/next navigation within a subtab.
 */
const topics = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    level: levelEnum,
    primaryTab: z.enum(['git', 'github', 'workflows']),
    subtab: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    sources: z.array(sourceSchema).min(1),
    readingTime: z.number().int().positive(),
    related: z.array(z.string()).default([]),
    order: z.number().default(0),
    lastReviewed: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

/** `fixes` powers the Fix It troubleshooting tab. */
const fixes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/fixes' }),
  schema: z.object({
    title: z.string(),
    symptom: z.string(),
    summary: z.string(),
    severity: z.enum(['minor', 'moderate', 'scary']),
    tags: z.array(z.string()).default([]),
    sources: z.array(sourceSchema).min(1),
    related: z.array(z.string()).default([]),
    order: z.number().default(0),
    lastReviewed: z.coerce.date(),
  }),
});

export const collections = { topics, fixes };
