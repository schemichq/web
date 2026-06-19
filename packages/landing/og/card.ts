// Build-time OG/social card renderer (1200×630), shared by every Schemic app.
//
// Satori turns a flexbox element tree into an SVG (text is vectorized to paths,
// so the rasterizer needs no fonts), then sharp rasterizes the SVG to a PNG.
// Each app's `/og/<key>.png` endpoint calls renderCard(key) at build time; the
// Landing layout points og:image/twitter:image at the matching card.
//
// Themed per driver from the brand tokens (packages/brand/theme-*.css): the hub
// card wears the NEUTRAL gray hub theme, surrealdb purple, postgres blue.
// The headline is two-tone — the database word in the accent gradient, "Zod" in
// accent-2 — mirroring the hero.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const font = (spec: string): Buffer => readFileSync(require.resolve(spec));

// Static (non-variable) faces — satori cannot read variable woff2.
const geist = font("@fontsource/geist-sans/files/geist-sans-latin-600-normal.woff");
const geistRegular = font(
  "@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff",
);
const mono = font(
  "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff",
);
const monoRegular = font(
  "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff",
);

export type CardKey = "hub" | "surrealdb" | "postgres";

interface Theme {
  name: string; // the database word in the headline
  eyebrow: string;
  ddl: string; // "native DDL" / "SurrealQL DDL"
  install: string; // the npm package shown in the install pill
  accent: string;
  accent2: string;
  markDepth: string; // the block-S logo's depth/shadow stroke (dark accent)
  glow?: string; // top radial-glow color (banner only; defaults to accent)
  canvas: string;
  surface: string;
  codeBg: string;
  border: string;
  ink: string;
  ink2: string;
  ink3: string;
}

const THEMES: Record<CardKey, Theme> = {
  hub: {
    name: "database",
    eyebrow: "Schema as code, for any database",
    ddl: "native DDL",
    install: "@schemic/core",
    // Neutral hub theme — gray accent (matches the agnostic hub UI + the
    // theme-tied brand mark), NOT amber.
    accent: "#d8d6da",
    accent2: "#98969a",
    markDepth: "#46454b",
    canvas: "#0c0d10",
    surface: "#181a20",
    codeBg: "#0e0f13",
    border: "#2b2d38",
    ink: "#f5f4f1",
    ink2: "#aea79c",
    ink3: "#74706a",
  },
  surrealdb: {
    name: "SurrealDB",
    eyebrow: "Zod for SurrealDB",
    ddl: "SurrealQL DDL",
    install: "@schemic/surrealdb",
    accent: "#9600ff",
    accent2: "#ff85d6",
    markDepth: "#45007a",
    canvas: "#0e0c14",
    surface: "#16131f",
    codeBg: "#100d18",
    border: "#2a2438",
    ink: "#f5f3fa",
    ink2: "#aaa1bb",
    ink3: "#6f6781",
  },
  postgres: {
    name: "PostgreSQL",
    eyebrow: "Zod for PostgreSQL",
    ddl: "native DDL",
    install: "@schemic/postgres",
    accent: "#4aa3df",
    accent2: "#5ec8e8",
    markDepth: "#1a4a6b",
    canvas: "#0a0e14",
    surface: "#121823",
    codeBg: "#0b0f16",
    border: "#243044",
    ink: "#eef3f8",
    ink2: "#9fb0c4",
    ink3: "#647284",
  },
};

// Minimal hyperscript for satori's element tree (no JSX transform needed).
type El = { type: string; props: Record<string, unknown> };
const h = (
  style: Record<string, unknown>,
  children?: (El | string)[] | string,
): El => ({ type: "div", props: { style, children } });
const txt = (
  content: string,
  style: Record<string, unknown>,
): El => ({ type: "div", props: { style, children: content } });

