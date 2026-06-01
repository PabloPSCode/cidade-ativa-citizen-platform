"use client";

import { useEffect } from "react";

const TESLA_THEME_VARS: Record<string, string> = {
  "--color-primary-50": "#eef3ff",
  "--color-primary-100": "#dce7ff",
  "--color-primary-200": "#b9ceff",
  "--color-primary-300": "#8daeff",
  "--color-primary-400": "#6389ef",
  "--color-primary-500": "#3e6ae1",
  "--color-primary-600": "#3457b2",
  "--color-primary-700": "#294689",
  "--color-primary-800": "#203568",
  "--color-primary-900": "#17264a",
  "--color-primary-950": "#10192f",
  "--color-secondary-50": "#ffffff",
  "--color-secondary-100": "#f8f8f8",
  "--color-secondary-200": "#f4f4f4",
  "--color-secondary-300": "#eeeeee",
  "--color-secondary-400": "#d0d1d2",
  "--color-secondary-500": "#8e8e8e",
  "--color-secondary-600": "#5c5e62",
  "--color-secondary-700": "#393c41",
  "--color-secondary-800": "#24272c",
  "--color-secondary-900": "#171a20",
  "--color-secondary-950": "#0b0d10",
};

export default function ThemeTokens() {
  useEffect(() => {
    Object.entries(TESLA_THEME_VARS).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  return null;
}
