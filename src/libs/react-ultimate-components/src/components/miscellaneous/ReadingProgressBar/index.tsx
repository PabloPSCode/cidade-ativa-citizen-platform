"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

/** Barra de progresso de leitura fixa no topo da página.
 * - Sempre fixa no topo (primeiro elemento visual).
 * - Largura baseada no scroll da janela.
 * - `height` e `color` controlam aparência.
 */
export interface ReadingProgressBarProps {
  /** Altura da barra (ex.: 3, 4, "6px"). Padrão: 4px. */
  height?: number | string;
  /** Cor da barra (CSS válido). Padrão: var(--color-primary-600). */
  color?: string;
}

export default function ReadingProgressBar({
  height = 4,
  color = "var(--color-primary-600)",
} : ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0); // 0..1
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const calc = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const total = (doc.scrollHeight || 0) - (window.innerHeight || 0);
      const pct = total > 0 ? Math.min(1, Math.max(0, scrollTop / total)) : 0;
      setProgress(pct);
    };

    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        calc();
      });
    };

    calc(); // inicial
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const barHeight =
    typeof height === "number" ? `${height}px` : (height ?? "4px");

  return (
    // Container fixo e “clicável” bloqueado (não intercepta ponteiro)
    <div
      aria-hidden
      style={{ height: barHeight }}
      className="fixed inset-x-0 top-0 z-[9999] pointer-events-none"
    >
      <div
        // Usamos scaleX para animação mais suave e performática
        style={{
          height: "100%",
          transform: `scaleX(${progress})`,
          transformOrigin: "0 50%",
          backgroundColor: color,
          transition: "transform 80ms linear",
        }}
      />
    </div>
  );
}

