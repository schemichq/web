// Shared database-picker behavior — used by EVERY picker on the page (the hero
// headline picker + the sticky nav picker). The markup lives in DbMenu.astro
// (the roster) and each picker's own trigger; this module wires them all from a
// single `initPickers()` call so the select/theme/redirect logic is defined ONCE
// and every picker stays in sync (selecting in one updates the labels in all).
//
// A picker root is any `[data-db-picker]` element containing:
//   [data-db-trigger]  the button that opens the roster
//   [data-db-menu]     the roster listbox (role="listbox", hidden by default)
//   [data-db-label]    the text node reflecting the current selection
// Each `[role="option"]` carries the driver's slug + brand color + target theme
// palette as data-* attributes (see DbMenu.astro), so this module reads them
// straight off the DOM and never needs the driver config at runtime.
//
// "Select a database" overlay buttons (`[data-open-picker]`, rendered over every
// blurred output region on the agnostic hub) open the nav picker on click.

const root = document.documentElement;
const TRANSITION_MS = 600;

// Honour prefers-reduced-motion live (a mid-session OS toggle is respected):
// skip the cross-fade entirely (site drivers redirect at once).
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cross-fade the themeable :root color tokens toward `vars`. Registered as typed
// <color> @property (see landing.css), so assigning them animates every
// dependent var() — body canvas, accents, gradients, ink — at once.
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

const themeVars = (opt: HTMLElement): Record<string, string> => ({
  "--color-accent": opt.dataset.themeAccent || "",
  "--color-accent-2": opt.dataset.themeAccent2 || "",
  "--color-canvas": opt.dataset.themeCanvas || "",
  "--color-canvas-2": opt.dataset.themeCanvas2 || "",
  "--color-surface": opt.dataset.themeSurface || "",
  "--color-ink": opt.dataset.themeInk || "",
});

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

  // Reflect a selection across EVERY picker (labels + aria-selected), then run
  // the theme/redirect side-effect once.
  const select = (opt: HTMLElement): void => {
    const slug = opt.dataset.slug || "";
    const name = opt.dataset.driver || "";
    const hasSite = opt.dataset.site === "true";
    const available = opt.dataset.available === "true";
    const href = opt.dataset.href || "";

    for (const c of ctls) {
      for (const o of c.options)
        o.setAttribute("aria-selected", String(o.dataset.slug === slug));
      if (c.label) {
        c.label.textContent = name;
        // Drop the unselected-prompt styling now that a driver is chosen.
        c.label.removeAttribute("data-db-prompt");
        c.el
          .querySelector("[data-db-trigger]")
          ?.removeAttribute("data-db-prompt");
      }
    }

    // Driver WITH its own subdomain -> cross-fade toward its palette, then
    // navigate so the (already in-theme) destination feels continuous.
    if (hasSite && href) {
      for (const c of ctls) c.close(false);
      if (reduceMotion()) {
        window.location.href = href;
        return;
      }
      applyTheme(themeVars(opt), true);
      window.setTimeout(() => {
        window.location.href = href;
      }, TRANSITION_MS);
      return;
    }

    // Driver WITHOUT a site (no page yet) -> stay in-page: animate the accent
    // toward its brand color and broadcast so the Demo surfaces its overlay.
    const animate = !reduceMotion();
    applyTheme(
      {
        "--color-accent": opt.dataset.themeAccent || "",
        "--color-accent-2": opt.dataset.themeAccent2 || "",
      },
      animate,
    );
    if (animate)
      window.setTimeout(
        () => root.removeAttribute("data-theme-shift"),
        TRANSITION_MS,
      );
    document.dispatchEvent(
      new CustomEvent("schemic:driver", {
        detail: { name, available, accent: opt.dataset.accent || "" },
      }),
    );
    for (const c of ctls) c.close();
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

  // "Select a database" overlay CTAs (agnostic hub) -> open the nav picker (it's
  // sticky/always on screen); fall back to the first picker if no nav one.
  const navCtl = ctls.find((c) => c.el.dataset.dbPicker === "nav") ?? ctls[0];
  if (navCtl)
    for (const btn of document.querySelectorAll<HTMLElement>(
      "[data-open-picker]",
    ))
      btn.addEventListener("click", () => {
        navCtl.el.scrollIntoView({ block: "nearest" });
        navCtl.open();
      });
}
