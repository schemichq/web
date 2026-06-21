import { defineCollection, z } from "astro:content";
import { blogCollectionSchema } from "@schemic/content/blog-schema";
import { docsCollectionSchema } from "@schemic/content/docs-schema";
import { glob } from "astro/loaders";

// Docs content is authored as MDX under src/content/docs/** (frontmatter:
// title + description, shared via @schemic/content). Rendering (chrome, nav,
// components) is owned by the docs shell; see src/pages/docs/[...slug].astro.
//
// Blog content is CROSS-SITE: the articles live in ONE shared directory
// (packages/content/blog/**.mdx) loaded by every app. The per-app blog routes
// filter by the `driver` field — this site shows "general" + "postgres".
export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
    schema: docsCollectionSchema(z),
  }),
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "../../packages/content/blog" }),
    schema: blogCollectionSchema(z),
  }),
};
