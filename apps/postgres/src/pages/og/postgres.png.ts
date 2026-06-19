// Build-time OG card for postgres.schemic.dev. Same shared renderer as the hub.

import { renderCard } from "@schemic/landing/og/card";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const png = await renderCard("postgres");
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
