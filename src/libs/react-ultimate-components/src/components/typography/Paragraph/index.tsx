"use client";

import clsx from "clsx";

interface ParagraphProps {
  /** Conteúdo do texto*/
  content: string;
  /** Peso da fonte */
  weight?: "thin" | "light" | "regular" | "medium" | "semibold" | "bold";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente de textos longos. Ideal para exibir parágrafos.
 */
export default function Paragraph({
  content,
  weight = "regular",
  className,
}: ParagraphProps) {
  return (
    <p
      className={clsx(
        `text-xs sm:text-sm md:text-base text-foreground leading-relaxed font-${weight}`,
        className
      )}
    >
      {content}
    </p>
  );
}

