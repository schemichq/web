// Per-driver code examples for the shared landing.
//
// EVERY driver-specific code block on the landing is data here, keyed by driver
// slug, so each component renders the active driver's dialect. Components select
// with `examplesFor(activeDriver)`, falling back to the flagship (surrealdb)
// when the slug is null (the agnostic hub) or unknown.
//
// The CLI command itself (`sc …`) is driver-agnostic — only the generated
// artifacts / DDL dialect / output differ. Keep that split when adding drivers.
//
// SurrealDB content below is the verified, shipped example — byte-identical to
// the copy previously hardcoded across the components. Postgres entries are
// DRAFTS flagged `// TODO: pending driver-dev-postgres verification`; the
// Postgres driver team must verify them (see packages/landing/POSTGRES-EXAMPLES-NEEDED.md)
// before they are treated as authoritative. Do not ship the pg drafts as final.

// Brand code-token color classes (mirror @schemic/brand's code-* tokens).
const kw = "text-code-keyword";
const fn = "text-code-fn";
const ty = "text-code-type";
const st = "text-code-string";
const pl = "text-code-plain";
const vr = "text-accent-2";
const cm = "text-code-comment";
const mut = "text-ink-3";
const ok = "text-success";
const dn = "text-danger";
const soft = "text-accent-soft";
const sec = "text-ink-2";

export type Tok = { t: string; c: string };
export type Line = { num: number | null; hl?: boolean; tokens: Tok[] };
/** A single space line (keeps gutter numbering). */
const blank = (n: number | null): Line => ({ num: n, tokens: [{ t: " ", c: pl }] });

/** Terminal line in the Demo's "Migrations (CLI)" panel. */
export type TermLine = { sym: string; symC: string; msg: string; msgC: string };
/** A `$ command` + its output lines (CLISpotlight terminal); one token/line. */
export type CliBlock = { cmd: string; outputs: Tok[] };
/** A diff line in the Demo's "Live round-trip" panel. */
export type DriftLine = { c: string; tokens: Tok[] };
/** An autocomplete member in the Demo's "End-to-end types" panel. */
export type TypeMember = { name: string; type: string };
/** A segment of the schema -> DDL map note (plain text, or an inline code chip). */
export type NoteSeg = { t: string; code?: boolean; c?: string };

export interface DriverExamples {
  /** Demo + global: the generated-DDL dialect label/filename. */
  lang: string;
  file: string;

  /** Demo — "Schema → DDL" pane (input + generated output + map note). */
  schema: {
    input: Line[];
    output: Line[];
    /** The highlight callout under the pane (driver-specific DDL wording). */
    mapNote: NoteSeg[];
  };

  /** Demo — "Migrations (CLI)" panel. */
  migrations: TermLine[];

  /** Demo — "End-to-end types" panel (query + decoded-row autocomplete). */
  types: { query: Line[]; members: TypeMember[] };

  /** Demo — "Live round-trip" panel (drift diff lines). */
  live: DriftLine[];

  /** CLISpotlight — the terminal session blocks. */
  cli: CliBlock[];

  /**
   * Depth — events / functions / access rules, one typed file -> DDL.
   * `available` = does this driver author an analog of DEFINE ACCESS / EVENT /
   * FUNCTION? When false the whole Depth section is hidden for that driver.
   */
  depth: {
    available: boolean;
    title: string;
    inputFile: string;
    inputLang: string;
    outputFile: string;
    outputLang: string;
    input: Line[];
    output: Line[];
  };

  /** Bento — the per-card mini snippets that are driver-specific. */
  bento: {
    /** "Drop-in Zod API" card (the `$default` line is driver-specific). */
    dropIn: Tok[][];
    /** "End-to-end types" card (RecordId / row-id types). */
    endTypes: Tok[][];
    /** "Bring your own types" card (the `$<driver>` codec hook). */
    byo: Tok[][];
    /** "Live round-trip" card (DEFINE INDEX / FIELD diff). */
    live: Tok[][];
  };
}

