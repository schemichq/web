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
    color: "var(--color-driver-surrealdb)",
    color2: "var(--color-driver-surrealdb-2)",
    dialect: { lang: "SurrealQL", file: "user.surql" },
  },
  {
    slug: "postgres",
    name: "PostgreSQL",
    status: "coming-soon",
    color: "var(--color-driver-postgres)",
    dialect: { lang: "PostgreSQL", file: "user.sql" },
  },
  {
    slug: "mysql",
    name: "MySQL",
    status: "coming-soon",
    color: "var(--color-driver-mysql)",
    dialect: { lang: "MySQL", file: "user.sql" },
  },
  {
    slug: "sqlite",
    name: "SQLite",
    status: "coming-soon",
    color: "var(--color-driver-sqlite)",
    dialect: { lang: "SQLite", file: "user.sql" },
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    status: "coming-soon",
    color: "var(--color-driver-mongodb)",
    dialect: { lang: "MongoDB", file: "user.json" },
  },
];

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
