// Shared driver roster for the cross-subdomain database switcher.
//
// Each driver lives on its own subdomain. The hub (schemic.dev) is theme-driven
// and database-agnostic; selecting an AVAILABLE driver navigates to that
// driver's subdomain, while a COMING-SOON driver stays in-page (updates the
// demo's coming-soon overlay).
//
// URLs are derived from the slug at BUILD time:
//   dev  (import.meta.env.DEV) -> https://<slug>.schemic.localhost
//   prod                       -> https://<slug>.schemic.dev
// The hub itself is schemic.localhost / schemic.dev.

export type DriverStatus = "available" | "coming-soon";

export interface Driver {
  slug: string;
  name: string;
  status: DriverStatus;
  /**
   * Release-maturity label surfaced as the picker option's BADGE (e.g. "Beta",
   * "Alpha"). Purely informational — independent of `status`/`site`, which still
   * drive availability + navigation.
   */
  maturity: string;
  /**
   * Whether this driver has its OWN published subdomain/site. Selecting a
   * `site` driver navigates there (with an animated theme transition); a
   * driver without a site has no page yet, so selecting it stays in-page and
   * surfaces the Demo's coming-soon overlay instead of redirecting.
   *
   * Note this is independent of `status`: a driver can ship a themed subdomain
   * (`site: true`) while its driver is still `coming-soon`.
   */
  site: boolean;
  /** Fixed brand color (CSS var into @schemic/brand's --color-driver-*). */
  color: string;
  /** Optional second gradient stop for drivers with a two-tone brand. */
  color2?: string;
  /** Generated-DDL dialect surfaced by the Demo's schema -> DDL panel. */
  dialect: { lang: string; file: string };
}

export const drivers: Driver[] = [
  {
    slug: "surrealdb",
    name: "SurrealDB",
    status: "available",
    maturity: "Beta",
    site: true,
    color: "var(--color-driver-surrealdb)",
    color2: "var(--color-driver-surrealdb-2)",
    dialect: { lang: "SurrealQL", file: "user.surql" },
  },
  {
    slug: "postgres",
    name: "PostgreSQL",
    status: "available",
    maturity: "Alpha",
    site: true,
    color: "var(--color-driver-postgres)",
    dialect: { lang: "PostgreSQL", file: "user.sql" },
  },
];

/**
 * The FULL themeable token set for each pane key — every `--color-*` that the
 * standalone @schemic/brand/theme-<slug>.css overrides, as concrete hex keyed by
 * its CSS custom-property NAME (not a CSS var, so it can be inlined on :root for
 * the per-route SSR theme AND assigned straight to :root by the picker island for
 * the cross-fade). Sourced 1:1 from theme-neutral.css (hub) / theme-surrealdb.css
 * / theme-postgres.css; any token a given theme does NOT override falls back to
 * the @schemic/brand/base.css default so the set is COMPLETE for every key —
 * driver routes match their standalone theme exactly (borders, ink-2/3, surface-2,
 * accent-soft/hot, code-token hues, on-accent, …), and the client-side switch
 * never leaves a stale token from the previous palette.
 *
 * Only six of these (canvas, canvas-2, surface, accent, accent-2, ink) are
 * registered <color> @property vars and CROSS-FADE on switch (see landing.css);
 * every other token flips instantly — which is fine.
 */
export type DriverTheme = Record<string, string>;