// ===========================================================================
// SurrealDB — VERIFIED, shipped. Byte-identical to the prior hardcoded copy.
// ===========================================================================
const surrealdb: DriverExamples = {
  lang: "SurrealQL",
  file: "user.surql",

  schema: {
    input: [
      { num: 1, tokens: [{ t: "export ", c: kw }, { t: "const ", c: kw }, { t: "User", c: ty }, { t: " = ", c: pl }, { t: "defineTable", c: fn }, { t: "(", c: pl }, { t: '"user"', c: st }, { t: ", {", c: pl }] },
      { num: 2, tokens: [{ t: "  id", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "(),", c: pl }] },
      { num: 3, hl: true, tokens: [{ t: "  email", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "email", c: fn }, { t: "().", c: pl }, { t: "unique", c: fn }, { t: "(),", c: pl }] },
      { num: 4, tokens: [{ t: "  name", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "().", c: pl }, { t: "optional", c: fn }, { t: "(),", c: pl }] },
      { num: 5, tokens: [{ t: "  createdAt", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "datetime", c: fn }, { t: "()", c: pl }] },
      { num: 6, tokens: [{ t: "    .", c: pl }, { t: "$default", c: fn }, { t: "(", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }, { t: "time::now", c: fn }, { t: "()", c: pl }, { t: "`", c: st }, { t: ")", c: pl }] },
      { num: 7, tokens: [{ t: "    .", c: pl }, { t: "$readonly", c: fn }, { t: "(),", c: pl }] },
      { num: 8, tokens: [{ t: "});", c: pl }] },
    ],
    output: [
      { num: 1, tokens: [{ t: "DEFINE TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE NORMAL SCHEMAFULL", c: kw }, { t: ";", c: pl }] },
      { num: 2, hl: true, tokens: [{ t: "DEFINE FIELD ", c: kw }, { t: "email ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE ", c: kw }, { t: "string", c: ty }] },
      { num: null, hl: true, tokens: [{ t: "  ASSERT ", c: kw }, { t: "string::is_email", c: fn }, { t: "(", c: pl }, { t: "$value", c: vr }, { t: ");", c: pl }] },
      { num: 3, hl: true, tokens: [{ t: "DEFINE INDEX ", c: kw }, { t: "user_email_idx ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user", c: ty }] },
      { num: null, hl: true, tokens: [{ t: "  FIELDS ", c: kw }, { t: "email ", c: pl }, { t: "UNIQUE", c: kw }, { t: ";", c: pl }] },
      { num: 4, tokens: [{ t: "DEFINE FIELD ", c: kw }, { t: "name ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE ", c: kw }, { t: "option", c: kw }, { t: "<", c: pl }, { t: "string", c: ty }, { t: ">;", c: pl }] },
      { num: 5, tokens: [{ t: "DEFINE FIELD ", c: kw }, { t: "createdAt ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user ", c: ty }, { t: "TYPE ", c: kw }, { t: "datetime", c: ty }] },
      { num: null, tokens: [{ t: "  DEFAULT ", c: kw }, { t: "time::now", c: fn }, { t: "() ", c: pl }, { t: "READONLY", c: kw }, { t: ";", c: pl }] },
    ],
    mapNote: [
      { t: "Highlighted — one " },
      { t: "s.email().unique()", code: true, c: soft },
      { t: " compiles to a typed " },
      { t: "FIELD", code: true, c: ty },
      { t: " + a " },
      { t: "UNIQUE INDEX", code: true, c: ty },
      { t: "." },
    ],
  },

  migrations: [
    { sym: "$", symC: vr, msg: " sc generate add_users", msgC: pl },
    { sym: "~", symC: mut, msg: " diffing schema.ts against snapshot…", msgC: mut },
    { sym: "+", symC: ok, msg: " DEFINE TABLE user TYPE NORMAL SCHEMAFULL", msgC: ok },
    { sym: "+", symC: ok, msg: " DEFINE FIELD email ON TABLE user … UNIQUE", msgC: ok },
    { sym: "✓", symC: ok, msg: " wrote migrations/0001_add_users.surql", msgC: sec },
    { sym: " ", symC: mut, msg: "", msgC: mut },
    { sym: "$", symC: vr, msg: " sc migrate", msgC: pl },
    { sym: "▸", symC: soft, msg: " applying 0001_add_users.surql → surrealdb", msgC: soft },
    { sym: "✓", symC: ok, msg: " migrated user · 3 fields · 1 index", msgC: sec },
    { sym: "✓", symC: ok, msg: " recorded 0001 · sha 9f2c… · up to date", msgC: ok },
  ],

  types: {
    query: [
      { num: 1, tokens: [{ t: "const ", c: kw }, { t: "limit ", c: pl }, { t: "= ", c: pl }, { t: "20", c: ty }] },
      { num: 2, tokens: [{ t: " ", c: pl }] },
      { num: 3, tokens: [{ t: "const ", c: kw }, { t: "rows ", c: pl }, { t: "= ", c: pl }, { t: "await ", c: kw }, { t: "db", c: pl }, { t: ".", c: pl }, { t: "query", c: fn }, { t: "<[", c: pl }, { t: "unknown", c: ty }, { t: "[]]>(", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }] },
      { num: 4, tokens: [{ t: "  SELECT ", c: kw }, { t: "* ", c: pl }, { t: "FROM ", c: kw }, { t: "user", c: ty }] },
      { num: 5, tokens: [{ t: "  WHERE ", c: kw }, { t: "createdAt ", c: pl }, { t: "> ", c: pl }, { t: "time::now", c: fn }, { t: "() ", c: pl }, { t: "- ", c: pl }, { t: "90d", c: ty }] },
      { num: 6, tokens: [{ t: "  ORDER BY ", c: kw }, { t: "createdAt ", c: pl }, { t: "DESC ", c: kw }, { t: "LIMIT ", c: kw }, { t: "${", c: pl }, { t: "limit", c: vr }, { t: "}", c: pl }] },
      { num: 7, tokens: [{ t: "`", c: st }, { t: ")", c: pl }] },
      { num: 8, tokens: [{ t: " ", c: pl }] },
      { num: 9, tokens: [{ t: "const ", c: kw }, { t: "users ", c: pl }, { t: "= ", c: pl }, { t: "rows", c: pl }, { t: "[", c: pl }, { t: "0", c: ty }, { t: "].", c: pl }, { t: "map", c: fn }, { t: "(", c: pl }, { t: "User", c: ty }, { t: ".", c: pl }, { t: "decode", c: fn }, { t: ")", c: pl }] },
      { num: 10, tokens: [{ t: "users", c: pl }, { t: "[", c: pl }, { t: "0", c: ty }, { t: "].", c: pl }] },
    ],
    members: [
      { name: "id", type: 'RecordId<"user", string>' },
      { name: "email", type: "string" },
      { name: "name?", type: "string" },
      { name: "createdAt", type: "Date" },
    ],
  },

  live: [
    { c: pl, tokens: [{ t: "ON TABLE ", c: kw }, { t: "user", c: ty }] },
    { c: ok, tokens: [{ t: "+ ", c: ok }, { t: "ASSERT ", c: kw }, { t: "string::is_email", c: fn }, { t: "($value)", c: pl }, { t: "   email", c: mut }] },
    { c: vr, tokens: [{ t: "~ ", c: vr }, { t: "TYPE ", c: kw }, { t: "option<string> ", c: ty }, { t: "→ ", c: pl }, { t: "string", c: ty }, { t: "   name", c: mut }] },
    { c: dn, tokens: [{ t: "- ", c: dn }, { t: "DEFINE INDEX ", c: kw }, { t: "legacy_email_idx", c: pl }, { t: "   removed", c: mut }] },
  ],

  cli: [
    {
      cmd: "sc generate add_users",
      outputs: [
        { t: "  ~ diffing schema.ts against the live schema…", c: mut },
        { t: "  + DEFINE TABLE user TYPE NORMAL SCHEMAFULL", c: ok },
        { t: "  + DEFINE FIELD email ON TABLE user … UNIQUE", c: ok },
        { t: "  ✓ wrote migrations/0001_add_users.surql", c: sec },
      ],
    },
    {
      cmd: "sc migrate",
      outputs: [
        { t: "  ▸ applying 0001_add_users.surql → surrealdb", c: soft },
        { t: "  ✓ migrated user · 3 fields · 1 index", c: sec },
        { t: "  ✓ schema up to date", c: ok },
      ],
    },
    {
      cmd: "sc diff --live",
      outputs: [
        { t: "  ~ comparing schema.ts ↔ running database", c: mut },
        { t: "  ✓ no drift — live schema matches your code", c: ok },
      ],
    },
  ],

  depth: {
    available: true,
    title: "access.ts → access.surql",
    inputFile: "access.ts",
    inputLang: "TypeScript",
    outputFile: "access.surql",
    outputLang: "SurrealQL",
    input: [
      { num: 1, tokens: [{ t: "// events, functions & access — one file", c: cm }] },
      { num: 2, tokens: [{ t: "User", c: ty }, { t: ".", c: pl }, { t: "event", c: fn }, { t: "(", c: pl }, { t: '"welcome"', c: st }, { t: ", {", c: pl }] },
      { num: 3, tokens: [{ t: "  when", c: pl }, { t: ": ", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }, { t: "$event", c: vr }, { t: " = ", c: pl }, { t: "'CREATE'", c: st }, { t: "`", c: st }, { t: ",", c: pl }] },
      { num: 4, tokens: [{ t: "  then", c: pl }, { t: ": ", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }, { t: "fn::welcome", c: fn }, { t: "(", c: pl }, { t: "$after.id", c: vr }, { t: ")", c: pl }, { t: "`", c: st }, { t: ",", c: pl }] },
      { num: 5, tokens: [{ t: "})", c: pl }] },
      blank(6),
      { num: 7, tokens: [{ t: "export ", c: kw }, { t: "const ", c: kw }, { t: "welcome", c: pl }, { t: " = ", c: pl }, { t: "defineFunction", c: fn }, { t: "(", c: pl }, { t: '"welcome"', c: st }, { t: ", {", c: pl }] },
      { num: 8, tokens: [{ t: "  user", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "recordId", c: fn }, { t: "(", c: pl }, { t: '"user"', c: st }, { t: "),", c: pl }] },
      { num: 9, tokens: [{ t: "}).", c: pl }, { t: "body", c: fn }, { t: "(", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }, { t: "CREATE ", c: kw }, { t: "log", c: ty }, { t: " ", c: pl }, { t: "SET ", c: kw }, { t: "user", c: pl }, { t: " = ", c: pl }, { t: "$user", c: vr }, { t: "`", c: st }, { t: ")", c: pl }] },
      blank(10),
      { num: 11, tokens: [{ t: "export ", c: kw }, { t: "const ", c: kw }, { t: "account", c: pl }, { t: " = ", c: pl }, { t: "defineAccess", c: fn }, { t: "(", c: pl }, { t: '"account"', c: st }, { t: ")", c: pl }] },
      { num: 12, tokens: [{ t: "  .", c: pl }, { t: "record", c: fn }, { t: "().", c: pl }, { t: "signup", c: fn }, { t: "(", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }, { t: "CREATE ", c: kw }, { t: "user", c: ty }, { t: " ", c: pl }, { t: "SET ", c: kw }, { t: "email", c: pl }, { t: " = ", c: pl }, { t: "$email", c: vr }, { t: "`", c: st }, { t: ")", c: pl }] },
      { num: 13, tokens: [{ t: "  .", c: pl }, { t: "duration", c: fn }, { t: "({ ", c: pl }, { t: "session", c: pl }, { t: ": ", c: pl }, { t: '"12h"', c: st }, { t: " })", c: pl }] },
    ],
    output: [
      { num: 1, tokens: [{ t: "DEFINE EVENT ", c: kw }, { t: "welcome ", c: pl }, { t: "ON TABLE ", c: kw }, { t: "user", c: ty }] },
      { num: 2, tokens: [{ t: "  WHEN ", c: kw }, { t: "$event", c: vr }, { t: " = ", c: pl }, { t: "'CREATE'", c: st }] },
      { num: 3, tokens: [{ t: "  THEN ", c: kw }, { t: "fn::welcome", c: fn }, { t: "(", c: pl }, { t: "$after.id", c: vr }, { t: ");", c: pl }] },
      blank(4),
      { num: 5, tokens: [{ t: "DEFINE FUNCTION ", c: kw }, { t: "fn::welcome", c: fn }, { t: "(", c: pl }, { t: "$user", c: vr }, { t: ": ", c: pl }, { t: "record", c: kw }, { t: "<", c: pl }, { t: "user", c: ty }, { t: ">", c: pl }, { t: ") {", c: pl }] },
      { num: 6, tokens: [{ t: "  CREATE ", c: kw }, { t: "log ", c: ty }, { t: "SET ", c: kw }, { t: "user", c: pl }, { t: " = ", c: pl }, { t: "$user", c: vr }] },
      { num: 7, tokens: [{ t: "};", c: pl }] },
      blank(8),
      { num: 9, tokens: [{ t: "DEFINE ACCESS ", c: kw }, { t: "account ", c: pl }, { t: "ON DATABASE", c: kw }] },
      { num: 10, tokens: [{ t: "  TYPE RECORD", c: kw }] },
      { num: 11, tokens: [{ t: "  SIGNUP ", c: kw }, { t: "(", c: pl }, { t: "CREATE ", c: kw }, { t: "user ", c: ty }, { t: "SET ", c: kw }, { t: "email", c: pl }, { t: " = ", c: pl }, { t: "$email", c: vr }, { t: ")", c: pl }] },
      { num: 12, tokens: [{ t: "  DURATION FOR SESSION ", c: kw }, { t: "12h", c: ty }, { t: ";", c: pl }] },
    ],
  },

  bento: {
    dropIn: [
      [{ t: "email", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "email", c: fn }, { t: "().", c: pl }, { t: "unique", c: fn }, { t: "(),", c: pl }],
      [{ t: "name", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "().", c: pl }, { t: "optional", c: fn }, { t: "(),", c: pl }],
      [{ t: "role", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "enum", c: fn }, { t: "([", c: pl }, { t: '"admin"', c: st }, { t: ", ", c: pl }, { t: '"user"', c: st }, { t: "]),", c: pl }],
      [{ t: "createdAt", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "datetime", c: fn }, { t: "().", c: pl }, { t: "$default", c: fn }, { t: "(", c: pl }, { t: "surql", c: fn }, { t: "`", c: st }, { t: "time::now", c: fn }, { t: "()", c: pl }, { t: "`", c: st }, { t: "),", c: pl }],
    ],
    endTypes: [
      [{ t: "type ", c: kw }, { t: "User", c: ty }, { t: " = ", c: pl }, { t: "App", c: fn }, { t: "<", c: pl }, { t: "typeof", c: kw }, { t: " User>", c: ty }],
      [{ t: '// { id: RecordId<"user">; email: string; … }', c: cm }],
      [{ t: "type ", c: kw }, { t: "NewUser", c: ty }, { t: " = ", c: pl }, { t: "Create", c: fn }, { t: "<", c: pl }, { t: "typeof", c: kw }, { t: " User", c: ty }, { t: ">;", c: pl }],
      [{ t: "// id + $readonly fields excluded", c: cm }],
    ],
    byo: [
      [{ t: "s", c: fn }, { t: ".", c: pl }, { t: "instanceof", c: fn }, { t: "(", c: pl }, { t: "Money", c: ty }, { t: ")", c: pl }],
      [{ t: "  .", c: pl }, { t: "$surreal", c: fn }, { t: "(", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "(), {", c: pl }],
      [{ t: "    encode, decode ", c: pl }, { t: "})", c: pl }],
    ],
    live: [
      [{ t: "~ ", c: cm }, { t: "sc diff --live", c: pl }],
      [{ t: "+ ", c: ok }, { t: "DEFINE INDEX user_email_idx", c: ok }],
      [{ t: "- ", c: dn }, { t: "DEFINE FIELD legacy_id", c: dn }],
    ],
  },
};

