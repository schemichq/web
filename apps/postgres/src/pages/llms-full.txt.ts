// Build-time llms-full.txt (llmstxt.org) for postgres.schemic.dev. The whole
// docs corpus in one file: the H1 + summary, then every page's raw markdown body
// (entry.body, as-authored) in sidebar order, each under its title and separated
// by a horizontal rule. The grouped link index lives at /llms.txt.

import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { sidebarNav } from "../config/docs-nav";

const SUMMARY =
  "Schemic lets you describe a PostgreSQL table once, in Zod, and get SQL DDL, runtime validation, and a fully-typed JS-to-database mapping from that single definition.";

export const GET: APIRoute = async () => {
  const entries = await getCollection("docs");
  const bySlug = new Map(entries.map((e) => [e.id, e]));

  const parts: string[] = [`# Schemic (PostgreSQL)\n\n> ${SUMMARY}`];

  for (const group of sidebarNav) {
    for (const item of group.items) {
      const slug = item.href.replace(/^\/docs\//, "");
      const entry = bySlug.get(slug);
      if (!entry) continue;
      const title = entry.data.title;
      const body = (entry.body ?? "").trim();
      parts.push(`# ${title}\n\n${body}`);
    }
  }

  return new Response(`${parts.join("\n\n---\n\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
