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
// the copy previously hardcoded across the components. Postgres entries are now
// VERIFIED by driver-dev-postgres (round-tripped through PGlite); the CLI chrome
// and codec shape are applied as verified, pending core-dev confirmation. See
// packages/landing/POSTGRES-EXAMPLES-NEEDED.md.

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
const blank = (n: number | null): Line => ({
  num: n,
  tokens: [{ t: " ", c: pl }],
});

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
      {
        num: 1,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "User", c: ty },
          { t: " = ", c: pl },
          { t: "defineTable", c: fn },
          { t: "(", c: pl },
          { t: '"user"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: "  id", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "string", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 3,
        hl: true,
        tokens: [
          { t: "  email", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "email", c: fn },
          { t: "().", c: pl },
          { t: "unique", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "  name", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "string", c: fn },
          { t: "().", c: pl },
          { t: "optional", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "  createdAt", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "datetime", c: fn },
          { t: "()", c: pl },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "    .", c: pl },
          { t: "$default", c: fn },
          { t: "(", c: pl },
          { t: "surql", c: fn },
          { t: "`", c: st },
          { t: "time::now", c: fn },
          { t: "()", c: pl },
          { t: "`", c: st },
          { t: ")", c: pl },
        ],
      },
      {
        num: 7,
        tokens: [
          { t: "    .", c: pl },
          { t: "$readonly", c: fn },
          { t: "(),", c: pl },
        ],
      },
      { num: 8, tokens: [{ t: "});", c: pl }] },
    ],
    output: [
      {
        num: 1,
        tokens: [
          { t: "DEFINE TABLE ", c: kw },
          { t: "user ", c: ty },
          { t: "TYPE NORMAL SCHEMAFULL", c: kw },
          { t: ";", c: pl },
        ],
      },
      {
        num: 2,
        hl: true,
        tokens: [
          { t: "DEFINE FIELD ", c: kw },
          { t: "email ", c: pl },
          { t: "ON TABLE ", c: kw },
          { t: "user ", c: ty },
          { t: "TYPE ", c: kw },
          { t: "string", c: ty },
        ],
      },
      {
        num: null,
        hl: true,
        tokens: [
          { t: "  ASSERT ", c: kw },
          { t: "string::is_email", c: fn },
          { t: "(", c: pl },
          { t: "$value", c: vr },
          { t: ");", c: pl },
        ],
      },
      {
        num: 3,
        hl: true,
        tokens: [
          { t: "DEFINE INDEX ", c: kw },
          { t: "user_email_idx ", c: pl },
          { t: "ON TABLE ", c: kw },
          { t: "user", c: ty },
        ],
      },
      {
        num: null,
        hl: true,
        tokens: [
          { t: "  FIELDS ", c: kw },
          { t: "email ", c: pl },
          { t: "UNIQUE", c: kw },
          { t: ";", c: pl },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "DEFINE FIELD ", c: kw },
          { t: "name ", c: pl },
          { t: "ON TABLE ", c: kw },
          { t: "user ", c: ty },
          { t: "TYPE ", c: kw },
          { t: "option", c: kw },
          { t: "<", c: pl },
          { t: "string", c: ty },
          { t: ">;", c: pl },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "DEFINE FIELD ", c: kw },
          { t: "createdAt ", c: pl },
          { t: "ON TABLE ", c: kw },
          { t: "user ", c: ty },
          { t: "TYPE ", c: kw },
          { t: "datetime", c: ty },
        ],
      },
      {
        num: null,
        tokens: [
          { t: "  DEFAULT ", c: kw },
          { t: "time::now", c: fn },
          { t: "() ", c: pl },
          { t: "READONLY", c: kw },
          { t: ";", c: pl },
        ],
      },
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
    {
      sym: "~",
      symC: mut,
      msg: " diffing schema.ts against snapshot…",
      msgC: mut,
    },
    {
      sym: "+",
      symC: ok,
      msg: " DEFINE TABLE user TYPE NORMAL SCHEMAFULL",
      msgC: ok,
    },
    {
      sym: "+",
      symC: ok,
      msg: " DEFINE FIELD email ON TABLE user … UNIQUE",
      msgC: ok,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " wrote migrations/0001_add_users.surql",
      msgC: sec,
    },
    { sym: " ", symC: mut, msg: "", msgC: mut },
    { sym: "$", symC: vr, msg: " sc migrate", msgC: pl },
    {
      sym: "▸",
      symC: soft,
      msg: " applying 0001_add_users.surql → surrealdb",
      msgC: soft,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " migrated user · 3 fields · 1 index",
      msgC: sec,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " recorded 0001 · sha 9f2c… · up to date",
      msgC: ok,
    },
  ],

  types: {
    query: [
      {
        num: 1,
        tokens: [
          { t: "const ", c: kw },
          { t: "limit ", c: pl },
          { t: "= ", c: pl },
          { t: "20", c: ty },
        ],
      },
      { num: 2, tokens: [{ t: " ", c: pl }] },
      {
        num: 3,
        tokens: [
          { t: "const ", c: kw },
          { t: "rows ", c: pl },
          { t: "= ", c: pl },
          { t: "await ", c: kw },
          { t: "db", c: pl },
          { t: ".", c: pl },
          { t: "query", c: fn },
          { t: "<[", c: pl },
          { t: "unknown", c: ty },
          { t: "[]]>(", c: pl },
          { t: "surql", c: fn },
          { t: "`", c: st },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "  SELECT ", c: kw },
          { t: "* ", c: pl },
          { t: "FROM ", c: kw },
          { t: "user", c: ty },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "  WHERE ", c: kw },
          { t: "createdAt ", c: pl },
          { t: "> ", c: pl },
          { t: "time::now", c: fn },
          { t: "() ", c: pl },
          { t: "- ", c: pl },
          { t: "90d", c: ty },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "  ORDER BY ", c: kw },
          { t: "createdAt ", c: pl },
          { t: "DESC ", c: kw },
          { t: "LIMIT ", c: kw },
          { t: "${", c: pl },
          { t: "limit", c: vr },
          { t: "}", c: pl },
        ],
      },
      {
        num: 7,
        tokens: [
          { t: "`", c: st },
          { t: ")", c: pl },
        ],
      },
      { num: 8, tokens: [{ t: " ", c: pl }] },
      {
        num: 9,
        tokens: [
          { t: "const ", c: kw },
          { t: "users ", c: pl },
          { t: "= ", c: pl },
          { t: "rows", c: pl },
          { t: "[", c: pl },
          { t: "0", c: ty },
          { t: "].", c: pl },
          { t: "map", c: fn },
          { t: "(", c: pl },
          { t: "User", c: ty },
          { t: ".", c: pl },
          { t: "decode", c: fn },
          { t: ")", c: pl },
        ],
      },
      {
        num: 10,
        tokens: [
          { t: "users", c: pl },
          { t: "[", c: pl },
          { t: "0", c: ty },
          { t: "].", c: pl },
        ],
      },
    ],
    members: [
      { name: "id", type: 'RecordId<"user", string>' },
      { name: "email", type: "string" },
      { name: "name?", type: "string" },
      { name: "createdAt", type: "Date" },
    ],
  },

  live: [
    {
      c: pl,
      tokens: [
        { t: "ON TABLE ", c: kw },
        { t: "user", c: ty },
      ],
    },
    {
      c: ok,
      tokens: [
        { t: "+ ", c: ok },
        { t: "ASSERT ", c: kw },
        { t: "string::is_email", c: fn },
        { t: "($value)", c: pl },
        { t: "   email", c: mut },
      ],
    },
    {
      c: vr,
      tokens: [
        { t: "~ ", c: vr },
        { t: "TYPE ", c: kw },
        { t: "option<string> ", c: ty },
        { t: "→ ", c: pl },
        { t: "string", c: ty },
        { t: "   name", c: mut },
      ],
    },
    {
      c: dn,
      tokens: [
        { t: "- ", c: dn },
        { t: "DEFINE INDEX ", c: kw },
        { t: "legacy_email_idx", c: pl },
        { t: "   removed", c: mut },
      ],
    },
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
      {
        num: 1,
        tokens: [{ t: "// events, functions & access — one file", c: cm }],
      },
      {
        num: 2,
        tokens: [
          { t: "User", c: ty },
          { t: ".", c: pl },
          { t: "event", c: fn },
          { t: "(", c: pl },
          { t: '"welcome"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 3,
        tokens: [
          { t: "  when", c: pl },
          { t: ": ", c: pl },
          { t: "surql", c: fn },
          { t: "`", c: st },
          { t: "$event", c: vr },
          { t: " = ", c: pl },
          { t: "'CREATE'", c: st },
          { t: "`", c: st },
          { t: ",", c: pl },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "  then", c: pl },
          { t: ": ", c: pl },
          { t: "surql", c: fn },
          { t: "`", c: st },
          { t: "fn::welcome", c: fn },
          { t: "(", c: pl },
          { t: "$after.id", c: vr },
          { t: ")", c: pl },
          { t: "`", c: st },
          { t: ",", c: pl },
        ],
      },
      { num: 5, tokens: [{ t: "})", c: pl }] },
      blank(6),
      {
        num: 7,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "welcome", c: pl },
          { t: " = ", c: pl },
          { t: "defineFunction", c: fn },
          { t: "(", c: pl },
          { t: '"welcome"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 8,
        tokens: [
          { t: "  user", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "recordId", c: fn },
          { t: "(", c: pl },
          { t: '"user"', c: st },
          { t: "),", c: pl },
        ],
      },
      {
        num: 9,
        tokens: [
          { t: "}).", c: pl },
          { t: "body", c: fn },
          { t: "(", c: pl },
          { t: "surql", c: fn },
          { t: "`", c: st },
          { t: "CREATE ", c: kw },
          { t: "log", c: ty },
          { t: " ", c: pl },
          { t: "SET ", c: kw },
          { t: "user", c: pl },
          { t: " = ", c: pl },
          { t: "$user", c: vr },
          { t: "`", c: st },
          { t: ")", c: pl },
        ],
      },
      blank(10),
      {
        num: 11,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "account", c: pl },
          { t: " = ", c: pl },
          { t: "defineAccess", c: fn },
          { t: "(", c: pl },
          { t: '"account"', c: st },
          { t: ")", c: pl },
        ],
      },
      {
        num: 12,
        tokens: [
          { t: "  .", c: pl },
          { t: "record", c: fn },
          { t: "().", c: pl },
          { t: "signup", c: fn },
          { t: "(", c: pl },
          { t: "surql", c: fn },
          { t: "`", c: st },
          { t: "CREATE ", c: kw },
          { t: "user", c: ty },
          { t: " ", c: pl },
          { t: "SET ", c: kw },
          { t: "email", c: pl },
          { t: " = ", c: pl },
          { t: "$email", c: vr },
          { t: "`", c: st },
          { t: ")", c: pl },
        ],
      },
      {
        num: 13,
        tokens: [
          { t: "  .", c: pl },
          { t: "duration", c: fn },
          { t: "({ ", c: pl },
          { t: "session", c: pl },
          { t: ": ", c: pl },
          { t: '"12h"', c: st },
          { t: " })", c: pl },
        ],
      },
    ],
    output: [
      {
        num: 1,
        tokens: [
          { t: "DEFINE EVENT ", c: kw },
          { t: "welcome ", c: pl },
          { t: "ON TABLE ", c: kw },
          { t: "user", c: ty },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: "  WHEN ", c: kw },
          { t: "$event", c: vr },
          { t: " = ", c: pl },
          { t: "'CREATE'", c: st },
        ],
      },
      {
        num: 3,
        tokens: [
          { t: "  THEN ", c: kw },
          { t: "fn::welcome", c: fn },
          { t: "(", c: pl },
          { t: "$after.id", c: vr },
          { t: ");", c: pl },
        ],
      },
      blank(4),
      {
        num: 5,
        tokens: [
          { t: "DEFINE FUNCTION ", c: kw },
          { t: "fn::welcome", c: fn },
          { t: "(", c: pl },
          { t: "$user", c: vr },
          { t: ": ", c: pl },
          { t: "record", c: kw },
          { t: "<", c: pl },
          { t: "user", c: ty },
          { t: ">", c: pl },
          { t: ") {", c: pl },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "  CREATE ", c: kw },
          { t: "log ", c: ty },
          { t: "SET ", c: kw },
          { t: "user", c: pl },
          { t: " = ", c: pl },
          { t: "$user", c: vr },
        ],
      },
      { num: 7, tokens: [{ t: "};", c: pl }] },
      blank(8),
      {
        num: 9,
        tokens: [
          { t: "DEFINE ACCESS ", c: kw },
          { t: "account ", c: pl },
          { t: "ON DATABASE", c: kw },
        ],
      },
      { num: 10, tokens: [{ t: "  TYPE RECORD", c: kw }] },
      {
        num: 11,
        tokens: [
          { t: "  SIGNUP ", c: kw },
          { t: "(", c: pl },
          { t: "CREATE ", c: kw },
          { t: "user ", c: ty },
          { t: "SET ", c: kw },
          { t: "email", c: pl },
          { t: " = ", c: pl },
          { t: "$email", c: vr },
          { t: ")", c: pl },
        ],
      },
      {
        num: 12,
        tokens: [
          { t: "  DURATION FOR SESSION ", c: kw },
          { t: "12h", c: ty },
          { t: ";", c: pl },
        ],
      },
    ],
  },

  bento: {
    dropIn: [
      [
        { t: "email", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "email", c: fn },
        { t: "().", c: pl },
        { t: "unique", c: fn },
        { t: "(),", c: pl },
      ],
      [
        { t: "name", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "string", c: fn },
        { t: "().", c: pl },
        { t: "optional", c: fn },
        { t: "(),", c: pl },
      ],
      [
        { t: "role", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "enum", c: fn },
        { t: "([", c: pl },
        { t: '"admin"', c: st },
        { t: ", ", c: pl },
        { t: '"user"', c: st },
        { t: "]),", c: pl },
      ],
      [
        { t: "createdAt", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "datetime", c: fn },
        { t: "().", c: pl },
        { t: "$default", c: fn },
        { t: "(", c: pl },
        { t: "surql", c: fn },
        { t: "`", c: st },
        { t: "time::now", c: fn },
        { t: "()", c: pl },
        { t: "`", c: st },
        { t: "),", c: pl },
      ],
    ],
    endTypes: [
      [
        { t: "type ", c: kw },
        { t: "User", c: ty },
        { t: " = ", c: pl },
        { t: "App", c: fn },
        { t: "<", c: pl },
        { t: "typeof", c: kw },
        { t: " User>", c: ty },
      ],
      [{ t: '// { id: RecordId<"user">; email: string; … }', c: cm }],
      [
        { t: "type ", c: kw },
        { t: "NewUser", c: ty },
        { t: " = ", c: pl },
        { t: "Create", c: fn },
        { t: "<", c: pl },
        { t: "typeof", c: kw },
        { t: " User", c: ty },
        { t: ">;", c: pl },
      ],
      [{ t: "// id + $readonly fields excluded", c: cm }],
    ],
    byo: [
      [
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "instanceof", c: fn },
        { t: "(", c: pl },
        { t: "Money", c: ty },
        { t: ")", c: pl },
      ],
      [
        { t: "  .", c: pl },
        { t: "$surreal", c: fn },
        { t: "(", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "string", c: fn },
        { t: "(), {", c: pl },
      ],
      [
        { t: "    encode, decode ", c: pl },
        { t: "})", c: pl },
      ],
    ],
    live: [
      [
        { t: "~ ", c: cm },
        { t: "sc diff --live", c: pl },
      ],
      [
        { t: "+ ", c: ok },
        { t: "DEFINE INDEX user_email_idx", c: ok },
      ],
      [
        { t: "- ", c: dn },
        { t: "DEFINE FIELD legacy_id", c: dn },
      ],
    ],
  },
};

