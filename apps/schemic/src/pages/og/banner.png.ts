// Build-time GitHub README banner (1200×630, amber master brand). A deliverable
// asset — copied out to design/deliverables/ to hand to the README; not wired
// into any page's social meta.
import type { APIRoute } from "astro";
import { renderBanner } from "@schemic/landing/og/card";

export const GET: APIRoute = async () => {
  const png = await renderBanner();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
