// Build-time GitHub README banner (1200×630, neutral gray — dark variant). A
// deliverable asset — copied out to design/deliverables/ to hand to the README;
// not wired into any page's social meta. Pairs with banner-light for a <picture>.

import { renderBanner } from "@schemic/landing/og/card";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const png = await renderBanner();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
