"use client";

import { useEffect } from "react";
import { useStore } from "../providers/StoreProvider";
import { buildThemeVars } from "../../utils/theme";

export default function ThemeTokens() {
  const { storeData } = useStore();
  const primaryColor =
    storeData.design?.primaryColor || "#d56b6b";
  const secondaryColor =
    storeData.design?.secondaryColor || "#f4f4f4";
  const fontFamily = storeData.design?.fontFamily ?? undefined;

  useEffect(() => {
    const vars = buildThemeVars(
      primaryColor,
      secondaryColor,
      fontFamily
    );
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [primaryColor, secondaryColor, fontFamily]);

  return null;
}
