/**
 * github-stars — a tiny, cached Cloudflare Worker that exposes a single repo's
 * star count to the browser.
 *
 * GET <worker> -> { "stars": number | null }
 *
 * It proxies https://api.github.com/repos/<GITHUB_REPO>, reads
 * `stargazers_count`, and caches the JSON at the edge (Cache API, ~600s). When
 * the upstream call is not OK (repo private / 404 / rate-limited / network
 * error) it returns `{ "stars": null }` with a 200 so the caller can degrade
 * gracefully instead of treating it as an error.
 */

export interface Env {
  /** "owner/repo" to read stars from. Defaults to "schemichq/schemic". */
  GITHUB_REPO?: string;
  /**
   * Optional GitHub token (secret) for a higher rate limit / private read.
   * Never hardcode — set via `wrangler secret put GITHUB_TOKEN`.
   */
  GITHUB_TOKEN?: string;
}

const DEFAULT_REPO = "schemichq/schemic";
const TTL_SECONDS = 600;

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, OPTIONS",
  "access-control-allow-headers": "*",
};

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${TTL_SECONDS}`,
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

async function fetchStars(
  repo: string,
  token: string | undefined,
): Promise<number | null> {
  const headers: Record<string, string> = {
    // GitHub requires a User-Agent on every request.
    "user-agent": "schemic-github-stars-worker",
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
  };
  if (token) headers.authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
    });
    // 404 (private/missing), 403 (rate limit), etc. -> null, never throw.
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonResponse({ stars: null }, 405, {
        allow: "GET, HEAD, OPTIONS",
      });
    }

    // Cache keyed by the request URL. A hit avoids hammering the GitHub API.
    const cache = caches.default;
    const cacheKey = new Request(request.url, { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const repo = env.GITHUB_REPO?.trim() || DEFAULT_REPO;
    const stars = await fetchStars(repo, env.GITHUB_TOKEN);
    const response = jsonResponse({ stars });

    // Populate the edge cache without blocking the response.
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
} satisfies ExportedHandler<Env>;
