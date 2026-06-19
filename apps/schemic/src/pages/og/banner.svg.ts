// Vector (SVG) version of the README banner, for crisp scaling / light-dark.
import type { APIRoute } from "astro";
import { renderBannerSvg } from "@schemic/landing/og/card";

export const GET: APIRoute = async () => {
  const svg = await renderBannerSvg();
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};
