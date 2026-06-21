import { defineCollection, z } from "astro:content";
import { blogCollectionSchema } from "@schemic/content/blog-schema";
import { glob } from "astro/loaders";

// The agnostic hub has no docs of its own (those live on the driver subdomains),
// but it DOES host the cross-site blog. The articles live in ONE shared
// directory (packages/content/blog/**.mdx) loaded by every app; the hub's blog
// routes filter by the `driver` field to show ONLY "general" articles.
export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "../../packages/content/blog" }),
    schema: blogCollectionSchema(z),
  }),
};
