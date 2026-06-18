// Build-time OG/social card renderer (1200×630), shared by every Schemic app.
//
// Satori turns a flexbox element tree into an SVG (text is vectorized to paths,
// so the rasterizer needs no fonts), then sharp rasterizes the SVG to a PNG.
// Each app's `/og/<key>.png` endpoint calls renderCard(key) at build time; the
// Landing layout points og:image/twitter:image at the matching card.
//
// Themed per driver from the brand tokens (packages/brand/theme-*.css): the hub
// card wears the amber Schemic master theme, surrealdb purple, postgres blue.
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
  accent: string;
  accent2: string;
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
    accent: "#ffb454",
    accent2: "#ff6a3d",
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
    accent: "#9600ff",
    accent2: "#ff85d6",
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
    accent: "#4aa3df",
    accent2: "#5ec8e8",
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

  const brand = h(
    { display: "flex", alignItems: "center", gap: 16 },
    [
      h(
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundImage: gradient,
        },
        [
          txt("S", {
            fontFamily: "Geist",
            fontSize: 34,
            fontWeight: 600,
            color: "#ffffff",
          }),
        ],
      ),
      txt("Schemic", {
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
      txt("npm i @schemic/core", {
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
      backgroundImage: `radial-gradient(110% 80% at 50% -10%, ${t.accent}33, ${t.canvas} 62%)`,
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