// ===========================================================================
// PostgreSQL — VERIFIED by driver-dev-postgres. Every DDL/schema slot was
// produced by the real @schemic/postgres driver and round-tripped through
// PGlite (apply -> introspectAll -> buildKindDiff = {up:[],down:[]}). The CLI
// chrome (~ diffing…, ✓ wrote…, N changes…) and the codec shape are applied as
// driver-dev-postgres verified, pending core-dev confirmation. Depth has no
// pg analog today (no DEFINE ACCESS/EVENT/FUNCTION), so depth.available=false.
// See POSTGRES-EXAMPLES-NEEDED.md.
// ===========================================================================
const postgres: DriverExamples = {
  lang: "PostgreSQL",
  file: "user.sql",

  schema: {
    input: [
      {
        num: 1,
        tokens: [
          { t: "import ", c: kw },
          { t: "{ ", c: pl },
          { t: "defineTable", c: fn },
          { t: ", ", c: pl },
          { t: "s", c: pl },
          { t: ", ", c: pl },
          { t: "sqlExpr", c: fn },
          { t: " } ", c: pl },
          { t: "from ", c: kw },
          { t: '"@schemic/postgres"', c: st },
          { t: ";", c: pl },
        ],
      },
      blank(2),
      {
        num: 3,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "user", c: ty },
          { t: " = ", c: pl },
          { t: "defineTable", c: fn },
          { t: "(", c: pl },
          { t: '"user"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 4,
        hl: true,
        tokens: [
          { t: "  email", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "text", c: fn },
          { t: "()", c: pl },
        ],
      },
      {
        num: 5,
        hl: true,
        tokens: [
          { t: "    .", c: pl },
          { t: "$unique", c: fn },
          { t: "()", c: pl },
        ],
      },
      {
        num: 6,
        hl: true,
        tokens: [
          { t: "    .", c: pl },
          { t: "$check", c: fn },
          { t: "(", c: pl },
          { t: "sqlExpr", c: fn },
          { t: "(", c: pl },
          { t: "\"email ~* '^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$'\"", c: st },
          { t: ")),", c: pl },
        ],
      },
      {
        num: 7,
        tokens: [
          { t: "  name", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "string", c: fn },
          { t: "().", c: pl },
          { t: "optional", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 8,
        tokens: [
          { t: "  createdAt", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "timestamptz", c: fn },
          { t: "().", c: pl },
          { t: "$default", c: fn },
          { t: "(", c: pl },
          { t: "sqlExpr", c: fn },
          { t: "(", c: pl },
          { t: '"now()"', c: st },
          { t: ")),", c: pl },
        ],
      },
      { num: 9, tokens: [{ t: "});", c: pl }] },
    ],
    output: [
      {
        num: 1,
        tokens: [
          { t: "CREATE TABLE ", c: kw },
          { t: '"user" ', c: ty },
          { t: "(", c: pl },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: '  "id" ', c: pl },
          { t: "text ", c: ty },
          { t: "PRIMARY KEY", c: kw },
          { t: ",", c: pl },
        ],
      },
      {
        num: 3,
        tokens: [
          { t: '  "createdAt" ', c: pl },
          { t: "timestamp with time zone ", c: ty },
          { t: "NOT NULL ", c: kw },
          { t: "DEFAULT ", c: kw },
          { t: "now", c: fn },
          { t: "()", c: pl },
          { t: ",", c: pl },
        ],
      },
      {
        num: 4,
        hl: true,
        tokens: [
          { t: '  "email" ', c: pl },
          { t: "text ", c: ty },
          { t: "NOT NULL ", c: kw },
          { t: "CHECK ", c: kw },
          { t: "(", c: pl },
          { t: "email ", c: pl },
          { t: "~* ", c: kw },
          { t: "'^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'", c: st },
          { t: "),", c: pl },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: '  "name" ', c: pl },
          { t: "text", c: ty },
        ],
      },
      { num: 6, tokens: [{ t: ");", c: pl }] },
      {
        num: 7,
        hl: true,
        tokens: [
          { t: "CREATE UNIQUE INDEX ", c: kw },
          { t: '"user_email_key" ', c: pl },
          { t: "ON ", c: kw },
          { t: '"user" ', c: ty },
          { t: "(", c: pl },
          { t: '"email"', c: pl },
          { t: ");", c: pl },
        ],
      },
    ],
    mapNote: [
      { t: "Highlighted — one " },
      { t: "s.text().$unique().$check(…)", code: true, c: soft },
      { t: " compiles to a " },
      { t: "column", code: true, c: ty },
      { t: " + a " },
      { t: "CHECK", code: true, c: ty },
      { t: " + a " },
      { t: "UNIQUE INDEX", code: true, c: ty },
      { t: "." },
    ],
  },

  migrations: [
    { sym: "$", symC: vr, msg: " sc generate add_users", msgC: pl },
    {
      sym: "~",
      symC: mut,
      msg: " diffing schema.ts against snapshot…",
      msgC: mut,
    },
    { sym: "+", symC: ok, msg: ' CREATE TABLE "user" (…)', msgC: ok },
    {
      sym: "+",
      symC: ok,
      msg: ' CREATE UNIQUE INDEX "user_email_key" ON "user" ("email")',
      msgC: ok,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " wrote migrations/0001_add_users.surql",
      msgC: sec,
    },
    { sym: " ", symC: mut, msg: "", msgC: mut },
    { sym: "$", symC: vr, msg: " sc migrate", msgC: pl },
    {
      sym: "▸",
      symC: soft,
      msg: " applying 0001_add_users.surql → postgres",
      msgC: soft,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " migrated user · 3 fields · 1 index",
      msgC: sec,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " recorded 0001 · sha 9f2c… · up to date",
      msgC: ok,
    },
  ],

  types: {
    query: [
      {
        num: 1,
        tokens: [
          { t: "import ", c: kw },
          { t: "{ ", c: pl },
          { t: "pgSql", c: fn },
          { t: ", ", c: pl },
          { t: "identifier", c: fn },
          { t: " } ", c: pl },
          { t: "from ", c: kw },
          { t: '"@schemic/postgres"', c: st },
          { t: ";", c: pl },
        ],
      },
      blank(2),
      {
        num: 3,
        tokens: [
          { t: "const ", c: kw },
          { t: "limit ", c: pl },
          { t: "= ", c: pl },
          { t: "20", c: ty },
        ],
      },
      blank(4),
      {
        num: 5,
        tokens: [
          { t: "const ", c: kw },
          { t: "{ rows } ", c: pl },
          { t: "= ", c: pl },
          { t: "await ", c: kw },
          { t: "db", c: pl },
          { t: ".", c: pl },
          { t: "query", c: fn },
          { t: "(", c: pl },
          { t: "pgSql", c: fn },
          { t: "`", c: st },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "  SELECT ", c: kw },
          { t: "* ", c: pl },
          { t: "FROM ", c: kw },
          { t: "${", c: pl },
          { t: "identifier", c: fn },
          { t: "(", c: pl },
          { t: '"user"', c: st },
          { t: ")", c: pl },
          { t: "}", c: pl },
        ],
      },
      {
        num: 7,
        tokens: [
          { t: "  WHERE ", c: kw },
          { t: "${", c: pl },
          { t: "identifier", c: fn },
          { t: "(", c: pl },
          { t: '"createdAt"', c: st },
          { t: ")", c: pl },
          { t: "} ", c: pl },
          { t: "> ", c: pl },
          { t: "now", c: fn },
          { t: "() ", c: pl },
          { t: "- ", c: pl },
          { t: "interval ", c: kw },
          { t: "'90 days'", c: st },
        ],
      },
      {
        num: 8,
        tokens: [
          { t: "  ORDER BY ", c: kw },
          { t: "${", c: pl },
          { t: "identifier", c: fn },
          { t: "(", c: pl },
          { t: '"createdAt"', c: st },
          { t: ")", c: pl },
          { t: "} ", c: pl },
          { t: "DESC ", c: kw },
          { t: "LIMIT ", c: kw },
          { t: "${", c: pl },
          { t: "limit", c: vr },
          { t: "}", c: pl },
        ],
      },
      {
        num: 9,
        tokens: [
          { t: "`", c: st },
          { t: ")", c: pl },
        ],
      },
      blank(10),
      {
        num: 11,
        tokens: [
          { t: "const ", c: kw },
          { t: "users ", c: pl },
          { t: "= ", c: pl },
          { t: "rows ", c: pl },
          { t: "as ", c: kw },
          { t: "App", c: ty },
          { t: "<", c: pl },
          { t: "typeof", c: kw },
          { t: " user", c: ty },
          { t: ">[]", c: pl },
        ],
      },
      {
        num: 12,
        tokens: [
          { t: "users", c: pl },
          { t: "[", c: pl },
          { t: "0", c: ty },
          { t: "].", c: pl },
        ],
      },
    ],
    members: [
      { name: "email", type: "string" },
      { name: "name?", type: "string" },
      { name: "createdAt", type: "Date" },
    ],
  },

  live: [
    {
      c: pl,
      tokens: [
        { t: "ON TABLE ", c: kw },
        { t: '"user"', c: ty },
      ],
    },
    {
      c: ok,
      tokens: [
        { t: "+ ", c: ok },
        { t: "ALTER COLUMN ", c: kw },
        { t: '"name" ', c: pl },
        { t: "SET NOT NULL", c: kw },
        { t: "   name", c: mut },
      ],
    },
    {
      c: dn,
      tokens: [
        { t: "- ", c: dn },
        { t: "DROP INDEX ", c: kw },
        { t: "legacy_email_idx", c: pl },
        { t: "   removed", c: mut },
      ],
    },
  ],

  cli: [
    {
      cmd: "sc generate add_users",
      outputs: [
        { t: "  ~ diffing schema.ts against the live schema…", c: mut },
        { t: '  + CREATE TABLE "user" (…)', c: ok },
        {
          t: '  + CREATE UNIQUE INDEX "user_email_key" ON "user" ("email")',
          c: ok,
        },
        { t: "  ✓ wrote migrations/0001_add_users.surql", c: sec },
      ],
    },
    {
      cmd: "sc migrate",
      outputs: [
        { t: "  ▸ applying 0001_add_users.surql → postgres", c: soft },
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

  // The Depth section renders on EVERY route with the SAME layout — only the code
  // shown changes (Depth.astro no longer gates on `available`). VERIFIED by
  // driver-dev-postgres: this customer/order schema round-trips through the real
  // @schemic/postgres driver with a zero diff — one typed file compiles to tables,
  // a FOREIGN KEY with ON DELETE CASCADE, CHECK constraints, and a STORED generated
  // column, all native PostgreSQL DDL.
  depth: {
    available: true,
    title: "Relations, checks & generated columns",
    inputFile: "schema.ts",
    inputLang: "TypeScript",
    outputFile: "schema.ddl",
    outputLang: "PostgreSQL",
    input: [
      {
        num: 1,
        tokens: [
          { t: "import ", c: kw },
          { t: "{ ", c: pl },
          { t: "defineTable", c: fn },
          { t: ", ", c: pl },
          { t: "s", c: pl },
          { t: ", ", c: pl },
          { t: "sqlExpr", c: fn },
          { t: " } ", c: pl },
          { t: "from ", c: kw },
          { t: '"@schemic/postgres"', c: st },
          { t: ";", c: pl },
        ],
      },
      blank(2),
      {
        num: 3,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "customer", c: ty },
          { t: " = ", c: pl },
          { t: "defineTable", c: fn },
          { t: "(", c: pl },
          { t: '"customer"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 4,
        hl: true,
        tokens: [
          { t: "  email", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "text", c: fn },
          { t: "().", c: pl },
          { t: "$unique", c: fn },
          { t: "().", c: pl },
          { t: "$check", c: fn },
          { t: "(", c: pl },
          { t: "sqlExpr", c: fn },
          { t: "(", c: pl },
          { t: "\"email ~* '^[^@]+@[^@]+$'\"", c: st },
          { t: ")),", c: pl },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "  name", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "text", c: fn },
          { t: "(),", c: pl },
        ],
      },
      { num: 6, tokens: [{ t: "});", c: pl }] },
      blank(7),
      {
        num: 8,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "order", c: ty },
          { t: " = ", c: pl },
          { t: "defineTable", c: fn },
          { t: "(", c: pl },
          { t: '"order"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 9,
        hl: true,
        tokens: [
          { t: "  customer", c: pl },
          { t: ": ", c: pl },
          { t: "customer", c: pl },
          { t: ".", c: pl },
          { t: "record", c: fn },
          { t: "({ ", c: pl },
          { t: "onDelete", c: pl },
          { t: ": ", c: pl },
          { t: '"cascade"', c: st },
          { t: " }),", c: pl },
        ],
      },
      {
        num: 10,
        hl: true,
        tokens: [
          { t: "  quantity", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "integer", c: fn },
          { t: "().", c: pl },
          { t: "$check", c: fn },
          { t: "(", c: pl },
          { t: "sqlExpr", c: fn },
          { t: "(", c: pl },
          { t: '"quantity > 0"', c: st },
          { t: ")),", c: pl },
        ],
      },
      {
        num: 11,
        tokens: [
          { t: "  unitPrice", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "numeric", c: fn },
          { t: "(", c: pl },
          { t: "10", c: ty },
          { t: ", ", c: pl },
          { t: "2", c: ty },
          { t: "),", c: pl },
        ],
      },
      {
        num: 12,
        hl: true,
        tokens: [
          { t: "  total", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "numeric", c: fn },
          { t: "(", c: pl },
          { t: "12", c: ty },
          { t: ", ", c: pl },
          { t: "2", c: ty },
          { t: ").", c: pl },
          { t: "$generated", c: fn },
          { t: "(", c: pl },
          { t: "'quantity * \"unitPrice\"'", c: st },
          { t: "),", c: pl },
        ],
      },
      {
        num: 13,
        tokens: [
          { t: "  createdAt", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "timestamptz", c: fn },
          { t: "().", c: pl },
          { t: "$default", c: fn },
          { t: "(", c: pl },
          { t: "sqlExpr", c: fn },
          { t: "(", c: pl },
          { t: '"now()"', c: st },
          { t: ")),", c: pl },
        ],
      },
      { num: 14, tokens: [{ t: "});", c: pl }] },
    ],
    output: [
      {
        num: 1,
        tokens: [
          { t: "CREATE TABLE ", c: kw },
          { t: '"customer" ', c: ty },
          { t: "(", c: pl },
        ],
      },
      {
        num: 2,
        tokens: [
          { t: '  "id" ', c: pl },
          { t: "text ", c: ty },
          { t: "PRIMARY KEY", c: kw },
          { t: ",", c: pl },
        ],
      },
      {
        num: 3,
        hl: true,
        tokens: [
          { t: '  "email" ', c: pl },
          { t: "text ", c: ty },
          { t: "NOT NULL ", c: kw },
          { t: "CHECK ", c: kw },
          { t: "(", c: pl },
          { t: "email ", c: pl },
          { t: "~* ", c: kw },
          { t: "'^[^@]+@[^@]+$'", c: st },
          { t: "),", c: pl },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: '  "name" ', c: pl },
          { t: "text ", c: ty },
          { t: "NOT NULL", c: kw },
        ],
      },
      { num: 5, tokens: [{ t: ");", c: pl }] },
      blank(6),
      {
        num: 7,
        tokens: [
          { t: "CREATE TABLE ", c: kw },
          { t: '"order" ', c: ty },
          { t: "(", c: pl },
        ],
      },
      {
        num: 8,
        tokens: [
          { t: '  "id" ', c: pl },
          { t: "text ", c: ty },
          { t: "PRIMARY KEY", c: kw },
          { t: ",", c: pl },
        ],
      },
      {
        num: 9,
        tokens: [
          { t: '  "createdAt" ', c: pl },
          { t: "timestamp with time zone ", c: ty },
          { t: "NOT NULL ", c: kw },
          { t: "DEFAULT ", c: kw },
          { t: "now", c: fn },
          { t: "()", c: pl },
          { t: ",", c: pl },
        ],
      },
      {
        num: 10,
        hl: true,
        tokens: [
          { t: '  "customer" ', c: pl },
          { t: "text ", c: ty },
          { t: "NOT NULL", c: kw },
          { t: ",", c: pl },
        ],
      },
      {
        num: 11,
        hl: true,
        tokens: [
          { t: '  "quantity" ', c: pl },
          { t: "integer ", c: ty },
          { t: "NOT NULL ", c: kw },
          { t: "CHECK ", c: kw },
          { t: "(", c: pl },
          { t: "quantity > 0", c: pl },
          { t: "),", c: pl },
        ],
      },
      {
        num: 12,
        hl: true,
        tokens: [
          { t: '  "total" ', c: pl },
          { t: "numeric", c: ty },
          { t: "(", c: pl },
          { t: "12", c: ty },
          { t: ", ", c: pl },
          { t: "2", c: ty },
          { t: ") ", c: pl },
          { t: "NOT NULL ", c: kw },
          { t: "GENERATED ALWAYS AS ", c: kw },
          { t: "(", c: pl },
          { t: 'quantity * "unitPrice"', c: pl },
          { t: ") ", c: pl },
          { t: "STORED", c: kw },
          { t: ",", c: pl },
        ],
      },
      {
        num: 13,
        tokens: [
          { t: '  "unitPrice" ', c: pl },
          { t: "numeric", c: ty },
          { t: "(", c: pl },
          { t: "10", c: ty },
          { t: ", ", c: pl },
          { t: "2", c: ty },
          { t: ") ", c: pl },
          { t: "NOT NULL", c: kw },
        ],
      },
      { num: 14, tokens: [{ t: ");", c: pl }] },
      blank(15),
      {
        num: 16,
        hl: true,
        tokens: [
          { t: "CREATE UNIQUE INDEX ", c: kw },
          { t: '"customer_email_key" ', c: pl },
          { t: "ON ", c: kw },
          { t: '"customer" ', c: ty },
          { t: "(", c: pl },
          { t: '"email"', c: pl },
          { t: ");", c: pl },
        ],
      },
      {
        num: 17,
        hl: true,
        tokens: [
          { t: "ALTER TABLE ", c: kw },
          { t: '"order" ', c: ty },
          { t: "ADD CONSTRAINT ", c: kw },
          { t: '"order_customer_fkey"', c: pl },
        ],
      },
      {
        num: null,
        hl: true,
        tokens: [
          { t: "  FOREIGN KEY ", c: kw },
          { t: "(", c: pl },
          { t: '"customer"', c: pl },
          { t: ") ", c: pl },
          { t: "REFERENCES ", c: kw },
          { t: '"customer" ', c: ty },
          { t: "(", c: pl },
          { t: '"id"', c: pl },
          { t: ") ", c: pl },
          { t: "ON DELETE CASCADE", c: kw },
          { t: ";", c: pl },
        ],
      },
    ],
  },

  bento: {
    dropIn: [
      [
        { t: "email", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "text", c: fn },
        { t: "().", c: pl },
        { t: "$unique", c: fn },
        { t: "().", c: pl },
        { t: "$check", c: fn },
        { t: "(", c: pl },
        { t: "sqlExpr", c: fn },
        { t: "(", c: pl },
        { t: "\"email ~* '…'\"", c: st },
        { t: ")),", c: pl },
      ],
      [
        { t: "name", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "string", c: fn },
        { t: "().", c: pl },
        { t: "optional", c: fn },
        { t: "(),", c: pl },
      ],
      [
        { t: "role", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "enum", c: fn },
        { t: "([", c: pl },
        { t: '"admin"', c: st },
        { t: ", ", c: pl },
        { t: '"user"', c: st },
        { t: "]),", c: pl },
      ],
      [
        { t: "createdAt", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "timestamptz", c: fn },
        { t: "().", c: pl },
        { t: "$default", c: fn },
        { t: "(", c: pl },
        { t: "sqlExpr", c: fn },
        { t: "(", c: pl },
        { t: '"now()"', c: st },
        { t: ")),", c: pl },
      ],
    ],
    endTypes: [
      [
        { t: "type ", c: kw },
        { t: "User", c: ty },
        { t: " = ", c: pl },
        { t: "App", c: fn },
        { t: "<", c: pl },
        { t: "typeof", c: kw },
        { t: " user>", c: ty },
      ],
      [
        {
          t: '// { email: string; name?: string; role: "admin" | "user"; createdAt: Date }',
          c: cm,
        },
      ],
      [
        { t: "type ", c: kw },
        { t: "WireUser", c: ty },
        { t: " = ", c: pl },
        { t: "Wire", c: fn },
        { t: "<", c: pl },
        { t: "typeof", c: kw },
        { t: " user>", c: ty },
      ],
      [{ t: "// the encoded (DB-wire) row type", c: cm }],
    ],
    byo: [
      [
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "$postgres", c: fn },
        { t: "(", c: pl },
        { t: '"text"', c: st },
        { t: ",", c: pl },
      ],
      [
        { t: "  z", c: fn },
        { t: ".", c: pl },
        { t: "codec", c: fn },
        { t: "(", c: pl },
        { t: "z", c: fn },
        { t: ".", c: pl },
        { t: "string", c: fn },
        { t: "(), ", c: pl },
        { t: "z", c: fn },
        { t: ".", c: pl },
        { t: "instanceof", c: fn },
        { t: "(", c: pl },
        { t: "Money", c: ty },
        { t: "), {", c: pl },
      ],
      [
        { t: "    decode, encode ", c: pl },
        { t: "}))", c: pl },
      ],
    ],
    live: [
      [
        { t: "~ ", c: cm },
        { t: "sc diff --live", c: pl },
      ],
      [
        { t: "+ ", c: ok },
        { t: "CREATE UNIQUE INDEX user_email_key", c: ok },
      ],
      [
        { t: "- ", c: dn },
        { t: "DROP COLUMN legacy_id", c: dn },
      ],
    ],
  },
};

