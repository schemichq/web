/**
 * Parser for the Schemic monorepo CHANGELOG.md (Keep a Changelog format),
 * fetched at build time and rendered into each driver site's Changelog page.
 *
 * The packages release in lockstep, so the repo keeps ONE changelog with
 * per-package-tagged entries (`- **core:** …`, `- **surrealdb:** …`). Each
 * site filters that single source down to the packages it ships (core + cli +
 * setup + its own driver) via `filterChangelog`.
 *
 * Pure string-in / data-out — no `astro:content` virtual module, no DOM — so it
 * runs in any build context (mirrors blog-schema.mjs / docs-schema.mjs).
 *
 *   import { parseChangelog, filterChangelog } from "@schemic/content/changelog";
 *   const parsed = parseChangelog(md);
 *   const filtered = filterChangelog(parsed, ["core", "cli", "setup", "surrealdb"]);
 */

/** A stable anchor id for a version (shared by the page TOC and the rendered
 * `<section id>` so the on-page table of contents links resolve). */
export function versionSlug(version) {
  return String(version)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const VERSION_RE = /^##\s+\[([^\]]+)\]\s*(?:-\s*(\S.*?))?\s*$/;
const GROUP_RE = /^###\s+(.+?)\s*$/;
const BULLET_RE = /^-\s+(.+?)\s*$/;
const INDENT_RE = /^\s+\S/;
const TAG_RE = /^\*\*([^*]+?):\*\*\s*(.*)$/;

/**
 * Parse the raw CHANGELOG markdown into structured data.
 *
 * @param {string} md
 * @returns {{ versions: Array<{
 *   version: string,
 *   date: string|null,
 *   unreleased: boolean,
 *   groups: Array<{
 *     title: string,
 *     breaking: boolean,
 *     entries: Array<{ pkg: string|null, text: string }>,
 *   }>,
 * }> }}
 */
export function parseChangelog(md) {
  const versions = [];
  let version = null;
  let group = null;
  let entry = null;

  for (const raw of String(md ?? "").split(/\r?\n/)) {
    const vm = raw.match(VERSION_RE);
    if (vm) {
      const name = vm[1].trim();
      const unreleased = name.toLowerCase() === "unreleased";
      version = {
        version: name,
        date: unreleased ? null : (vm[2]?.trim() ?? null),
        unreleased,
        groups: [],
      };
      versions.push(version);
      group = null;
      entry = null;
      continue;
    }

    if (!version) continue;

    const gm = raw.match(GROUP_RE);
    if (gm) {
      const title = gm[1].trim();
      group = { title, breaking: /BREAKING/i.test(title), entries: [] };
      version.groups.push(group);
      entry = null;
      continue;
    }

    const bm = raw.match(BULLET_RE);
    if (bm && group) {
      const body = bm[1];
      const tm = body.match(TAG_RE);
      entry = tm
        ? { pkg: tm[1].trim().toLowerCase(), text: tm[2].trim() }
        : { pkg: null, text: body.trim() };
      group.entries.push(entry);
      continue;
    }

    // Continuation line: indented wrap of the current entry's text.
    if (entry && INDENT_RE.test(raw)) {
      const cont = raw.trim();
      entry.text = entry.text ? `${entry.text} ${cont}` : cont;
      continue;
    }

    // Blank line or anything else ends the current entry's continuation.
    entry = null;
  }

  return { versions };
}

/** Does a parsed entry belong to any of `pkgs`? Untagged entries (pkg === null)
 * are treated as shared and always kept. Multi-package tags (e.g.
 * `**postgres / surrealdb …:**`) match if ANY listed package is requested, so a
 * change shared across drivers shows on each relevant site. */
function entryMatches(pkg, pkgs) {
  if (pkg == null) return true;
  const tokens = pkg.match(/[a-z]+/g) ?? [];
  return pkgs.some((p) => tokens.includes(p));
}

/**
 * Filter a parsed changelog down to the packages a site ships. Deep-copies so
 * the source is untouched: keeps entries whose pkg is in `pkgs` (or untagged),
 * drops groups that end up empty, then drops versions that end up with no
 * groups.
 *
 * @param {ReturnType<typeof parseChangelog>} parsed
 * @param {string[]} pkgs
 */
export function filterChangelog(parsed, pkgs) {
  const versions = (parsed?.versions ?? [])
    .map((v) => ({
      ...v,
      groups: v.groups
        .map((g) => ({
          ...g,
          entries: g.entries
            .filter((e) => entryMatches(e.pkg, pkgs))
            .map((e) => ({ ...e })),
        }))
        .filter((g) => g.entries.length > 0),
    }))
    .filter((v) => v.groups.length > 0);

  return { versions };
}
