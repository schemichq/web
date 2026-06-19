// Light-background variant of the GitHub README banner (1200×630, neutral gray
// on warm off-white). Deliverable asset copied to design/deliverables/; pairs
// with banner.png (dark) for a README <picture> light/dark swap.
import type { APIRoute } from "astro";
import { renderBanner } from "@schemic/landing/og/card";

export const GET: APIRoute = async () => {
  const png = await renderBanner("light");
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
