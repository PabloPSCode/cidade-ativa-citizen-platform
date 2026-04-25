"use client";

import { type JSX } from "react";
import clsx from "clsx";

export type Direction = "r" | "l" | "t" | "b" | "tr" | "tl" | "br" | "bl";

export interface GradientTextProps {
  /** Elemento HTML que irá envolver o texto (ex.: h1, h2, p, span). */
  as?: keyof JSX.IntrinsicElements;
  /**
   * Cor inicial do gradiente (classe Tailwind).
   * Ex.: "from-emerald-500", "from-[#22c55e]"
   */
  from: string;
  /**
   * Cor final do gradiente (classe Tailwind).
   * Ex.: "to-cyan-500", "to-[#06b6d4]"
   */
  to: string;
  /**
   * Direção do gradiente:
   * r=→  l=←  t=↑  b=↓  tr=↗ tl=↖ br=↘ bl=↙
   */
  direction?: Direction;
  /** Conteúdo do texto. */
  content: string;
  /** Classes adicionais para estilização (tamanhos responsivos, tracking, etc.). */
  className?: string;
}

/**
 * Texto com gradiente usando utilitários do Tailwind.
 * - Sem dependências externas (compatível com React 18/19+).
 * - Ideal para destaques de marketing no mercado brasileiro (títulos de landing, CTAs, etc.).
 * - Combine com classes Tailwind para tamanhos responsivos: `text-4xl md:text-6xl`.
 */
export default function GradientText({
  as: Tag = "h1",
  from,
  to,
  direction = "r",
  content,
  className,
}: GradientTextProps) {
  // Mapeia direção para a classe Tailwind `bg-gradient-to-*`
  const dirClass = {
    r: "bg-gradient-to-r",
    l: "bg-gradient-to-l",
    t: "bg-gradient-to-t",
    b: "bg-gradient-to-b",
    tr: "bg-gradient-to-tr",
    tl: "bg-gradient-to-tl",
    br: "bg-gradient-to-br",
    bl: "bg-gradient-to-bl",
  }[direction];

  return (
    <Tag
      className={clsx(
        // gradiente aplicado ao fundo do texto
        dirClass,
        from,
        to,
        // faz o texto “pegar” o bg
        "bg-clip-text text-transparent inline- leading-tight",
        // tipicamente títulos usam peso maior; deixe flexível via className
        className
      )}
    >
      {content}
    </Tag>
  );
}
