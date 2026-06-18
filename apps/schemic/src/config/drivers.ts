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
}

export const drivers: Driver[] = [
  {
    slug: "surreal",
    name: "SurrealDB",
    status: "available",
    color: "var(--color-driver-surrealdb)",
    color2: "var(--color-driver-surrealdb-2)",
  },
  {
    slug: "postgres",
    name: "PostgreSQL",
    status: "coming-soon",
    color: "var(--color-driver-postgres)",
  },
  {
    slug: "mysql",
    name: "MySQL",
    status: "coming-soon",
    color: "var(--color-driver-mysql)",
  },
  {
    slug: "sqlite",
    name: "SQLite",
    status: "coming-soon",
    color: "var(--color-driver-sqlite)",
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    status: "coming-soon",
    color: "var(--color-driver-mongodb)",
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
