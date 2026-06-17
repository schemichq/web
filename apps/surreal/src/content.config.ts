import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { docsCollectionSchema } from "@schemic/content/docs-schema";

// Docs content is authored as MDX under src/content/docs/** (frontmatter:
// title + description, shared via @schemic/content). Rendering (chrome, nav,
// components) is owned by the docs shell; see src/pages/docs/[...slug].astro.
export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
    schema: docsCollectionSchema(z),
  }),
};
