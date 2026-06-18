// GitHub star-counter config for the shared landing.
//
// The Nav + Hero GitHub buttons show a live star count, fetched once on load
// from a cached Cloudflare Worker (see workers/github-stars). Everything here
// degrades gracefully: until the repo is public AND the worker is deployed, the
// fetch yields no usable count and the buttons stay plain "GitHub" — no count,
// no reserved gap, no layout shift.

/** "owner/repo" the star count is read from (mirrors the worker default). */
export const GITHUB_REPO = "schemichq/schemic";

/**
 * The cached star-count endpoint (the deployed `github-stars` worker). Override
 * at build time with PUBLIC_GITHUB_STARS_ENDPOINT; defaults to a placeholder
 * subdomain that simply 404s/never-resolves until the worker is live (handled
 * gracefully — no count is shown).
 */
export const GITHUB_STARS_ENDPOINT: string =
  import.meta.env.PUBLIC_GITHUB_STARS_ENDPOINT ?? "https://stars.schemic.dev";
