// Shared database-picker behavior — used by EVERY picker on the page (the hero
// headline picker + the sticky nav picker). The markup lives in DbMenu.astro
// (the roster) and each picker's own trigger; this module wires them all from a
// single `initPickers()` call so the select/theme/switch logic is defined ONCE
// and every picker stays in sync (selecting in one updates the labels in all).
//
// SINGLE-ORIGIN, NO RELOAD: the landing serves `/` (agnostic), `/surrealdb` and
// `/postgres` from one app, with EVERY example variant rendered up-front behind
// `[data-driver-pane="<key>"]` (key = a driver slug, or "hub" for agnostic).
// Selecting a driver does NOT navigate to another subdomain — it switches
// CLIENT-SIDE: cross-fade the theme, toggle the visible panes in place, update
// the picker labels + CTAs (the CTAs are themselves panes), and pushState to
// `/<slug>` (or `/`). Back/forward (popstate) re-applies the pane for the path.
//
// A picker root is any `[data-db-picker]` element containing:
//   [data-db-trigger]  the button that opens the roster
//   [data-db-menu]     the roster listbox (role="listbox", hidden by default)
//   [data-db-label]    the text node reflecting the current selection
//   [data-db-dot]      (nav only) the brand-color dot beside the label
// Each `[role="option"]` carries the driver's slug + brand color as data-*.
//
// "Select a database" overlay buttons (`[data-open-picker]`, rendered over every
// blurred output region on the agnostic hub) open the nav picker on click.

import { driverThemes, HUB_PANE, paneKeyForPath } from "./drivers";

const root = document.documentElement;
const TRANSITION_MS = 600;

// Honour prefers-reduced-motion live (a mid-session OS toggle is respected):
// skip the cross-fade entirely and switch instantly.
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cross-fade the themeable :root color tokens toward `vars`. The 6 color tokens
// are registered as typed <color> @property (see landing.css), so assigning them
// animates every dependent var() — body canvas, accents, gradients, ink — at
// once. `--color-on-accent` is not a registered @property, so it flips instantly
// (which keeps accent CTA text legible across the neutral<->driver switch).
const applyTheme = (vars: Record<string, string>, animate: boolean): void => {
  if (animate) {
    root.setAttribute("data-theme-shift", "");
    // Flush a style recalc so the transition is armed BEFORE the values change.
    void root.offsetWidth;
  } else {
    root.removeAttribute("data-theme-shift");
  }
  for (const [prop, value] of Object.entries(vars)) {
    if (value) root.style.setProperty(prop, value);
  }
};

// The FULL :root color-token set for a pane key (the complete per-driver theme —
// every --color-* the standalone theme overrides, not just the 6 cross-fade
// vars), falling back to the agnostic hub theme. The six registered @property
// <color> tokens cross-fade; the rest flip instantly (borders/ink-2/code hues/…),
// so the client-side switch is fully themed with no half-dressed look.
const themeVarsFor = (key: string): Record<string, string> =>
  driverThemes[key] ?? driverThemes[HUB_PANE];

// Show only the panes (example variants + driver CTAs) for the active key.
const setPanes = (key: string): void => {
  for (const el of document.querySelectorAll<HTMLElement>("[data-driver-pane]"))
    el.hidden = el.dataset.driverPane !== key;
};

interface RootCtl {
  el: HTMLElement;
  label: HTMLElement | null;
  options: HTMLElement[];
  open: () => void;
  close: (focusTrigger?: boolean) => void;
}

