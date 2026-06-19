// @ts-check
import mdx from "@astrojs/mdx";
import { brandShikiTheme } from "@schemic/content/code-theme";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// postgres.schemic.dev - the PostgreSQL driver site. The landing lives at "/"
// (src/pages/index.astro, shared @schemic/landing themed for Postgres). The docs
// are a bespoke shell (@schemic/ui docs components + DocsLayout), rendered from
// MDX (src/content/docs/**) at /docs/<slug>. No Starlight: we own the chrome.
export default defineConfig({
  site: "https://postgres.schemic.dev",
  integrations: [mdx()],
  markdown: {
    // Brand syntax colors for plain ``` fences (CodeBlock shares this theme).
    shikiConfig: { theme: brandShikiTheme },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
