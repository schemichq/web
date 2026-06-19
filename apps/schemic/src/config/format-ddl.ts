// Display-time pretty-printer for the generated DDL shown in the Examples gallery.
//
// WHY: the verified manifest stores each `ddl` as the exact golden string the
// driver emits (`emit(defs) === ddl`), which for SurrealQL is often ONE long
// line (e.g. a 256-char DEFINE ACCESS). That overflows the gallery's code column.
// We must NOT touch the manifest (it is re-vendored from upstream and the golden
// is contract), so we reflow it HERE, at render time, changing WHITESPACE ONLY —
// the shown DDL stays valid, token-identical SurrealQL.
//
// Postgres DDL (lang "sql") is already emitted multi-line, so it passes through
// untouched; the gallery's `wrap` handles the rare long line.
//
// Invariant (asserted in format-ddl.test): for every input,
//   formatDdl(ddl).replace(/\s+/g, " ").trim() === ddl.replace(/\s+/g, " ").trim()
// i.e. we only ever add/remove whitespace — never a token.

// Clause keywords that start a new indented line (2 spaces) when they appear at
// bracket-depth 0, outside any string, and are not the statement's first token.
const BREAK_CLAUSE = new Set([
  "TYPE",
  "SCHEMAFULL",
  "SCHEMALESS",
  "DROP",
  "CHANGEFEED",
  "PERMISSIONS",
  "ASSERT",
  "VALUE",
  "DEFAULT",
  "READONLY",
  "FLEXIBLE",
  "REFERENCE",
  "COMMENT",
  "SIGNUP",
  "SIGNIN",
  "AUTHENTICATE",
  "DURATION",
  "WHEN",
  "THEN",
]);

// `FOR` nests one level deeper (4 spaces): it lists permission verbs under
// PERMISSIONS (`FOR select WHERE …`) and token/session lifetimes under DURATION.
const BREAK_NESTED = new Set(["FOR"]);

const isWordChar = (c: string): boolean => /[A-Za-z0-9_]/.test(c);

// A statement that already fits the code column is left on ONE line — breaking
// trivially short defs (`DEFINE FIELD str ON TABLE t TYPE string`) would only add
// vertical height, fighting the gallery's "almost no scrolling" goal. Only
// statements wider than this reflow across clause lines. ~72 ≈ the rendered
// width of one half-width code column at text-sm mono.
const SINGLE_LINE_MAX = 72;

// Split a DDL blob into statements on TOP-LEVEL semicolons — a `;` that is not
// inside a string or a (){}[]  group. Returns trimmed, non-empty statements
// WITHOUT their trailing `;`.
function splitStatements(ddl: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let str: string | null = null;
  let cur = "";
  for (let i = 0; i < ddl.length; i++) {
    const c = ddl[i];
    if (str) {
      cur += c;
      if (c === "\\" && i + 1 < ddl.length) {
        cur += ddl[i + 1];
        i++;
        continue;
      }
      if (c === str) str = null;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      str = c;
      cur += c;
      continue;
    }
    if (c === "(" || c === "{" || c === "[") {
      depth++;
      cur += c;
      continue;
    }
    if (c === ")" || c === "}" || c === "]") {
      depth = Math.max(0, depth - 1);
      cur += c;
      continue;
    }
    if (c === ";" && depth === 0) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

// Reflow ONE statement: break before each clause keyword found at depth 0,
// outside strings, after the first token. Parenthesized/braced sub-expressions
// (SIGNUP { … }, ASSERT (…), permission predicates, function bodies) are left
// intact on their clause line — `wrap` softens any residual width.
function formatStatement(stmt: string): string {
  let out = "";
  let depth = 0;
  let str: string | null = null;
  let firstToken = false;
  let i = 0;
  const n = stmt.length;
  while (i < n) {
    const c = stmt[i];
    if (str) {
      out += c;
      if (c === "\\" && i + 1 < n) {
        out += stmt[i + 1];
        i += 2;
        continue;
      }
      if (c === str) str = null;
      i++;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      str = c;
      out += c;
      firstToken = true;
      i++;
      continue;
    }
    if (c === "(" || c === "{" || c === "[") {
      depth++;
      out += c;
      i++;
      continue;
    }
    if (c === ")" || c === "}" || c === "]") {
      depth = Math.max(0, depth - 1);
      out += c;
      i++;
      continue;
    }
    // Word start at top level?
    if (depth === 0 && isWordChar(c) && (i === 0 || !isWordChar(stmt[i - 1]))) {
      let j = i;
      while (j < n && isWordChar(stmt[j])) j++;
      const word = stmt.slice(i, j);
      if (firstToken && BREAK_CLAUSE.has(word)) {
        out = out.replace(/[ \t]+$/, "");
        out += `\n  ${word}`;
      } else if (firstToken && BREAK_NESTED.has(word)) {
        out = out.replace(/[ \t]+$/, "");
        out += `\n    ${word}`;
      } else {
        out += word;
      }
      firstToken = true;
      i = j;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/**
 * Pretty-print generated DDL for display. SurrealQL is reflowed across indented
 * lines (whitespace-only); SQL and anything else passes through unchanged.
 */
export function formatDdl(ddl: string, lang: string): string {
  if (lang !== "surrealql") return ddl;
  return splitStatements(ddl)
    .map((s) => {
      const oneLine = s.replace(/\s+/g, " ");
      const body =
        oneLine.length <= SINGLE_LINE_MAX ? oneLine : formatStatement(s);
      return `${body};`;
    })
    .join("\n");
}