export const driverThemes: Record<string, DriverTheme> = {
  // schemic.dev hub — NEUTRAL (theme-neutral.css): monochrome white → gray accent
  // on the warm graphite canvas; DARK on-accent (the accent is light); code tokens
  // stay the colored base.css syntax. The picker cross-fade STARTS here.
  hub: {
    "--color-canvas": "#0c0d10",
    "--color-canvas-2": "#14151a",
    "--color-surface": "#181a20",
    "--color-surface-2": "#20222b",
    "--color-code-bg": "#0e0f13",
    "--color-border": "#2b2d38",
    "--color-border-subtle": "#212430",
    "--color-ink": "#f5f4f1",
    "--color-ink-2": "#aea79c",
    "--color-ink-3": "#74706a",
    "--color-accent": "#d8d6da",
    "--color-accent-2": "#98969a",
    "--color-accent-soft": "#e7e5e9",
    "--color-accent-hot": "#b6b4b8",
    "--color-on-accent": "#141519",
    "--color-code-comment": "#5d6170",
    "--color-code-keyword": "#c9a6ff",
    "--color-code-string": "#9fe3b0",
  },
  // SurrealDB — purple → pink (theme-surrealdb.css). on-accent = base white.
  surrealdb: {
    "--color-canvas": "#0e0c14",
    "--color-canvas-2": "#13101c",
    "--color-surface": "#16131f",
    "--color-surface-2": "#1c1826",
    "--color-code-bg": "#100d18",
    "--color-border": "#2a2438",
    "--color-border-subtle": "#211b2d",
    "--color-ink": "#f5f3fa",
    "--color-ink-2": "#aaa1bb",
    "--color-ink-3": "#6f6781",
    "--color-accent": "#9600ff",
    "--color-accent-2": "#ff85d6",
    "--color-accent-soft": "#c77dff",
    "--color-accent-hot": "#ff00a0",
    "--color-on-accent": "#ffffff",
    "--color-code-comment": "#5d5670",
    "--color-code-keyword": "#c77dff",
    "--color-code-string": "#ff85d6",
  },
  // PostgreSQL — blue → cyan on cool slate (theme-postgres.css). on-accent = white.
  postgres: {
    "--color-canvas": "#0a0e14",
    "--color-canvas-2": "#0e131c",
    "--color-surface": "#121823",
    "--color-surface-2": "#19202d",
    "--color-code-bg": "#0b0f16",
    "--color-border": "#243044",
    "--color-border-subtle": "#1b2433",
    "--color-ink": "#eef3f8",
    "--color-ink-2": "#9fb0c4",
    "--color-ink-3": "#647284",
    "--color-accent": "#4aa3df",
    "--color-accent-2": "#5ec8e8",
    "--color-accent-soft": "#8fcdf0",
    "--color-accent-hot": "#2f7fc9",
    "--color-on-accent": "#ffffff",
    "--color-code-comment": "#566476",
    "--color-code-keyword": "#7cc4f0",
    "--color-code-string": "#8fd6c0",
  },
};

/**
 * The client-side driver SWITCH renders ALL example variants up-front (one per
 * render state) and toggles which is visible — no client-side token re-render.
 * Each variant is wrapped in `[data-driver-pane="<key>"]`; `key` is the driver
 * slug, or "hub" for the agnostic state. The set is the same on every path; the
 * SSR'd page just shows the pane matching its route. See config/picker.ts.
 */
export interface PaneState {
  /** DOM key on `[data-driver-pane]` — a slug, or "hub" for agnostic. */
  key: string;
  /** The driver slug to pull examples/CTAs for, or null for the agnostic hub. */
  slug: string | null;
}

export const HUB_PANE = "hub";

export const paneStates: PaneState[] = [
  { key: HUB_PANE, slug: null },
  ...drivers.map((d) => ({ key: d.slug, slug: d.slug })),
];

/** The visible pane key for a site's active driver (null hub -> "hub"). */
export function paneKeyFor(activeDriver?: string | null): string {
  return activeDriver ?? HUB_PANE;
}

/**
 * The pane key for a URL pathname — the driver slug it represents, else the hub.
 * Section-agnostic: on landing paths the driver is the FIRST segment
 * ("/" -> "hub", "/surrealdb" -> "surrealdb"); on examples paths (first segment
 * "examples") the driver is the SECOND segment ("/examples" -> "hub",
 * "/examples/surrealdb" -> "surrealdb"). Unknown slugs fall back to the hub.
 */
export function paneKeyForPath(pathname: string): string {
  const segs = pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  // On examples paths the driver lives in the second segment; otherwise the first.
  const slug = segs[0] === "examples" ? segs[1] : segs[0];
  return slug && drivers.some((d) => d.slug === slug) ? slug : HUB_PANE;
}

/** Whether a path is in the Examples SECTION (its first segment is "examples"). */
export function isExamplesPath(pathname: string): boolean {
  const segs = pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  return segs[0] === "examples";
}

/**
 * The same-origin path for a pane key, KEEPING the current section. On a landing
 * path it is "/" or "/<key>"; on an examples path it is "/examples" or
 * "/examples/<key>". The client-side picker pushes this so selecting a driver
 * swaps the driver WITHOUT leaving the section (landing<->landing,
 * examples<->examples). On landing paths it is identical to the previous
 * "/"|"/<key>" behavior, so the landing switch is unchanged.
 */
export function pathForPane(key: string, pathname: string): string {
  const base = key === HUB_PANE ? "" : `/${key}`;
  if (isExamplesPath(pathname)) return base ? `/examples${base}` : "/examples";
  return base || "/";
}

/** The full token set for a slug, falling back to the agnostic hub (neutral). */
export function driverTheme(slug: string | null | undefined): DriverTheme {
  return (slug && driverThemes[slug]) || driverThemes.hub;
}

/** The host suffix for the active environment (no scheme). */
const HOST = import.meta.env.DEV ? "schemic.localhost" : "schemic.dev";

