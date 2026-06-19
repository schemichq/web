// Build-time raw-markdown twin of every docs page: /docs/<slug>.md returns the
// page's title + as-authored markdown body (entry.body) as text/markdown, so an
// agent can fetch a single page's source. Slugs mirror [...slug].astro (the docs
// collection ids), and the rest param lets nested slugs like
// "concepts/app-and-wire" emit at /docs/concepts/app-and-wire.md.

import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("docs");
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getCollection>>[number];
  };
  const body = (entry.body ?? "").trim();
  return new Response(`# ${entry.data.title}\n\n${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
