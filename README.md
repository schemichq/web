# @schemic/web

Schemic's public web properties — the **schemic.dev** library hub plus a
per-driver subdomain site for each database driver. One repo, many sites,
shared brand + UI.

## Architecture

A bun-workspaces monorepo. Each app is its own Astro build, deployed to its own
(sub)domain; shared design tokens and (later) chrome live in `packages/*` so
branding stays per-driver while the shell stays consistent.

```
apps/
  schemic/    -> schemic.dev            library hub: what Schemic is + "choose your database" driver chooser
  surreal/    -> surreal.schemic.dev    SurrealDB driver site: landing + docs + blog, SurrealDB brand
  postgres/   -> postgres.schemic.dev   PostgreSQL driver site (scaffold; in the works)
packages/
  brand/      shared Schemic design tokens (@schemic/brand) + per-driver palette
```

Each driver subdomain carries that database's own brand and contains that
driver's landing, docs, and everything related to it. SurrealDB is driver #1;
Postgres is next.

## Develop

```bash
bun install
bun run dev:surreal     # surreal.schemic.dev
bun run dev:schemic     # schemic.dev hub
bun run dev:postgres    # postgres.schemic.dev
bun run build           # builds apps/surreal (the live site today)
```

## Relationship to schemichq/schemic

The Schemic library (engine + CLI + drivers) lives in
[`schemichq/schemic`](https://github.com/schemichq/schemic). This repo is web
only. Docs code snippets are fact-checked against live driver behavior by the
driver teams via the shared agent bridge — run agents here with
`BRIDGE_NS=schemic` so verification requests reach the library repo's room.

## Status

**Phase 1A (done):** extracted the old `packages/docs` Astro app out of the
library repo into `apps/surreal`, rebranded surreal-zod -> Schemic (`sz.*` builder
-> `s.*`, `sz` CLI -> `sc`/`schemic`), repointed to `surreal.schemic.dev`, and
centralized design tokens into `@schemic/brand`. `apps/schemic` and
`apps/postgres` are stubs.

**Deferred:**
- Extract shared chrome (Nav/Footer/CodeBlock + the `components/docs/**` shell)
  into `packages/ui`, and the content-collection schema + code theme into
  `packages/content`.
- Build out the `schemic.dev` hub (library overview + driver chooser).
- Build the `postgres.schemic.dev` site.
- **Docs content**: `apps/surreal/src/content/docs/**` is empty — the prior
  content was removed in the library repo's bespoke-shell refactor and is not in
  git history. The docs team re-authors it here.