/** Resolve a driver subdomain URL from its slug. */
export function driverUrl(slug: string): string {
  return `https://${slug}.${HOST}`;
}

/** The hub's own URL (schemic.localhost in dev, schemic.dev in prod). */
export const hubUrl = `https://${HOST}`;

export const isAvailable = (d: Driver): boolean => d.status === "available";

/** The flagship available driver (the default the hub points its CTAs at). */
export const flagshipDriver: Driver = drivers.find(isAvailable) ?? drivers[0];

/** Look up a driver by slug; null when not found (e.g. the agnostic hub). */
export function findDriver(slug: string | null | undefined): Driver | null {
  if (!slug) return null;
  return drivers.find((d) => d.slug === slug) ?? null;
}

/** The Schemic library repository (used by driver-agnostic CTAs). */
export const REPO_URL = "https://github.com/schemichq/schemic";

export interface CTALink {
  label: string;
  href: string;
  /**
   * When true this CTA is a database-picker trigger, not a navigation link:
   * the marketing surfaces render it as a `<button data-open-picker>` (which
   * config/picker.ts wires to open the picker) instead of an `<a href>`. Used
   * for the agnostic hub's primary CTA ("Choose your database").
   */
  openPicker?: boolean;
}

/**
 * The driver-aware landing CTAs for a given site. Everything the marketing
 * surfaces (Hero primary, FinalCTA primary/secondary, Demo coming-soon overlay)
 * should derive from here so copy + destinations stay centralized and honest.
 */
export interface DriverCTA {
  /** The driver these CTAs are about — the active site driver, or the flagship on the hub. */
  driver: Driver;
  /** Primary action. */
  primary: CTALink;
  /** Secondary "Read the docs" action. */
  secondary: CTALink;
  /** Demo coming-soon overlay copy + action (only surfaced for coming-soon drivers). */
  overlay: { text: string; action: CTALink };
}

/**
 * Resolve the landing CTAs for a site from its `activeDriver` slug (null on the
 * hub -> the flagship). AVAILABLE drivers get "Start with <name>" pointing at
 * their own subdomain + their own docs. COMING-SOON drivers get honest,
 * driver-centric CTAs pointing at THEIR subdomain / the repo and the core
 * (flagship) docs — they never push the flagship driver.
 */
export function ctaFor(activeDriver?: string | null): DriverCTA {
  const driver = findDriver(activeDriver) ?? flagshipDriver;
  const url = driverUrl(driver.slug);
  const docs = `${url}/docs/introduction`;

  // Hub (no active driver): the page is database-agnostic, so the primary CTA
  // invites a choice — it OPENS the picker rather than pushing the flagship
  // driver. Secondary ("Read the docs") + overlay stay as-is (flagship-backed).
  if (activeDriver == null) {
    return {
      driver,
      primary: { label: "Choose your database", href: "", openPicker: true },
      secondary: { label: "Read the docs", href: docs },
      overlay: {
        text: `This driver is coming soon — start with ${driver.name} today.`,
        action: { label: `Start with ${driver.name}`, href: url },
      },
    };
  }

  if (isAvailable(driver)) {
    return {
      driver,
      // "Start with <driver>" + "Read the docs" both lead into that driver's
      // docs subdomain (…/docs/introduction) — the single-origin landing keeps
      // the marketing pages, docs live on the per-driver subdomain.
      primary: { label: `Start with ${driver.name}`, href: docs },
      secondary: { label: "Read the docs", href: docs },
      overlay: {
        text: `This driver is coming soon — start with ${driver.name} today.`,
        action: { label: `Start with ${driver.name}`, href: url },
      },
    };
  }

  // Coming-soon: about THIS driver, honest about being unshipped, and never
  // redirecting to the flagship. Docs fall back to the core (flagship) docs
  // since the driver has none of its own yet.
  const coreDocs = `${driverUrl(flagshipDriver.slug)}/docs/introduction`;
  return {
    driver,
    primary: { label: `${driver.name} — coming soon`, href: url },
    secondary: { label: "Read the docs", href: coreDocs },
    overlay: {
      text: `The ${driver.name} driver is coming soon — follow progress on GitHub.`,
      action: { label: "Follow progress", href: REPO_URL },
    },
  };
}

/**
 * "Vote or request a database" destination — the GitHub Discussions
 * driver-requests category, so demand is deduplicated: people upvote an existing
 * thread instead of filing duplicate issues. Swap this single constant to change
 * where requests land.
 */
export const SUGGEST_DRIVER_URL =
  "https://github.com/schemichq/schemic/discussions/categories/driver-requests";