// ===========================================================================
// AGNOSTIC HUB — the database-agnostic schemic.dev landing (no driver selected).
// Only `schema.input` is surfaced UNBLURRED: a NEUTRAL @schemic/core schema built
// from universal primitives ONLY (no s.email()/$readonly/surql/sqlExpr — nothing
// driver-specific). Every generated/OUTPUT region (DDL, migrations, types, live,
// cli, depth, bento) is rendered behind a "Select a database" blur overlay on the
// hub, so those slots hold neutral placeholders that never actually surface.
//
// NEUTRAL hub schema — confirm core API with core-dev.
// ===========================================================================
const agnostic: DriverExamples = {
  // Agnostic prose: H2 reads "to generated native DDL"; header chips stay neutral.
  lang: "native DDL",
  file: "schema.ddl",

  schema: {
    input: [
      {
        num: 1,
        tokens: [
          { t: "import ", c: kw },
          { t: "{ ", c: pl },
          { t: "s", c: pl },
          { t: ", ", c: pl },
          { t: "defineTable", c: fn },
          { t: " } ", c: pl },
          { t: "from ", c: kw },
          { t: '"@schemic/<driver>"', c: st },
          { t: ";", c: pl },
        ],
      },
      blank(2),
      {
        num: 3,
        tokens: [
          {
            t: "// Pick a database — the shape stays the same, the import + output change",
            c: cm,
          },
        ],
      },
      {
        num: 4,
        tokens: [
          { t: "export ", c: kw },
          { t: "const ", c: kw },
          { t: "User", c: ty },
          { t: " = ", c: pl },
          { t: "defineTable", c: fn },
          { t: "(", c: pl },
          { t: '"user"', c: st },
          { t: ", {", c: pl },
        ],
      },
      {
        num: 5,
        tokens: [
          { t: "  id", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "string", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 6,
        tokens: [
          { t: "  name", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "string", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 7,
        tokens: [
          { t: "  email", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "string", c: fn },
          { t: "(),", c: pl },
        ],
      },
      {
        num: 8,
        tokens: [
          { t: "  createdAt", c: pl },
          { t: ": ", c: pl },
          { t: "s", c: pl },
          { t: ".", c: pl },
          { t: "datetime", c: fn },
          { t: "(),", c: pl },
        ],
      },
      { num: 9, tokens: [{ t: "});", c: pl }] },
    ],
    // Blurred on the hub — padded to roughly the input's height so the "Select a
    // database" overlay fills the whole generated-output pane (not just one line).
    output: [
      {
        num: 1,
        tokens: [{ t: "-- Pick a database to generate native DDL.", c: cm }],
      },
      blank(2),
      blank(3),
      blank(4),
      blank(5),
      blank(6),
      blank(7),
      blank(8),
    ],
    mapNote: [{ t: "Pick a database to generate native DDL." }],
  },

  // All of the following render behind the hub's "Select a database" blur — they
  // never surface, so they stay deliberately neutral.
  migrations: [
    { sym: "$", symC: vr, msg: " sc generate add_users", msgC: pl },
    {
      sym: "~",
      symC: mut,
      msg: " diffing schema.ts against snapshot…",
      msgC: mut,
    },
    {
      sym: "✓",
      symC: ok,
      msg: " select a database to generate migrations",
      msgC: sec,
    },
  ],

  types: {
    query: [
      {
        num: 1,
        tokens: [
          { t: "// Pick a database to see decoded, end-to-end types.", c: cm },
        ],
      },
    ],
    members: [
      { name: "id", type: "string" },
      { name: "name", type: "string" },
      { name: "email", type: "string" },
      { name: "createdAt", type: "Date" },
    ],
  },

  live: [
    {
      c: pl,
      tokens: [
        { t: "ON TABLE ", c: kw },
        { t: "user", c: ty },
      ],
    },
    {
      c: mut,
      tokens: [
        { t: "~ ", c: mut },
        { t: "select a database to diff against a live DB", c: mut },
      ],
    },
  ],

  cli: [
    {
      cmd: "sc generate add_users",
      outputs: [
        { t: "  ~ select a database to see generated artifacts", c: mut },
      ],
    },
    {
      cmd: "sc migrate",
      outputs: [{ t: "  ~ select a database to apply migrations", c: mut }],
    },
    {
      cmd: "sc diff --live",
      outputs: [
        { t: "  ~ select a database to diff against a live DB", c: mut },
      ],
    },
  ],

  // Rendered (so the section shows) but blurred on the hub — neutral placeholder.
  // available=true so Depth is shown-then-blurred (only the pg no-analog case hides it).
  depth: {
    available: true,
    title: "access.ts → native DDL",
    inputFile: "access.ts",
    inputLang: "TypeScript",
    outputFile: "access.ddl",
    outputLang: "native DDL",
    input: [
      {
        num: 1,
        tokens: [
          { t: "// Events, functions & access — one typed file.", c: cm },
        ],
      },
      {
        num: 2,
        tokens: [{ t: "// Pick a database to generate native DDL.", c: cm }],
      },
    ],
    output: [
      {
        num: 1,
        tokens: [{ t: "-- Select a database to generate native DDL.", c: cm }],
      },
    ],
  },

  bento: {
    dropIn: [
      [
        { t: "email", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "string", c: fn },
        { t: "(),", c: pl },
      ],
      [
        { t: "name", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "string", c: fn },
        { t: "().", c: pl },
        { t: "optional", c: fn },
        { t: "(),", c: pl },
      ],
      [
        { t: "createdAt", c: pl },
        { t: ": ", c: pl },
        { t: "s", c: fn },
        { t: ".", c: pl },
        { t: "datetime", c: fn },
        { t: "(),", c: pl },
      ],
    ],
    endTypes: [
      [
        { t: "type ", c: kw },
        { t: "User", c: ty },
        { t: " = ", c: pl },
        { t: "App", c: fn },
        { t: "<", c: pl },
        { t: "typeof", c: kw },
        { t: " User>", c: ty },
      ],
      [{ t: "// Pick a database to infer row types.", c: cm }],
    ],
    byo: [
      [{ t: "// Pick a database to bring your own", c: cm }],
      [{ t: "// types with a typed codec.", c: cm }],
    ],
    live: [
      [
        { t: "~ ", c: cm },
        { t: "sc diff --live", c: pl },
      ],
      [{ t: "// Pick a database to diff a live DB.", c: cm }],
    ],
  },
};

export const examples: Record<string, DriverExamples> = { surrealdb, postgres };

/**
 * The full example set for a driver slug. On the agnostic hub (null slug) this
 * returns the NEUTRAL @schemic/core example (universal schema input + placeholder
 * outputs shown behind the "Select a database" blur). A known driver slug returns
 * that driver's verified examples; an unknown slug falls back to the neutral set.
 */
export function examplesFor(slug: string | null | undefined): DriverExamples {
  if (slug == null) return agnostic;
  return examples[slug] ?? agnostic;
}
