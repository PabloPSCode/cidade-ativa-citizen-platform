"use client";

import clsx from "clsx";
import Image from "next/image";

/** ===================== Tipagem ===================== */
export interface MainArticleImageProps {
  /** URL da imagem de capa (obrigatória). */
  imgUrl: string;
  /** Título principal do artigo. */
  title: string;
  /** Categoria exibida como pílula sobre a imagem. */
  category: string;
  /** Classes extras para o container externo. */
  className?: string;
  /** Classes extras para o título (h1). */
  titleClassName?: string;
  /** Classes extras para a pílula de categoria. */
  badgeClassName?: string;
}

/**
 * MainArticleImage — herói em imagem com overlay e título grande.
 * - **Responsivo**: proporções fluidas e tipografia escalável.
 * - **Dark-mode**: usa tokens (`bg-bg-card`, `text-foreground`, etc.).
 * - **Acessível**: `aria-label` no wrapper e `alt` na imagem.
 */
export default function MainArticleImage({
  imgUrl,
  title,
  category,
  className,
  titleClassName,
  badgeClassName,
}: MainArticleImageProps) {
  return (
    <section
      aria-label={title}
      className={clsx(
        "relative w-full overflow-hidden rounded-2xl border border-border-card bg-bg-card",
        // proporções do bloco (ajuste conforme layout)
        "aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9]",
        "shadow-sm",
        className
      )}
    >
      {/* Imagem de fundo */}
      <Image
        src={imgUrl}
        alt={title}
        loading="lazy"
        fill
        sizes="100vw"
        className={clsx(
          "absolute inset-0 h-full w-full object-cover",
          "transition-transform duration-500 will-change-transform",
          "hover:scale-[1.02]"
        )}
      />

      {/* Overlay para legibilidade do texto */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0",
          // degrade mais forte na base como no exemplo
          "bg-gradient-to-t from-black/70 via-black/35 to-black/0",
          "dark:from-black/80"
        )}
      />

      {/* Conteúdo */}
      <div className="absolute inset-0 flex">
        <div className="flex w-full items-end">
          <div className="px-5 sm:px-8 md:px-10 pb-5 sm:pb-8 md:pb-10 max-w-6xl">
            {/* Categoria (pílula) */}
            {!!category && (
              <span
                className={clsx(
                  "inline-flex items-center rounded-full",
                  "bg-white/90 text-gray-900",
                  "px-2.5 py-1 text-[11px] sm:text-xs font-semibold",
                  "backdrop-blur-md shadow-sm",
                  badgeClassName
                )}
              >
                {category}
              </span>
            )}

            {/* Título */}
            <h1
              className={clsx(
                "mt-3 sm:mt-4 text-white drop-shadow",
                "font-extrabold tracking-[-0.01em] leading-tight",
                // escala responsiva semelhante ao exemplo
                "text-2xl sm:text-4xl md:text-5xl lg:text-6xl",
                titleClassName
              )}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
