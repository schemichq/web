/**
 * Shared frontmatter schema for the "docs" content collection, used by every
 * driver site. The Astro content config must live in each app (Astro resolves
 * src/content.config.ts per-app), so apps import this factory and apply it with
 * their own `z` from `astro:content`:
 *
 *   import { docsCollectionSchema } from "@schemic/content/docs-schema";
 *   schema: docsCollectionSchema(z)
 *
 * Taking `z` as a parameter keeps this package free of the `astro:content`
 * virtual module.
 */
export const docsCollectionSchema = (z) =>
  z.object({
    title: z.string(),
    description: z.string().optional(),
  });
