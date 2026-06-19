// Build-time OG cards for the hub origin (schemic.dev): one PNG per driver key
// (hub | surrealdb | postgres), since the single-origin hub serves /, /surrealdb
// and /postgres. Landing.astro points og:image at /og/<key>.png for the route.

import { CARD_KEYS, type CardKey, renderCard } from "@schemic/landing/og/card";
import type { APIRoute } from "astro";

export function getStaticPaths() {
  return CARD_KEYS.map((key) => ({ params: { key } }));
}

export const GET: APIRoute = async ({ params }) => {
  const png = await renderCard(params.key as CardKey);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
