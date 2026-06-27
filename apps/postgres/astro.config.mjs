// @ts-check
import mdx from "@astrojs/mdx";
import { brandShikiTheme } from "@schemic/content/code-theme";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
// Static, self-hosted docs search. Runs Pagefind over the build output on every
// `astro build` (the deploy path) -> emits dist/pagefind/, and serves the index
// in `astro dev`. Indexing is scoped to docs via data-pagefind-body in DocsLayout.
import pagefind from "astro-pagefind";

// postgres.schemic.dev - the PostgreSQL driver site. The landing lives at "/"
// (src/pages/index.astro, shared @schemic/landing themed for Postgres). The docs
// are a bespoke shell (@schemic/ui docs components + DocsLayout), rendered from
// MDX (src/content/docs/**) at /docs/<slug>. No Starlight: we own the chrome.
export default defineConfig({
  site: "https://postgres.schemic.dev",
  integrations: [mdx(), pagefind()],
  markdown: {
    // Brand syntax colors for plain ``` fences (CodeBlock shares this theme).
    // Alias postgresql/pgsql to Shiki's `sql` grammar so a `postgresql` fence
    // highlights cleanly AND CodeBlock shows the branded "PostgreSQL" chip
    // (mirrors surreal's surql -> sql).
    shikiConfig: {
      theme: brandShikiTheme,
      // surql -> sql so a shared (cross-site) blog article's SurrealQL fence
      // still highlights even though those articles are filtered off this site.
      langAlias: { postgresql: "sql", pgsql: "sql", surql: "sql" },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
