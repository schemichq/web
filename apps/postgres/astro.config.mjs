// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// postgres.schemic.dev - the PostgreSQL driver site. The driver is in the works;
// the site scaffolds the shared @schemic/landing (postgres theme) with the demo
// in its coming-soon state. Brand tokens come from @schemic/brand.
export default defineConfig({
  site: "https://postgres.schemic.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});
