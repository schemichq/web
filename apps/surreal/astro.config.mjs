// @ts-check
import mdx from "@astrojs/mdx";
import { brandShikiTheme } from "@schemic/content/code-theme";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
// Static, self-hosted docs search. Runs Pagefind over the build output on every
// `astro build` (the deploy path) -> emits dist/pagefind/, and serves the index
// in `astro dev`. Indexing is scoped to docs via data-pagefind-body in DocsLayout.
import pagefind from "astro-pagefind";

// The marketing landing lives at "/" (src/pages/index.astro). The docs are a
// bespoke shell (src/layouts/DocsLayout.astro + src/components/docs/**), hand-
// built to match design/website.pen. No Starlight: we own the chrome.
// Docs content is MDX (src/content/docs/**) rendered at /docs/<slug>.
export default defineConfig({
  site: "https://surrealdb.schemic.dev",
  integrations: [mdx(), pagefind()],
  markdown: {
    // Brand syntax colors for plain ``` fences (CodeBlock shares this theme).
    // Shiki has no surql grammar; alias it to sql for DDL highlighting.
    shikiConfig: { theme: brandShikiTheme, langAlias: { surql: "sql" } },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
