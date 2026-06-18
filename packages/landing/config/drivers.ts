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
   * Note this is independent of `status`: PostgreSQL ships a themed subdomain
   * (`site: true`) even while its driver is still `coming-soon`.
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
    status: "coming-soon",
    site: true,
    color: "var(--color-driver-postgres)",
    dialect: { lang: "PostgreSQL", file: "user.sql" },
  },
  {
    slug: "mysql",
    name: "MySQL",
    status: "coming-soon",
    site: false,
    color: "var(--color-driver-mysql)",
    dialect: { lang: "MySQL", file: "user.sql" },
  },
  {
    slug: "sqlite",
    name: "SQLite",
    status: "coming-soon",
    site: false,
    color: "var(--color-driver-sqlite)",
    dialect: { lang: "SQLite", file: "user.sql" },
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    status: "coming-soon",
    site: false,
    color: "var(--color-driver-mongodb)",
    dialect: { lang: "MongoDB", file: "user.json" },
  },
];

/**
 * The key themeable color values for each driver (concrete hex — NOT CSS vars —
 * so the picker island can assign them straight to `:root` for a cross-fade).
 * These mirror the per-app build-time theme in @schemic/brand/theme-<slug>.css;
 * `hub` is the agnostic schemic.dev amber theme. Used to animate the page toward
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
  // schemic.dev hub — amber → coral (theme-schemic.css)
  hub: {
    accent: "#ffb454",
    accent2: "#ff6a3d",
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
  // MySQL — teal/navy brand (--color-driver-mysql), sensible dark canvas
  mysql: {
    accent: "#00758f",
    accent2: "#3bb6c9",
    canvas: "#0a0f12",
    canvas2: "#0e151a",
    surface: "#121b21",
    ink: "#eef4f6",
  },
  // SQLite — blue brand (--color-driver-sqlite), sensible dark canvas
  sqlite: {
    accent: "#0f80cc",
    accent2: "#4aa9e6",
    canvas: "#0a0e13",
    canvas2: "#0e141b",
    surface: "#121a22",
    ink: "#eef3f7",
  },
  // MongoDB — green brand (--color-driver-mongodb), sensible dark canvas
  mongodb: {
    accent: "#13aa52",
    accent2: "#4cd07d",
    canvas: "#0a110d",
    canvas2: "#0e1812",
    surface: "#121f17",
    ink: "#eef6f0",
  },
};

/** Theme values for a slug, falling back to the agnostic hub (amber). */
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

/**
 * "Suggest a database" destination — opens a pre-filled driver-request issue on
 * the library repo so community demand is tracked (👍 reactions = signal).
 * Swap this single constant to change where requests land.
 */
export const SUGGEST_DRIVER_URL =
  "https://github.com/schemichq/schemic/issues/new?labels=driver-request&title=" +
  encodeURIComponent("Driver request: ") +
  "&body=" +
  encodeURIComponent(
    "**Which database should Schemic support?**\n\n_e.g. CockroachDB, DuckDB, Cassandra…_\n\n**What would you build with it?** (optional)\n\n",
  );
