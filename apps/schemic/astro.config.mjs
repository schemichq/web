// @ts-check
import mdx from "@astrojs/mdx";
import { brandShikiTheme } from "@schemic/content/code-theme";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// schemic.dev - the main library hub. A standalone marketing page; the docs live
// on the per-driver subdomains (e.g. surreal.schemic.dev). The CROSS-SITE blog,
// however, also runs here: the hub renders ONLY the `general` articles from the
// shared collection (packages/content/blog), so it needs MDX + the brand Shiki
// theme just like the driver sites.
// Brand tokens come from @schemic/brand; landing chrome is ported from the
// surreal site's Concept 7.1 components, adapted to the DB-neutral hub.
export default defineConfig({
  site: "https://schemic.dev",
  integrations: [mdx()],
  markdown: {
    // Brand syntax colors for plain ``` fences (CodeBlock shares this theme).
    // Alias surql -> sql so a shared article's SurrealQL fence still highlights
    // if it ever reaches the hub (Shiki has no surql grammar).
    shikiConfig: { theme: brandShikiTheme, langAlias: { surql: "sql" } },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
