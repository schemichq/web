// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// schemic.dev - the main library hub. A standalone marketing page (no docs/blog
// here; those live on the per-driver subdomains, e.g. surreal.schemic.dev).
// Brand tokens come from @schemic/brand; landing chrome is ported from the
// surreal site's Concept 7.1 components, adapted to the DB-neutral hub.
export default defineConfig({
  site: "https://schemic.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});
