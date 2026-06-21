/**
 * Shared frontmatter schema for the cross-site "blog" content collection. The
 * articles live in ONE shared directory (packages/content/blog/**.mdx) and are
 * loaded by every app via Astro's glob loader. Each app then filters by the
 * `driver` field so a `general` article shows on all three sites while a
 * driver-specific article shows only on that driver's site.
 *
 * The Astro content config must live in each app (Astro resolves
 * src/content.config.ts per-app), so apps import this factory and apply it with
 * their own `z` from `astro:content`:
 *
 *   import { blogCollectionSchema } from "@schemic/content/blog-schema";
 *   schema: blogCollectionSchema(z)
 *
 * Taking `z` as a parameter keeps this package free of the `astro:content`
 * virtual module (mirrors docs-schema.mjs).
 */
export const blogCollectionSchema = (z) =>
  z.object({
    title: z.string(),
    // ISO date, yyyy-mm-dd (kept as a string so the author writes it literally
    // and it round-trips for display without timezone surprises).
    date: z.string(),
    excerpt: z.string(),
    // Eyebrow label, e.g. "RELEASE" / "ENGINEERING" / "DEEP DIVE".
    tag: z.string(),
    // Audience gate: "general" shows on every site; a driver value shows ONLY on
    // that driver's site (the per-app blog routes filter on this).
    driver: z.enum(["general", "surrealdb", "postgres"]),
    readTime: z.string(),
    featured: z.boolean().default(false),
    author: z
      .object({
        name: z.string(),
        role: z.string(),
        initials: z.string(),
      })
      .default({
        name: "Manuel Sanchez",
        role: "Maintainer",
        initials: "MS",
      }),
  });
