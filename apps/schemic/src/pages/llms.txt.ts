// Build-time llms.txt (llmstxt.org) for the schemic.dev hub. The hub ships no
// docs of its own (those live per-driver, e.g. surrealdb.schemic.dev/docs), so
// this is a concise pointer: the H1 + the hub's tagline, then where the docs and
// the machine-readable index live, plus the project links + driver subdomains.

import { drivers, driverUrl, REPO_URL } from "@schemic/landing/config/drivers";
import type { APIRoute } from "astro";

// Reused verbatim from the hub Landing.astro default `description`.
const SUMMARY =
  "Define your database schema once in the Zod you already know — Schemic turns it into native DDL, types, and migrations for any database.";

export const GET: APIRoute = () => {
  const lines: string[] = ["# Schemic", "", `> ${SUMMARY}`, ""];

  lines.push("## Documentation", "");
  lines.push(
    "- [Docs](https://surrealdb.schemic.dev/docs/introduction): Schemic documentation (hosted on the SurrealDB driver subdomain).",
  );
  lines.push(
    "- [llms.txt](https://surrealdb.schemic.dev/llms.txt): Machine-readable index of the docs.",
  );
  lines.push(
    "- [llms-full.txt](https://surrealdb.schemic.dev/llms-full.txt): The full docs corpus as one markdown file.",
  );
  lines.push("");

  lines.push("## Links", "");
  lines.push(`- [GitHub](${REPO_URL}): The Schemic source repository.`);
  for (const d of drivers) {
    lines.push(
      `- [${d.name}](${driverUrl(d.slug)}): The ${d.name} driver site.`,
    );
  }
  lines.push("");

  return new Response(`${lines.join("\n").trimEnd()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
