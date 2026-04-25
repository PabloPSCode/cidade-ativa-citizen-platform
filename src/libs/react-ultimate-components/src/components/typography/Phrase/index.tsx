"use client";

import clsx from "clsx";

interface PhraseProps {
  /** Conteúdo do texto*/
  content: string;
  /** Peso da fonte */
  weight?: "thin" | "light" | "regular" | "medium" | "semibold" | "bold";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente de textos curtos. Ideal para exibir frases.
 */
export default function Phrase({
  content,
  weight = "regular",
  className,
}: PhraseProps) {
  return (
    <p
      className={clsx(
        `text-xs sm:text-sm md:text-base text-foreground font-${weight}`,
        className
      )}
    >
      {content}
    </p>
  );
}

