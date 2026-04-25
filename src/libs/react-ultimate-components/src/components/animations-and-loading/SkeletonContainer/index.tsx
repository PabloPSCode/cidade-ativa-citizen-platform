"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// SkeletonContainer.tsx
import useTheme from "../../../hooks/useTheme";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SkeletonProps } from "react-loading-skeleton";
import Skeleton from "react-loading-skeleton";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface SkeletonContainerProps
  extends Omit<SkeletonProps, "children"> {
  /** Conteúdo real a ser exibido. */
  children: React.ReactNode;
  /** Exibe skeleton (true) ou o conteúdo real (false). */
  isLoading?: boolean;
  /** Forma do skeleton. */
  shape?: "block" | "text";
  /** Quantidade de linhas (apenas para `shape="text"`). */
  lines?: number;
  /** Arredondamento em px (ignorado se `circle`). */
  radius?: number;
  /** Largura do skeleton (se não usar ajuste automático). */
  width?: number | string;
  /** Altura do skeleton (se não usar ajuste automático). */
  height?: number | string;
  /** Sobrepõe o skeleton sobre o conteúdo (true) ou substitui (false). */
  overlay?: boolean;
  /** Faz o skeleton ajustar ao tamanho do filho automaticamente. */
  matchChildSize?: boolean;
  /** Classe e estilo do contêiner externo. */
  className?: string;
  style?: React.CSSProperties;
}

/** Usado para exibir um skeleton enquanto o conteúdo real é carregado. */

export default function SkeletonContainer({
  children,
  isLoading = true,
  shape = "block",
  lines = 1,
  width,
  height,
  overlay = true, // ⬅️ padrão: sobrepor (fica “com cara de skeleton”)
  matchChildSize = true, // ⬅️ padrão: casar tamanho com o filho
  className,
  style,
  duration = 1.2,
  enableAnimation = true,
  ...rest
}: SkeletonContainerProps) {
  const { theme } = useTheme();
  const baseColor = theme === "dark" ? "#616362" : "#BFC4C3";
  const highlightColor = theme === "dark" ? "#7E807E" : "#DFE3E0";

  // Medidas do filho para casar o skeleton
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });

  useIsoLayoutEffect(() => {
    if (!matchChildSize || !wrapperRef.current) return;

    const el = wrapperRef.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      // Usa padding/border do contêiner; o skeleton ficará por cima
      setMeasured({ w: Math.max(0, r.width), h: Math.max(0, r.height) });
    };

    update();

    // ResizeObserver para reatividade
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } else {
      // Fallback simples
      window.addEventListener("resize", update);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, [matchChildSize]);

  const computedWidth = matchChildSize && measured.w ? measured.w : width;
  const computedHeight =
    shape === "text"
      ? undefined
      : matchChildSize && measured.h
      ? measured.h
      : height;

  const skeletonEl = (
    <Skeleton
      {...rest}
      baseColor={baseColor}
      highlightColor={highlightColor}
      duration={duration}
      enableAnimation={enableAnimation}
      count={shape === "text" ? lines : 1}
      width={computedWidth ?? (overlay ? "100%" : undefined)}
      height={
        shape === "text"
          ? undefined
          : computedHeight
          ? Number(computedHeight) + 4
          : "100%"
      }
      style={
        shape === "text" ? { lineHeight: 1.5, marginBottom: 4 } : undefined
      }
    />
  );

  // Sobreposição: deixa o filho renderizado e cobre com skeleton
  if (overlay) {
    return (
      <div
        ref={wrapperRef}
        className={`relative ${className ?? ""} p-2`}
        style={style}
        aria-busy={isLoading}
        role={isLoading ? "status" : undefined}
      >
        {children}
        {isLoading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Véu opcional — comente para não escurecer */}
            <div className="absolute inset-0 bg-background/30 p-4" />
            <div className="relative w-full h-full flex items-center justify-center">
              {skeletonEl}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Substituição: troca conteúdo por skeleton
  return (
    <div
      ref={wrapperRef}
      className={className}
      style={style}
      aria-busy={isLoading}
      role={isLoading ? "status" : undefined}
    >
      {isLoading ? skeletonEl : children}
    </div>
  );
}

