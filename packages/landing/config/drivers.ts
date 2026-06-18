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
    site: true,
    color: "var(--color-driver-surrealdb)",
    color2: "var(--color-driver-surrealdb-2)",
    dialect: { lang: "SurrealQL", file: "user.surql" },
  },
  {
    slug: "postgres",
    name: "PostgreSQL",
    status: "available",
    site: true,
    color: "var(--color-driver-postgres)",
    dialect: { lang: "PostgreSQL", file: "user.sql" },
  },
];

/**
 * The key themeable color values for each driver (concrete hex — NOT CSS vars —
 * so the picker island can assign them straight to `:root` for a cross-fade).
 * These mirror the per-app build-time theme in @schemic/brand/theme-<slug>.css;
 * `hub` is the agnostic schemic.dev NEUTRAL theme. Used to animate the page toward
 * a driver's palette on select (see Hero's island).
 */
export interface DriverTheme {
  accent: string;
  accent2: string;
  canvas: string;
  canvas2: string;
  surface: string;
  ink: string;
}

export const driverThemes: Record<string, DriverTheme> = {
  // schemic.dev hub — NEUTRAL, no flavor: monochrome white → gray accent on the
  // graphite canvas (theme-neutral.css). The picker cross-fade STARTS here and
  // animates toward a driver's color on select (no-flavor → flavored).
  hub: {
    accent: "#d8d6da",
    accent2: "#98969a",
    canvas: "#0c0d10",
    canvas2: "#14151a",
    surface: "#181a20",
    ink: "#f5f4f1",
  },
  // SurrealDB — purple → pink (theme-surrealdb.css)
  surrealdb: {
    accent: "#9600ff",
    accent2: "#ff85d6",
    canvas: "#0e0c14",
    canvas2: "#13101c",
    surface: "#16131f",
    ink: "#f5f3fa",
  },
  // PostgreSQL — blue → cyan on cool slate (theme-postgres.css)
  postgres: {
    accent: "#4aa3df",
    accent2: "#5ec8e8",
    canvas: "#0a0e14",
    canvas2: "#0e131c",
    surface: "#121823",
    ink: "#eef3f8",
  },
};

/** Theme values for a slug, falling back to the agnostic hub (neutral). */
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
      primary: { label: `Start with ${driver.name}`, href: url },
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
