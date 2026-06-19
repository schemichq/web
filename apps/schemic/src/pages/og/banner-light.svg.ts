// Vector (SVG) version of the light README banner variant.
import type { APIRoute } from "astro";
import { renderBannerSvg } from "@schemic/landing/og/card";

export const GET: APIRoute = async () => {
  const svg = await renderBannerSvg("light");
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};
