/**
 * Docs navigation model for postgres.schemic.dev (IA owned here; content
 * authored as MDX by the writer). Drives the top nav, the left sidebar tree,
 * breadcrumb, prev/next and active state. Slugs map 1:1 to
 * src/content/docs/<slug>.mdx and render at /docs/<slug>.
 */
import type { NavGroup, NavItem, TocItem } from "@schemic/content/nav";
export type { NavGroup, NavItem, TocItem };

const d = (slug: string): string => `/docs/${slug}`;

export const sidebarNav: NavGroup[] = [
  {
    label: "Start here",
    items: [
      { label: "Introduction", href: d("introduction") },
      { label: "Quickstart", href: d("quickstart") },
    ],
  },
  {
    label: "Concepts",
    items: [
      { label: "Encoded and decoded sides", href: d("concepts/app-and-wire") },
      { label: "From schema to DDL", href: d("concepts/schema-to-ddl") },
      { label: "The migration model", href: d("concepts/migrations-model") },
    ],
  },
  {
    label: "Guides",
    items: [
      { label: "Define a table", href: d("guides/define-a-table") },
      {
        label: "Constraints & defaults",
        href: d("guides/constraints-and-defaults"),
      },
      { label: "Foreign keys", href: d("guides/foreign-keys") },
      { label: "Indexes", href: d("guides/indexes") },
      { label: "Encode & decode rows", href: d("guides/encode-decode-rows") },
      { label: "Generate & run migrations", href: d("guides/migrations") },
    ],
  },
  {
    label: "Reference",
    items: [
      { label: "Type mapping", href: d("reference/type-mapping") },
      { label: "Field methods", href: d("reference/field-methods") },
      { label: "Definers", href: d("reference/definers") },
      { label: "Configuration", href: d("reference/configuration") },
      { label: "CLI commands", href: d("reference/cli") },
    ],
  },
  {
    label: "Resources",
    items: [{ label: "Changelog", href: d("resources/changelog") }],
  },
];

export const topNav: NavItem[] = [
  { label: "Docs", href: d("introduction") },
  { label: "Guides", href: d("guides/define-a-table") },
  { label: "Reference", href: d("reference/type-mapping") },
];

// Flattened, ordered list (sidebar order) for prev/next + lookups.
const flat: { group: string; item: NavItem }[] = sidebarNav.flatMap((g) =>
  g.items.map((item) => ({ group: g.label, item })),
);

/** The top-nav label to highlight for a given page href. */
export function topActiveFor(href: string): string {
  const entry = flat.find((f) => f.item.href === href);
  if (!entry) return "Docs";
  if (entry.group === "Guides") return "Guides";
  if (entry.group === "Reference") return "Reference";
  return "Docs";
}

/** Breadcrumb string "Group  /  Title" for a given page href. */
export function crumbFor(href: string): string {
  const entry = flat.find((f) => f.item.href === href);
  return entry ? `${entry.group}  /  ${entry.item.label}` : "Docs";
}

/** Previous/next pages in sidebar order. */
export function prevNextFor(href: string): { prev?: NavItem; next?: NavItem } {
  const i = flat.findIndex((f) => f.item.href === href);
  if (i === -1) return {};
  return {
    prev: i > 0 ? flat[i - 1].item : undefined,
    next: i < flat.length - 1 ? flat[i + 1].item : undefined,
  };
}