// ===========================================================================
// PostgreSQL — DRAFT placeholders. NOT verified. The Postgres driver team must
// confirm exact generated output (column ordering, identifier quoting, CHECK
// regex, constraint vs index, function/trigger/policy syntax) before this is
// authoritative. See POSTGRES-EXAMPLES-NEEDED.md. Do not ship as final.
// ===========================================================================
const postgres: DriverExamples = {
  lang: "PostgreSQL",
  file: "user.sql",

  schema: {
    // TODO: pending driver-dev-postgres verification — pg INPUT differs:
    // id implicit/omitted, no $readonly, email is not s.email() yet.
    input: [
      { num: 1, tokens: [{ t: "export ", c: kw }, { t: "const ", c: kw }, { t: "User", c: ty }, { t: " = ", c: pl }, { t: "defineTable", c: fn }, { t: "(", c: pl }, { t: '"user"', c: st }, { t: ", {", c: pl }] },
      { num: 2, hl: true, tokens: [{ t: "  email", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "().", c: pl }, { t: "unique", c: fn }, { t: "(),", c: pl }] },
      { num: 3, tokens: [{ t: "  name", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "().", c: pl }, { t: "optional", c: fn }, { t: "(),", c: pl }] },
      { num: 4, tokens: [{ t: "  createdAt", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "datetime", c: fn }, { t: "()", c: pl }] },
      { num: 5, tokens: [{ t: "    .", c: pl }, { t: "$default", c: fn }, { t: "(", c: pl }, { t: "sql", c: fn }, { t: "`", c: st }, { t: "now", c: fn }, { t: "()", c: pl }, { t: "`", c: st }, { t: ")", c: pl }] },
      { num: 6, tokens: [{ t: "});", c: pl }] },
    ],
    // TODO: pending driver-dev-postgres verification — generated DDL draft only.
    output: [
      { num: 1, tokens: [{ t: "CREATE TABLE ", c: kw }, { t: '"user" ', c: ty }, { t: "(", c: pl }] },
      { num: 2, tokens: [{ t: "  id          ", c: pl }, { t: "text ", c: ty }, { t: "PRIMARY KEY", c: kw }, { t: ",", c: pl }] },
      { num: 3, tokens: [{ t: "  name        ", c: pl }, { t: "text ", c: ty }, { t: "NOT NULL", c: kw }, { t: ",", c: pl }] },
      { num: 4, hl: true, tokens: [{ t: "  email       ", c: pl }, { t: "text ", c: ty }, { t: "NOT NULL ", c: kw }, { t: "CHECK ", c: kw }, { t: "(", c: pl }, { t: "email ", c: pl }, { t: "~* ", c: kw }, { t: "'^[^@]+@[^@]+\\.[^@]+$'", c: st }, { t: "),", c: pl }] },
      { num: 5, tokens: [{ t: '  "createdAt" ', c: pl }, { t: "timestamptz ", c: ty }, { t: "NOT NULL ", c: kw }, { t: "DEFAULT ", c: kw }, { t: "now", c: fn }, { t: "()", c: pl }] },
      { num: 6, tokens: [{ t: ");", c: pl }] },
    ],
    // TODO: pending driver-dev-postgres verification — DDL wording draft only.
    mapNote: [
      { t: "Highlighted — one " },
      { t: "s.string().unique()", code: true, c: soft },
      { t: " compiles to a typed " },
      { t: "column", code: true, c: ty },
      { t: " + a " },
      { t: "UNIQUE constraint", code: true, c: ty },
      { t: "." },
    ],
  },

  // TODO: pending driver-dev-postgres verification — migration output draft only
  // (.sql artifact, CREATE TABLE / ALTER TABLE, "→ postgres").
  migrations: [
    { sym: "$", symC: vr, msg: " sc generate add_users", msgC: pl },
    { sym: "~", symC: mut, msg: " diffing schema.ts against snapshot…", msgC: mut },
    { sym: "+", symC: ok, msg: " CREATE TABLE \"user\" ( … )", msgC: ok },
    { sym: "+", symC: ok, msg: " ALTER TABLE \"user\" ADD UNIQUE (email)", msgC: ok },
    { sym: "✓", symC: ok, msg: " wrote migrations/0001_add_users.sql", msgC: sec },
    { sym: " ", symC: mut, msg: "", msgC: mut },
    { sym: "$", symC: vr, msg: " sc migrate", msgC: pl },
    { sym: "▸", symC: soft, msg: " applying 0001_add_users.sql → postgres", msgC: soft },
    { sym: "✓", symC: ok, msg: " migrated user · 3 columns · 1 constraint", msgC: sec },
    { sym: "✓", symC: ok, msg: " recorded 0001 · sha 9f2c… · up to date", msgC: ok },
  ],

  types: {
    // TODO: pending driver-dev-postgres verification — query dialect draft only
    // (SQL where/order, now() - interval, no time::now()/90d).
    query: [
      { num: 1, tokens: [{ t: "const ", c: kw }, { t: "limit ", c: pl }, { t: "= ", c: pl }, { t: "20", c: ty }] },
      { num: 2, tokens: [{ t: " ", c: pl }] },
      { num: 3, tokens: [{ t: "const ", c: kw }, { t: "rows ", c: pl }, { t: "= ", c: pl }, { t: "await ", c: kw }, { t: "db", c: pl }, { t: ".", c: pl }, { t: "query", c: fn }, { t: "<[", c: pl }, { t: "unknown", c: ty }, { t: "[]]>(", c: pl }, { t: "sql", c: fn }, { t: "`", c: st }] },
      { num: 4, tokens: [{ t: "  SELECT ", c: kw }, { t: "* ", c: pl }, { t: "FROM ", c: kw }, { t: '"user"', c: ty }] },
      { num: 5, tokens: [{ t: "  WHERE ", c: kw }, { t: '"createdAt" ', c: pl }, { t: "> ", c: pl }, { t: "now", c: fn }, { t: "() ", c: pl }, { t: "- ", c: pl }, { t: "interval ", c: kw }, { t: "'90 days'", c: st }] },
      { num: 6, tokens: [{ t: "  ORDER BY ", c: kw }, { t: '"createdAt" ', c: pl }, { t: "DESC ", c: kw }, { t: "LIMIT ", c: kw }, { t: "${", c: pl }, { t: "limit", c: vr }, { t: "}", c: pl }] },
      { num: 7, tokens: [{ t: "`", c: st }, { t: ")", c: pl }] },
      { num: 8, tokens: [{ t: " ", c: pl }] },
      { num: 9, tokens: [{ t: "const ", c: kw }, { t: "users ", c: pl }, { t: "= ", c: pl }, { t: "rows", c: pl }, { t: "[", c: pl }, { t: "0", c: ty }, { t: "].", c: pl }, { t: "map", c: fn }, { t: "(", c: pl }, { t: "User", c: ty }, { t: ".", c: pl }, { t: "decode", c: fn }, { t: ")", c: pl }] },
      { num: 10, tokens: [{ t: "users", c: pl }, { t: "[", c: pl }, { t: "0", c: ty }, { t: "].", c: pl }] },
    ],
    // TODO: pending driver-dev-postgres verification — pg row id type (uuid/text,
    // no RecordId).
    members: [
      { name: "id", type: "string" },
      { name: "email", type: "string" },
      { name: "name?", type: "string" },
      { name: "createdAt", type: "Date" },
    ],
  },

  // TODO: pending driver-dev-postgres verification — drift diff dialect draft only.
  live: [
    { c: pl, tokens: [{ t: "ON TABLE ", c: kw }, { t: '"user"', c: ty }] },
    { c: ok, tokens: [{ t: "+ ", c: ok }, { t: "CHECK ", c: kw }, { t: "(email ~* …)", c: pl }, { t: "   email", c: mut }] },
    { c: vr, tokens: [{ t: "~ ", c: vr }, { t: "text ", c: ty }, { t: "→ ", c: pl }, { t: "text NOT NULL", c: ty }, { t: "   name", c: mut }] },
    { c: dn, tokens: [{ t: "- ", c: dn }, { t: "DROP INDEX ", c: kw }, { t: "legacy_email_idx", c: pl }, { t: "   removed", c: mut }] },
  ],

  // TODO: pending driver-dev-postgres verification — terminal output draft only.
  cli: [
    {
      cmd: "sc generate add_users",
      outputs: [
        { t: "  ~ diffing schema.ts against the live schema…", c: mut },
        { t: '  + CREATE TABLE "user" ( … )', c: ok },
        { t: '  + ALTER TABLE "user" ADD UNIQUE (email)', c: ok },
        { t: "  ✓ wrote migrations/0001_add_users.sql", c: sec },
      ],
    },
    {
      cmd: "sc migrate",
      outputs: [
        { t: "  ▸ applying 0001_add_users.sql → postgres", c: soft },
        { t: "  ✓ migrated user · 3 columns · 1 constraint", c: sec },
        { t: "  ✓ schema up to date", c: ok },
      ],
    },
    {
      cmd: "sc diff --live",
      outputs: [
        { t: "  ~ comparing schema.ts ↔ running database", c: mut },
        { t: "  ✓ no drift — live schema matches your code", c: ok },
      ],
    },
  ],

  // TODO: pending driver-dev-postgres verification — FEATURE PARITY UNKNOWN.
  // Does @schemic/postgres author analogs of DEFINE ACCESS (RLS policies?),
  // DEFINE EVENT (triggers?), DEFINE FUNCTION (pg functions?)? If NO analog,
  // set `available: false` to hide this whole section on the Postgres page.
  // The draft below assumes trigger + function + RLS policy.
  depth: {
    available: true,
    title: "access.ts → access.sql",
    inputFile: "access.ts",
    inputLang: "TypeScript",
    outputFile: "access.sql",
    outputLang: "PostgreSQL",
    input: [
      { num: 1, tokens: [{ t: "// events, functions & access — one file", c: cm }] },
      { num: 2, tokens: [{ t: "User", c: ty }, { t: ".", c: pl }, { t: "event", c: fn }, { t: "(", c: pl }, { t: '"welcome"', c: st }, { t: ", {", c: pl }] },
      { num: 3, tokens: [{ t: "  when", c: pl }, { t: ": ", c: pl }, { t: '"INSERT"', c: st }, { t: ",", c: pl }] },
      { num: 4, tokens: [{ t: "  then", c: pl }, { t: ": ", c: pl }, { t: "sql", c: fn }, { t: "`", c: st }, { t: "welcome", c: fn }, { t: "(", c: pl }, { t: "NEW.id", c: vr }, { t: ")", c: pl }, { t: "`", c: st }, { t: ",", c: pl }] },
      { num: 5, tokens: [{ t: "})", c: pl }] },
      blank(6),
      { num: 7, tokens: [{ t: "export ", c: kw }, { t: "const ", c: kw }, { t: "welcome", c: pl }, { t: " = ", c: pl }, { t: "defineFunction", c: fn }, { t: "(", c: pl }, { t: '"welcome"', c: st }, { t: ", {", c: pl }] },
      { num: 8, tokens: [{ t: "  user", c: pl }, { t: ": ", c: pl }, { t: "s", c: pl }, { t: ".", c: pl }, { t: "uuid", c: fn }, { t: "(),", c: pl }] },
      { num: 9, tokens: [{ t: "}).", c: pl }, { t: "body", c: fn }, { t: "(", c: pl }, { t: "sql", c: fn }, { t: "`", c: st }, { t: "INSERT INTO ", c: kw }, { t: "log", c: ty }, { t: "(", c: pl }, { t: '"user"', c: pl }, { t: ") ", c: pl }, { t: "VALUES ", c: kw }, { t: "($user)", c: vr }, { t: "`", c: st }, { t: ")", c: pl }] },
      blank(10),
      { num: 11, tokens: [{ t: "export ", c: kw }, { t: "const ", c: kw }, { t: "account", c: pl }, { t: " = ", c: pl }, { t: "defineAccess", c: fn }, { t: "(", c: pl }, { t: '"account"', c: st }, { t: ")", c: pl }] },
      { num: 12, tokens: [{ t: "  .", c: pl }, { t: "policy", c: fn }, { t: "().", c: pl }, { t: "using", c: fn }, { t: "(", c: pl }, { t: "sql", c: fn }, { t: "`", c: st }, { t: '"user"', c: pl }, { t: " = ", c: pl }, { t: "current_user", c: vr }, { t: "`", c: st }, { t: ")", c: pl }] },
    ],
    output: [
      { num: 1, tokens: [{ t: "CREATE TRIGGER ", c: kw }, { t: "welcome ", c: pl }, { t: "AFTER INSERT ON ", c: kw }, { t: '"user"', c: ty }] },
      { num: 2, tokens: [{ t: "  FOR EACH ROW ", c: kw }, { t: "EXECUTE FUNCTION ", c: kw }, { t: "welcome", c: fn }, { t: "();", c: pl }] },
      blank(3),
      { num: 4, tokens: [{ t: "CREATE FUNCTION ", c: kw }, { t: "welcome", c: fn }, { t: "(", c: pl }, { t: "user ", c: pl }, { t: "uuid", c: ty }, { t: ") ", c: pl }, { t: "RETURNS trigger ", c: kw }, { t: "AS $$", c: pl }] },
      { num: 5, tokens: [{ t: "  INSERT INTO ", c: kw }, { t: "log", c: ty }, { t: "(", c: pl }, { t: '"user"', c: pl }, { t: ") ", c: pl }, { t: "VALUES ", c: kw }, { t: "(NEW.id);", c: vr }] },
      { num: 6, tokens: [{ t: "$$ ", c: pl }, { t: "LANGUAGE plpgsql", c: kw }, { t: ";", c: pl }] },
      blank(7),
      { num: 8, tokens: [{ t: "CREATE POLICY ", c: kw }, { t: "account ", c: pl }, { t: "ON ", c: kw }, { t: '"user"', c: ty }] },
      { num: 9, tokens: [{ t: "  USING ", c: kw }, { t: "(", c: pl }, { t: '"user" ', c: pl }, { t: "= ", c: pl }, { t: "current_user", c: vr }, { t: ");", c: pl }] },
    ],
  },

  bento: {
    // TODO: pending driver-dev-postgres verification — $default uses sql`now()`.
    dropIn: [
      [{ t: "email", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "().", c: pl }, { t: "unique", c: fn }, { t: "(),", c: pl }],
      [{ t: "name", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "().", c: pl }, { t: "optional", c: fn }, { t: "(),", c: pl }],
      [{ t: "role", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "enum", c: fn }, { t: "([", c: pl }, { t: '"admin"', c: st }, { t: ", ", c: pl }, { t: '"user"', c: st }, { t: "]),", c: pl }],
      [{ t: "createdAt", c: pl }, { t: ": ", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "datetime", c: fn }, { t: "().", c: pl }, { t: "$default", c: fn }, { t: "(", c: pl }, { t: "sql", c: fn }, { t: "`", c: st }, { t: "now", c: fn }, { t: "()", c: pl }, { t: "`", c: st }, { t: "),", c: pl }],
    ],
    // TODO: pending driver-dev-postgres verification — pg row id type (no RecordId).
    endTypes: [
      [{ t: "type ", c: kw }, { t: "User", c: ty }, { t: " = ", c: pl }, { t: "App", c: fn }, { t: "<", c: pl }, { t: "typeof", c: kw }, { t: " User>", c: ty }],
      [{ t: "// { id: string; email: string; … }", c: cm }],
      [{ t: "type ", c: kw }, { t: "NewUser", c: ty }, { t: " = ", c: pl }, { t: "Create", c: fn }, { t: "<", c: pl }, { t: "typeof", c: kw }, { t: " User", c: ty }, { t: ">;", c: pl }],
      [{ t: "// id + generated columns excluded", c: cm }],
    ],
    // TODO: pending driver-dev-postgres verification — codec hook name ($postgres?).
    byo: [
      [{ t: "s", c: fn }, { t: ".", c: pl }, { t: "instanceof", c: fn }, { t: "(", c: pl }, { t: "Money", c: ty }, { t: ")", c: pl }],
      [{ t: "  .", c: pl }, { t: "$postgres", c: fn }, { t: "(", c: pl }, { t: "s", c: fn }, { t: ".", c: pl }, { t: "string", c: fn }, { t: "(), {", c: pl }],
      [{ t: "    encode, decode ", c: pl }, { t: "})", c: pl }],
    ],
    // TODO: pending driver-dev-postgres verification — DDL diff draft only.
    live: [
      [{ t: "~ ", c: cm }, { t: "sc diff --live", c: pl }],
      [{ t: "+ ", c: ok }, { t: "CREATE INDEX user_email_idx", c: ok }],
      [{ t: "- ", c: dn }, { t: "DROP COLUMN legacy_id", c: dn }],
    ],
  },
};

export const examples: Record<string, DriverExamples> = { surrealdb, postgres };

/** The full example set for a driver slug, falling back to the flagship. */
export function examplesFor(slug: string | null | undefined): DriverExamples {
  return (slug && examples[slug]) || examples.surrealdb;
}
