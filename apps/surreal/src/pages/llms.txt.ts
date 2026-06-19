// Build-time llms.txt (llmstxt.org) for surrealdb.schemic.dev. An LLM-readable
// index of the docs: the H1 + a one-line summary, then the docs grouped exactly
// as the sidebar (config/docs-nav.ts), each page a link to its absolute /docs/
// URL with the frontmatter description. Per-page raw markdown is at /docs/<slug>.md;
// the concatenated corpus is at /llms-full.txt.

import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { sidebarNav } from "../config/docs-nav";

// Reused verbatim from introduction.mdx's frontmatter description — no new copy.
const SUMMARY =
  "Schemic lets you describe a SurrealDB table once, in Zod, and get SurrealQL DDL, runtime validation, and a fully-typed JS to database mapping from that single definition.";

export const GET: APIRoute = async ({ site }) => {
  const entries = await getCollection("docs");
  const bySlug = new Map(entries.map((e) => [e.id, e]));

  const lines: string[] = ["# Schemic", "", `> ${SUMMARY}`, ""];

  for (const group of sidebarNav) {
    lines.push(`## ${group.label}`, "");
    for (const item of group.items) {
      const slug = item.href.replace(/^\/docs\//, "");
      const entry = bySlug.get(slug);
      const title = entry?.data.title ?? item.label;
      const desc = entry?.data.description;
      const url = new URL(`/docs/${slug}`, site).href;
      lines.push(
        desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`,
      );
    }
    lines.push("");
  }

  return new Response(`${lines.join("\n").trimEnd()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
