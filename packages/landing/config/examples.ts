// Per-driver "Schema → DDL" examples for the Demo.
//
// The unified `s.*` schema INPUT pane is shared across drivers; only the
// generated DDL OUTPUT differs. The Demo picks an example by the page's
// `activeDriver` slug (falling back to the flagship/surrealdb when null), so a
// SurrealDB page shows SurrealQL and a Postgres page shows PostgreSQL DDL.
//
// Each example carries the output language label + filename surfaced in the
// pane header/headline, plus the tokenized DDL lines (colored with the brand
// `code-*` tokens).

// Brand code-token color classes (mirror @schemic/brand's code-* tokens).
const kw = "text-code-keyword";
const fn = "text-code-fn";
const ty = "text-code-type";
const st = "text-code-string";
const pl = "text-code-plain";
const vr = "text-accent-2";

export type Tok = { t: string; c: string };
export type Line = { num: number | null; hl?: boolean; tokens: Tok[] };

export interface DriverExample {
  /** Output language label (pane header chip + headline gradient word). */
  lang: string;
  /** Output filename shown in the pane header. */
  file: string;
  /** Tokenized generated-DDL lines for the right (output) pane. */
  lines: Line[];
}

// SurrealDB — the EXISTING verified example (do not change). DEFINE TABLE/FIELD
// with ASSERT string::is_email($value), a UNIQUE INDEX, and DEFAULT time::now()
// READONLY.
const surrealdb: DriverExample = {
  lang: "SurrealQL",
  file: "user.surql",
  lines: [
    { num: 1, tokens: [{ t: "DEFINE TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE NORMAL SCHEMAFULL", c: kw }, { t: ";", c: pl }] },
    { num: 2, hl: true, tokens: [{ t: "DEFINE FIELD ", c: kw }, { t: "email ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE ", c: kw }, { t: "string", c: ty }] },
    { num: null, hl: true, tokens: [{ t: "  ASSERT ", c: kw }, { t: "string::is_email", c: fn }, { t: "(", c: pl }, { t: "$value", c: vr }, { t: ");", c: pl }] },
    { num: 3, hl: true, tokens: [{ t: "DEFINE INDEX ", c: kw }, { t: "user_email_idx ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user", c: ty }] },
    { num: null, hl: true, tokens: [{ t: "  FIELDS ", c: kw }, { t: "email ", c: pl }, { t: "UNIQUE", c: kw }, { t: ";", c: pl }] },
    { num: 4, tokens: [{ t: "DEFINE FIELD ", c: kw }, { t: "name ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE ", c: kw }, { t: "option", c: kw }, { t: "<", c: pl }, { t: "string", c: ty }, { t: ">;", c: pl }] },
    { num: 5, tokens: [{ t: "DEFINE FIELD ", c: kw }, { t: "createdAt ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE ", c: kw }, { t: "datetime", c: ty }] },
    { num: null, tokens: [{ t: "  DEFAULT ", c: kw }, { t: "time::now", c: fn }, { t: "() ", c: pl }, { t: "READONLY", c: kw }, { t: ";", c: pl }] },
  ],
};

// TODO: pending driver-dev-postgres verification — do not ship.
// Reasonable draft DDL only; the Postgres driver team must verify the exact
// generated output (column ordering, CHECK regex, identifier quoting) before
// this is treated as authoritative.
const postgres: DriverExample = {
  lang: "PostgreSQL",
  file: "user.sql",
  lines: [
    { num: 1, tokens: [{ t: "CREATE TABLE ", c: kw }, { t: '"user" ', c: ty }, { t: "(", c: pl }] },
    { num: 2, tokens: [{ t: "  id          ", c: pl }, { t: "text ", c: ty }, { t: "PRIMARY KEY", c: kw }, { t: ",", c: pl }] },
    { num: 3, tokens: [{ t: "  name        ", c: pl }, { t: "text ", c: ty }, { t: "NOT NULL", c: kw }, { t: ",", c: pl }] },
    { num: 4, hl: true, tokens: [{ t: "  email       ", c: pl }, { t: "text ", c: ty }, { t: "NOT NULL ", c: kw }, { t: "CHECK ", c: kw }, { t: "(", c: pl }, { t: "email ", c: pl }, { t: "~* ", c: kw }, { t: "'^[^@]+@[^@]+\\.[^@]+$'", c: st }, { t: "),", c: pl }] },
    { num: 5, tokens: [{ t: '  "createdAt" ', c: pl }, { t: "timestamptz ", c: ty }, { t: "NOT NULL ", c: kw }, { t: "DEFAULT ", c: kw }, { t: "now", c: fn }, { t: "()", c: pl }] },
    { num: 6, tokens: [{ t: ");", c: pl }] },
  ],
};

export const examples: Record<string, DriverExample> = { surrealdb, postgres };

/** The example for a driver slug, falling back to the flagship (surrealdb). */
export function exampleFor(slug: string | null | undefined): DriverExample {
  return (slug && examples[slug]) || examples.surrealdb;
}