function tree(t: Theme): El {
  const gradient = `linear-gradient(120deg, ${t.accent}, ${t.accent2})`;

  // The block-S brand mark, themed per card (gradient face over a depth shadow),
  // as a data-URI SVG so satori rasterizes the real logo — matching the site nav.
  const markSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 136" fill="none">` +
    `<defs><linearGradient id="m" x1="0" y1="0" x2="126" y2="136" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/>` +
    `</linearGradient></defs>` +
    `<path d="M96 28l-62 0 0 38 52 0 0 38-62 0" transform="translate(6 8)" fill="none" stroke="${t.markDepth}" stroke-width="24" stroke-linecap="square"/>` +
    `<path d="M96 28l-62 0 0 38 52 0 0 38-62 0" fill="none" stroke="url(#m)" stroke-width="24" stroke-linecap="square"/>` +
    `</svg>`;
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

  const brand = h(
    { display: "flex", alignItems: "center", gap: 16 },
    [
      { type: "img", props: { src: markSrc, width: 54, height: 58 } },
      txt("schemic", {
        fontFamily: "JetBrains Mono",
        fontSize: 30,
        fontWeight: 600,
        color: t.ink,
      }),
    ],
  );

  const top = h(
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    [
      brand,
      txt("MIT · TypeScript-first", {
        fontFamily: "JetBrains Mono",
        fontSize: 18,
        color: t.ink3,
      }),
    ],
  );

  const eyebrow = h(
    {
      display: "flex",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 10,
      padding: "9px 18px",
      borderRadius: 999,
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`,
    },
    [
      h({ width: 8, height: 8, borderRadius: 999, backgroundColor: t.accent2 }),
      txt(t.eyebrow, {
        fontFamily: "JetBrains Mono",
        fontSize: 16,
        color: t.ink2,
      }),
    ],
  );

  const hStyle = {
    fontFamily: "Geist",
    fontSize: 76,
    fontWeight: 600,
    letterSpacing: -2.5,
    lineHeight: 1.05,
    // Preserve the leading/trailing spaces between inline segments — satori
    // otherwise trims whitespace at flex-child boundaries (gluing the words).
    whiteSpace: "pre",
  };
  const gradientWord = {
    ...hStyle,
    backgroundImage: gradient,
    backgroundClip: "text",
    color: "transparent",
  };

  const line1 = h({ display: "flex" }, [
    txt("Your ", { ...hStyle, color: t.ink }),
    txt(t.name, gradientWord),
    txt(" schema,", { ...hStyle, color: t.ink }),
  ]);
  const line2 = h({ display: "flex" }, [
    txt("in the ", { ...hStyle, color: t.ink }),
    txt("Zod", { ...hStyle, color: t.accent2 }),
    txt(" you already know.", { ...hStyle, color: t.ink }),
  ]);
  const headline = h(
    { display: "flex", flexDirection: "column", gap: 2 },
    [line1, line2],
  );

  const sub = txt(
    `Generate the ${t.ddl}, run migrations, keep your types — from the schema you already wrote.`,
    {
      fontFamily: "Geist",
      fontSize: 24,
      fontWeight: 400,
      color: t.ink2,
      maxWidth: 940,
      lineHeight: 1.5,
    },
  );

  const mid = h(
    { display: "flex", flexDirection: "column", gap: 26 },
    [eyebrow, headline, sub],
  );

  const install = h(
    {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 20px",
      borderRadius: 12,
      backgroundColor: t.codeBg,
      border: `1px solid ${t.border}`,
    },
    [
      txt("$", {
        fontFamily: "JetBrains Mono",
        fontSize: 18,
        color: t.accent2,
      }),
      txt(`npm i ${t.install}`, {
        fontFamily: "JetBrains Mono",
        fontSize: 18,
        color: t.ink,
      }),
    ],
  );

  const bottom = h(
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    [
      install,
      txt("github.com/schemichq/schemic", {
        fontFamily: "JetBrains Mono",
        fontSize: 16,
        color: t.ink3,
      }),
    ],
  );

  return h(
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: 1200,
      height: 630,
      padding: 72,
      backgroundColor: t.canvas,
      backgroundImage: `radial-gradient(110% 80% at 50% -10%, ${t.glow ?? t.accent}33, ${t.canvas} 62%)`,
      fontFamily: "Geist",
    },
    [top, mid, bottom],
  );
}

// NEUTRAL GRAY Schemic brand — used by the GitHub README banner (a distinct
// deliverable from the per-driver OG cards). The README represents the agnostic
// core, so it wears the neutral gray identity (matching the hub), NOT amber and
// not a driver hue. `dark` = on graphite; `light` = on warm off-white.
const BANNER_THEME: Theme = {
  name: "database",
  eyebrow: "",
  ddl: "native DDL",
  install: "@schemic/core",
  accent: "#d8d6da",
  accent2: "#98969a",
  markDepth: "#46454b",
  glow: "#d8d6da",
  canvas: "#0c0d10",
  surface: "#181a20",
  codeBg: "#0e0f13",
  border: "#2b2d38",
  ink: "#f5f4f1",
  ink2: "#aea79c",
  ink3: "#74706a",
};

// Light-background variant of the gray banner (for a README <picture> light/dark
// swap). Neutral grays on warm off-white; the mark + gradient word go DARK so
// they read on the light canvas, and the top glow is a faint white highlight.
const BANNER_THEME_LIGHT: Theme = {
  name: "database",
  eyebrow: "",
  ddl: "native DDL",
  install: "@schemic/core",
  accent: "#5a5860",
  accent2: "#2c2b30",
  markDepth: "#a9a7af",
  glow: "#ffffff",
  canvas: "#f7f6f3",
  surface: "#ffffff",
  codeBg: "#efeeea",
  border: "#dcdad4",
  ink: "#17181c",
  ink2: "#5c5a54",
  ink3: "#8a857c",
};

// The README banner tree: same brand lockup + install/repo row as the cards, but
// a single hero line ("Schema-as-code for any database", "any database" in the
// amber gradient) + a one-line subline, instead of the cards' two-tone headline.
function bannerTree(t: Theme): El {
  const gradient = `linear-gradient(120deg, ${t.accent}, ${t.accent2})`;

  const markSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 136" fill="none">` +
    `<defs><linearGradient id="m" x1="0" y1="0" x2="126" y2="136" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent2}"/>` +
    `</linearGradient></defs>` +
    `<path d="M96 28l-62 0 0 38 52 0 0 38-62 0" transform="translate(6 8)" fill="none" stroke="${t.markDepth}" stroke-width="24" stroke-linecap="square"/>` +
    `<path d="M96 28l-62 0 0 38 52 0 0 38-62 0" fill="none" stroke="url(#m)" stroke-width="24" stroke-linecap="square"/>` +
    `</svg>`;
  const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

  const brand = h({ display: "flex", alignItems: "center", gap: 16 }, [
    { type: "img", props: { src: markSrc, width: 54, height: 58 } },
    txt("schemic", {
      fontFamily: "JetBrains Mono",
      fontSize: 30,
      fontWeight: 600,
      color: t.ink,
    }),
  ]);
  const top = h(
    { display: "flex", alignItems: "center", justifyContent: "space-between" },
    [
      brand,
      txt("MIT · TypeScript-first", {
        fontFamily: "JetBrains Mono",
        fontSize: 18,
        color: t.ink3,
      }),
    ],
  );

  const hStyle = {
    fontFamily: "Geist",
    fontSize: 62,
    fontWeight: 600,
    letterSpacing: -2,
    lineHeight: 1.1,
    whiteSpace: "pre",
  };
  const primary = h({ display: "flex" }, [
    txt("Schema-as-code for ", { ...hStyle, color: t.ink }),
    txt("any database", {
      ...hStyle,
      backgroundImage: gradient,
      backgroundClip: "text",
      color: "transparent",
    }),
  ]);
  const sub = txt("In the Zod you already know — native DDL + migrations.", {
    fontFamily: "Geist",
    fontSize: 28,
    fontWeight: 400,
    color: t.ink2,
    lineHeight: 1.4,
  });
  const mid = h({ display: "flex", flexDirection: "column", gap: 22 }, [
    primary,
    sub,
  ]);

  const install = h(
    {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 20px",
      borderRadius: 12,
      backgroundColor: t.codeBg,
      border: `1px solid ${t.border}`,
    },
    [
      txt("$", { fontFamily: "JetBrains Mono", fontSize: 18, color: t.accent2 }),
      txt(`npm i ${t.install}`, {
        fontFamily: "JetBrains Mono",
        fontSize: 18,
        color: t.ink,
      }),
    ],
  );
  const bottom = h(
    { display: "flex", alignItems: "center", justifyContent: "space-between" },
    [
      install,
      txt("github.com/schemichq/schemic", {
        fontFamily: "JetBrains Mono",
        fontSize: 16,
        color: t.ink3,
      }),
    ],
  );

  return h(
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: 1200,
      height: 630,
      padding: 72,
      backgroundColor: t.canvas,
      backgroundImage: `radial-gradient(110% 80% at 50% -10%, ${t.glow ?? t.accent}33, ${t.canvas} 62%)`,
      fontFamily: "Geist",
    },
    [top, mid, bottom],
  );
}

const FONTS = [
  { name: "Geist", data: geist, weight: 600 as const, style: "normal" as const },
  {
    name: "Geist",
    data: geistRegular,
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "JetBrains Mono",
    data: mono,
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "JetBrains Mono",
    data: monoRegular,
    weight: 400 as const,
    style: "normal" as const,
  },
];

/** Render the OG card for a driver key to PNG bytes (1200×630). */
export async function renderCard(key: CardKey): Promise<Buffer> {
  const theme = THEMES[key] ?? THEMES.hub;
  const svg = await satori(tree(theme) as never, {
    width: 1200,
    height: 630,
    fonts: FONTS,
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export const CARD_KEYS: CardKey[] = ["hub", "surrealdb", "postgres"];

export type BannerVariant = "dark" | "light";
const BANNER_THEMES: Record<BannerVariant, Theme> = {
  dark: BANNER_THEME,
  light: BANNER_THEME_LIGHT,
};

/** The GitHub README banner as a satori SVG string (1200×630, neutral gray). */
export async function renderBannerSvg(
  variant: BannerVariant = "dark",
): Promise<string> {
  return satori(bannerTree(BANNER_THEMES[variant]) as never, {
    width: 1200,
    height: 630,
    fonts: FONTS,
  });
}

/** The GitHub README banner rasterized to PNG bytes (1200×630). */
export async function renderBanner(
  variant: BannerVariant = "dark",
): Promise<Buffer> {
  const svg = await renderBannerSvg(variant);
  return sharp(Buffer.from(svg)).png().toBuffer();
}
