"use client";

import clsx from "clsx";

interface SectionProps {
  /** Tamanho da largura da seção */
  size: "full" | "middle";
  /** Título da seção */
  title?: string;
  /** Subtítulo da seção */
  subtitle?: string;
  /** URL da imagem de fundo */
  backgroundImageLocalPath?: string;
  /** Classes adicionais para customização da seção */
  sectionClassName?: string;
  /** Classes adicionais para customização do título */
  titleClassName?: string;
  /** Classes adicionais para customização do subtítulo */
  subtitleClassName?: string;
  children?: React.ReactNode;
}

export default function Section({
  size,
  title,
  subtitle,
  backgroundImageLocalPath,
  sectionClassName,
  titleClassName,
  subtitleClassName,
  children,
}: SectionProps) {
  return (
    <section
      className={clsx(
        size === "full" ? "w-full" : "w-full max-w-7xl mx-auto",
        "flex flex-col items-center px-8 py-12",
        "bg-cover bg-center",
        sectionClassName
      )}
      style={
        backgroundImageLocalPath
          ? { backgroundImage: `url(${backgroundImageLocalPath})` }
          : undefined
      }
    >
      {title && (
        <h1
          className={clsx(
            "text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-2",

            titleClassName
          )}
        >
          {title}
        </h1>
      )}
      {subtitle && (
        <h2
          className={clsx(
            "text-base sm:text-lg  text-foreground/60 font-regular font-secondary text-center",
            subtitleClassName
          )}
        >
          {subtitle}
        </h2>
      )}
      {children}
    </section>
  );
}