export function initPickers(): void {
  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-db-picker]"),
  );
  if (roots.length === 0) return;

  const ctls: RootCtl[] = [];

  // Find the option element for a pane key (undefined for "hub" — no option).
  const optionFor = (key: string): HTMLElement | undefined => {
    for (const c of ctls) {
      const o = c.options.find((o) => o.dataset.slug === key);
      if (o) return o;
    }
    return undefined;
  };

  // Reflect the active pane across EVERY picker: aria-selected, the label text
  // (driver name, or the picker's own "Database"/"Select database" prompt on the
  // hub) and the nav brand dot.
  const applyLabels = (key: string): void => {
    const opt = optionFor(key);
    for (const c of ctls) {
      for (const o of c.options)
        o.setAttribute("aria-selected", String(o.dataset.slug === key));
      if (c.label) {
        if (opt) {
          c.label.textContent = opt.dataset.driver || c.label.textContent;
          c.label.removeAttribute("data-db-prompt");
          c.el
            .querySelector("[data-db-trigger]")
            ?.removeAttribute("data-db-prompt");
        } else {
          const prompt = c.label.dataset.dbPromptLabel;
          if (prompt) c.label.textContent = prompt;
        }
      }
      const dot = c.el.querySelector<HTMLElement>("[data-db-dot]");
      if (dot) {
        if (opt) {
          dot.style.background = opt.dataset.accent || "";
          dot.hidden = false;
        } else {
          dot.hidden = true;
        }
      }
    }
  };

  // The whole client-side switch: panes + labels + theme cross-fade + history.
  const switchTo = (
    key: string,
    { animate, push }: { animate: boolean; push: boolean },
  ): void => {
    setPanes(key);
    applyLabels(key);
    applyTheme(themeVarsFor(key), animate);
    if (animate)
      window.setTimeout(
        () => root.removeAttribute("data-theme-shift"),
        TRANSITION_MS,
      );
    if (push) {
      const path = key === HUB_PANE ? "/" : `/${key}`;
      history.pushState({ pane: key }, "", path);
    }
  };

  // Selecting a driver option: close the menus, then switch in place (no nav).
  const select = (opt: HTMLElement): void => {
    const slug = opt.dataset.slug || HUB_PANE;
    for (const c of ctls) c.close(false);
    switchTo(slug, { animate: !reduceMotion(), push: true });
  };

  for (const el of roots) {
    const trigger = el.querySelector<HTMLElement>("[data-db-trigger]");
    const menu = el.querySelector<HTMLElement>("[data-db-menu]");
    const label = el.querySelector<HTMLElement>("[data-db-label]");
    if (!trigger || !menu) continue;

    const options = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="option"]'),
    );
    const suggest = menu.querySelector<HTMLAnchorElement>("[data-db-suggest]");
    const items: HTMLElement[] = suggest ? [...options, suggest] : options;
    let open = false;
    let active = Math.max(
      0,
      options.findIndex((o) => o.getAttribute("aria-selected") === "true"),
    );

    const setActive = (i: number): void => {
      active = (i + items.length) % items.length;
      items.forEach((o, idx) => {
        o.setAttribute("tabindex", idx === active ? "0" : "-1");
      });
      items[active].focus();
    };

    const openMenu = (): void => {
      open = true;
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      setActive(active);
    };

    const closeMenu = (focusTrigger = true): void => {
      open = false;
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (focusTrigger) trigger.focus();
    };

    trigger.addEventListener("click", () => (open ? closeMenu() : openMenu()));
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
      }
    });

    menu.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          closeMenu();
          break;
        case "ArrowDown":
          e.preventDefault();
          setActive(active + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActive(active - 1);
          break;
        case "Home":
          e.preventDefault();
          setActive(0);
          break;
        case "End":
          e.preventDefault();
          setActive(items.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (items[active] instanceof HTMLAnchorElement) items[active].click();
          else select(items[active]);
          break;
        case "Tab":
          closeMenu(false);
          break;
      }
    });

    options.forEach((o, i) => {
      o.addEventListener("click", () => select(o));
      o.addEventListener("mousemove", () => {
        if (active !== i) setActive(i);
      });
    });

    if (suggest)
      suggest.addEventListener("mousemove", () => {
        const i = items.indexOf(suggest);
        if (active !== i) setActive(i);
      });

    document.addEventListener("click", (e) => {
      if (
        open &&
        e.target instanceof Node &&
        !menu.contains(e.target) &&
        !trigger.contains(e.target)
      )
        closeMenu(false);
    });

    ctls.push({ el, label, options, open: openMenu, close: closeMenu });
  }

  // "Select a database" overlay CTAs + hub nav links + the hero primary CTA
  // (`[data-open-picker]`) open the NAV picker IN PLACE. The nav is sticky/always
  // pinned to the top of the viewport, so its dropdown appears inline with NO page
  // scroll. (Opening the hero/headline picker would scrollIntoView up to the hero,
  // which reads as a jarring "redirect" from buttons lower on the page.) No
  // scrollIntoView: the sticky nav is already on screen, and scrolling a sticky
  // element jumps to its document-flow position (the very top). Fall back to the
  // first picker if there's no nav one.
  const navCtl = ctls.find((c) => c.el.dataset.dbPicker === "nav") ?? ctls[0];
  if (navCtl)
    for (const btn of document.querySelectorAll<HTMLElement>(
      "[data-open-picker]",
    ))
      btn.addEventListener("click", (e) => {
        // Stop the click bubbling to the document click-outside handler, which
        // would otherwise immediately re-close the menu we just opened.
        e.stopPropagation();
        navCtl.open();
      });

  // Back/forward re-applies the pane for the path (animated unless reduced). The
  // SSR'd first paint already matches the path, so no initial switch is needed —
  // we only seed history.state so popstate has something to read.
  history.replaceState(
    { pane: paneKeyForPath(location.pathname) },
    "",
    location.pathname + location.search,
  );
  window.addEventListener("popstate", () => {
    switchTo(paneKeyForPath(location.pathname), {
      animate: !reduceMotion(),
      push: false,
    });
  });
}
