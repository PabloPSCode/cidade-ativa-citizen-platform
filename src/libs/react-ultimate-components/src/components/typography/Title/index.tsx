"use client";

import clsx from "clsx";
import React from "react";

interface TitleProps {
  /** Conteúdo do texto*/
  content: string;
  /** Elemento HTML a ser utilizado */
  element?: "h1" | "h2" | "h3";
  /** Peso da fonte */
  weight?: "thin" | "light" | "regular" | "medium" | "semibold" | "bold";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente de Título. Ideal para exibir títulos maiores.
 */
export default function Title({
  content,
  weight = "bold",
  element = "h1",
  className,
}: TitleProps) {
  return (
    <>
      {React.createElement(
        element,
        {
          className: clsx(
            `text-xl sm:text-2xl md:text-3xl text-foreground font-${weight}`,
            className
          ),
        },
        content
      )}
    </>
  );
}

