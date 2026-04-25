type Scale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type ColorScale = Record<Scale, string>;

const LIGHT_STOPS: Record<Scale, number> = {
  50: 0.86,
  100: 0.74,
  200: 0.58,
  300: 0.42,
  400: 0.22,
  500: 0,
  600: 0,
  700: 0,
  800: 0,
  900: 0,
};

const DARK_STOPS: Record<Scale, number> = {
  50: 0,
  100: 0,
  200: 0,
  300: 0,
  400: 0,
  500: 0,
  600: 0.12,
  700: 0.24,
  800: 0.38,
  900: 0.52,
};

const clamp = (value: number) => Math.max(0, Math.min(255, value));

const hexToRgb = (hex: string) => {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => clamp(value).toString(16).padStart(2, "0"))
    .join("")}`;

const mix = (
  base: { r: number; g: number; b: number },
  target: number,
  amount: number
) => ({
  r: Math.round(base.r + (target - base.r) * amount),
  g: Math.round(base.g + (target - base.g) * amount),
  b: Math.round(base.b + (target - base.b) * amount),
});

export const buildScale = (baseHex: string): ColorScale => {
  const normalized = baseHex.startsWith("#") ? baseHex : `#${baseHex}`;
  const base = hexToRgb(normalized);
  const result = {} as ColorScale;
  const steps: Scale[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  steps.forEach((step) => {
    if (step === 500) {
      result[step] = rgbToHex(base.r, base.g, base.b);
      return;
    }
    const amount = step < 500 ? LIGHT_STOPS[step] : DARK_STOPS[step];
    const target = step < 500 ? 255 : 0;
    const mixed = mix(base, target, amount);
    result[step] = rgbToHex(mixed.r, mixed.g, mixed.b);
  });

  return result;
};

const FONT_VAR_BY_NAME: Record<string, string> = {
  poppins: "--font-poppins",
  raleway: "--font-raleway",
  ubuntu: "--font-ubuntu",
  roboto: "--font-roboto",
  inter: "--font-inter",
  "work sans": "--font-work-sans",
  "work_sans": "--font-work-sans",
  montserrat: "--font-montserrat",
};

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
]);

const resolveFontStack = (fontFamily?: string) => {
  if (!fontFamily) return undefined;
  const trimmed = fontFamily.trim();
  if (!trimmed) return undefined;

  const tokens = trimmed
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((raw) => {
      if (raw.startsWith("var(")) {
        return { raw, normalized: raw, mapped: raw };
      }
      const normalized = raw.replace(/^['"]|['"]$/g, "").trim().toLowerCase();
      const varName = FONT_VAR_BY_NAME[normalized];
      return {
        raw,
        normalized,
        mapped: varName ? `var(${varName})` : raw,
      };
    });

  if (tokens.length === 0) return undefined;

  const parts = tokens.map((token) => token.mapped);
  const hasMontserrat = parts.some((part) => part.includes("--font-montserrat"));

  if (!hasMontserrat) {
    const genericIndex = tokens.findIndex((token) =>
      GENERIC_FAMILIES.has(token.normalized)
    );
    if (genericIndex === -1) {
      parts.push("var(--font-montserrat)");
    } else {
      parts.splice(genericIndex, 0, "var(--font-montserrat)");
    }
  }

  return parts.join(", ");
};

export const buildThemeVars = (
  primaryHex: string,
  secondaryHex: string,
  fontFamily?: string
) => {
  const primary = buildScale(primaryHex);
  const secondary = buildScale(secondaryHex);

  const vars: Record<string, string> = {
    "--color-primary-50": primary[50],
    "--color-primary-100": primary[100],
    "--color-primary-200": primary[200],
    "--color-primary-300": primary[300],
    "--color-primary-400": primary[400],
    "--color-primary-500": primary[500],
    "--color-primary-600": primary[600],
    "--color-primary-700": primary[700],
    "--color-primary-800": primary[800],
    "--color-primary-900": primary[900],
    "--color-secondary-50": secondary[50],
    "--color-secondary-100": secondary[100],
    "--color-secondary-200": secondary[200],
    "--color-secondary-300": secondary[300],
    "--color-secondary-400": secondary[400],
    "--color-secondary-500": secondary[500],
    "--color-secondary-600": secondary[600],
    "--color-secondary-700": secondary[700],
    "--color-secondary-800": secondary[800],
    "--color-secondary-900": secondary[900],
  };

  const fontStack = resolveFontStack(fontFamily);
  if (fontStack) {
    vars["--font-primary"] = fontStack;
    vars["--font-secondary"] = fontStack;
  }

  return vars;
};
