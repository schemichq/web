// The Examples gallery's data source.
//
// VENDORED: the verified cookbook now comes from `examples-manifest.json`, copied
// byte-for-byte out of the schemic repo (main) — 69 driver-verified entries
// (47 surrealdb + 22 postgres). This module is a thin adapter: it imports the
// manifest and re-exports `manifest.entries` as `examplesCatalog`, so the gallery
// (components/ExamplesGallery.astro) keeps depending only on the CatalogExample
// shape and this export — no component change needed when re-syncing.
//
// RE-SYNC: when the upstream `source.hash` changes, replace the whole
// examples-manifest.json with the new copy from schemic. Do not hand-edit it.
import manifest from "./examples-manifest.json";

/** Staleness marker — must match the vendored manifest's `source.hash`. */
export const VENDORED_SOURCE_HASH = "a8a72e97e7b23fac";

/**
 * One verified cookbook example: a TS authoring source (`code`) and the DDL it
 * generates (`ddl`), grouped per driver. `lang` is the DDL dialect id
 * ("surrealql" | "sql") used to pick the Shiki grammar.
 */
export type CatalogExample = {
  driver: string;
  group: string;
  title: string;
  note?: string;
  code: string;
  ddl: string;
  lang: string;
};

export const examplesCatalog: CatalogExample[] =
  manifest.entries as CatalogExample[];
