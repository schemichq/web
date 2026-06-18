# github-stars worker

A tiny, dependency-light Cloudflare Worker that exposes a single GitHub repo's
star count as JSON, cached at the edge. The Schemic landing (`@schemic/landing`)
fetches it once on load to show a star count on the Nav + Hero GitHub buttons.

## API

```
GET /  ->  { "stars": number | null }
```

- Reads `stargazers_count` from `https://api.github.com/repos/<GITHUB_REPO>`.
- **Caches** the JSON via the Cache API (keyed by request URL, ~600s TTL).
- Sets `access-control-allow-origin: *` and `cache-control: public, max-age=600`.
- Returns `{ "stars": null }` (HTTP 200) when the repo is **private / missing /
  rate-limited** or the upstream call fails — it never errors, so the UI can
  degrade gracefully (show no count, no layout shift).

## Configuration

| Name           | Type   | Default              | Notes                                            |
| -------------- | ------ | -------------------- | ------------------------------------------------ |
| `GITHUB_REPO`  | var    | `schemichq/schemic`  | `owner/repo` to read stars from.                 |
| `GITHUB_TOKEN` | secret | _(unset)_            | Optional. Higher rate limit / private-repo read. |

Set the repo (already defaulted in `wrangler.jsonc`):

```sh
# edit the "vars" in wrangler.jsonc, or set per-environment in the dashboard
```

Set the optional token (never hardcode it):

```sh
wrangler secret put GITHUB_TOKEN
```

## Develop / validate

```sh
bun install          # installs wrangler + workers-types + typescript
bun run typecheck    # tsc --noEmit
bun run dev          # local wrangler dev
```

## Deploy

```sh
wrangler deploy
```

Then point the landing at it via `PUBLIC_GITHUB_STARS_ENDPOINT` (see
`packages/landing/config/github.ts`) — e.g. `https://stars.schemic.dev`.

> Inert until the repo is public **and** this worker is deployed: until then the
> landing simply shows no count.
