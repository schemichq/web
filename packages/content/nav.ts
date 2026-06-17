/**
 * Docs navigation model — shared TYPES only. The actual nav data (sidebar tree,
 * top nav) and IA helpers are per-driver and live in each app's config; the
 * driver-agnostic docs shell (@schemic/ui) consumes these shapes via props.
 */
export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface TocItem {
  id: string;
  text: string;
}
