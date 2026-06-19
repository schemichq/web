// Vector (SVG) version of the README banner, for crisp scaling / light-dark.

import { renderBannerSvg } from "@schemic/landing/og/card";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const svg = await renderBannerSvg();
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};
