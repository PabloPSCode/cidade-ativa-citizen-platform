"use client";

import clsx from "clsx";
import Image from "next/image";

export interface ArticleResumeCardProps {
  /** Categoria exibida no “badge” (pílula). */
  category: string;
  /** Título do artigo. */
  title: string;
  /** URL da imagem (thumb). */
  imageUrl: string;

  /** Classes extras (opcionais). */
  badgeClassName?: string;
  titleClassName?: string;
  containerClassName?: string;
}

/**
 * ArticleResumeCard — cartão resumido de artigo
 * - **Responsivo**: texto à esquerda e thumb à direita; empilha bem em telas pequenas.
 * - **Dark mode**: usa tokens `bg-bg-card`, `text-foreground`, `border-border-card`.
 * - Segue os padrões dos componentes anteriores (clsx + Tailwind tokens).
 */
export default function ArticleResumeCard({
  category,
  title,
  imageUrl,
  badgeClassName,
  titleClassName,
  containerClassName,
}: ArticleResumeCardProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-md rounded-md  bg-transparent",
        "grid grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center",
        "p-3 sm:p-4 text-foreground",
        "hover:bg-foreground/5 transition-colors",
        containerClassName
      )}
    >
      {/* Texto */}
      <div className="min-w-0">
        {/* Badge / Categoria */}
        <span
          className={clsx(
            "inline-flex items-center rounded-full",
            "px-2.5 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wide",
            "bg-foreground text-background",
            badgeClassName
          )}
        >
          {category}
        </span>

        {/* Título */}
        <h3
          className={clsx(
            "mt-4 font-extrabold leading-snug",
            "text-sm sm:text-base md:text-lg",
            "line-clamp-3 sm:line-clamp-2",
            titleClassName
          )}
        >
          {title}
        </h3>
      </div>

      {/* Thumb */}
      <div className="shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          width={96}
          height={96}
          className={clsx(
            "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24",
            "rounded-xl object-cover"
          )}
          loading="lazy"
          sizes="(min-width: 1024px) 96px, (min-width: 640px) 80px, 64px"
        />
      </div>
    </div>
  );
}
