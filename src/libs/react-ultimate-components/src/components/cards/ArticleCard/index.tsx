"use client";

import { formatDateLong } from "../../../utils/format";
import { TagIcon, TimerIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface ArticleCardProps {
  /** URL da imagem a ser exibida. */
  imgUrl: string;
  /** Título do artigo. */
  title: string;
  /** Categoria do artigo. */
  category: string;
  /** Descrição do artigo (opcional). */
  description?: string;
  /** Callback ao clicar em “Leia mais” (opcional). */
  onSeeDetails?: () => void;
  /** Data de publicação do artigo. */
  publishedAt: string;
  /** Tempo estimado de leitura (ex.: "7 min" ou "11:20"). */
  readingTime: string;
  /** Autor do artigo (opcional). */
  author?: string;

  /** Torna o card clicável (envolve o conteúdo com <a>). */
  href?: string;
  /** Abre o link em nova aba quando `href` existir. */
  newTab?: boolean;

  /** Classes para personalização (cada elemento */
  className?: string; // container
  imageClassName?: string; // imagem de capa
  titleClassName?: string; // <h3>
  descriptionClassName?: string; // <p> descrição
  authorClassName?: string; // <p> autor + data
  metaRowClassName?: string; // linha com categoria/tempo
  categoryClassName?: string; // texto de categoria
  readingTimeClassName?: string; // texto de tempo de leitura
  readMoreButtonClassName?: string; // botão/anchor "Leia mais"
}

/**
 * Card de artigo (padrões BR).
 * - Responsivo e com suporte a dark-mode via tokens do design system.
 * - Quando `href` é passado, o card vira um link acessível.
 */
export default function ArticleCard({
  imgUrl,
  category,
  publishedAt,
  readingTime,
  author,
  title,
  description,
  onSeeDetails,
  href,
  newTab,

  className,
  imageClassName,
  titleClassName,
  descriptionClassName,
  authorClassName,
  metaRowClassName,
  categoryClassName,
  readingTimeClassName,
  readMoreButtonClassName,
}: ArticleCardProps) {
  // Wrap como <a> quando houver href (mesma estratégia do ArticleImage)
  const Wrapper: React.ElementType = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={clsx(
        "flex flex-col items-center text-center border border-border-card bg-bg-card",
        "gap-4 shadow-md rounded-lg p-4 max-w-sm mx-auto",
        href &&
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
        className
      )}
      aria-label={title}
    >
      {/* Imagem */}
      <Image
        src={imgUrl}
        alt={title}
        width={800}
        height={400}
        className={clsx(
          "w-full h-48 object-cover rounded-lg mb-4",
          imageClassName
        )}
        sizes="(min-width: 640px) 480px, 100vw"
      />

      {/* Título */}
      <h3
        className={clsx(
          "font-semibold text-md sm:text-lg text-foreground",
          titleClassName
        )}
      >
        {title}
      </h3>

      {/* Descrição */}
      {description && (
        <p
          className={clsx(
            "text-foreground/70 text-xs sm:text-sm line-clamp-2",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}

      {/* Autor + Data */}
      {author && (
        <p
          className={clsx(
            "text-foreground/70 text-xs sm:text-sm",
            authorClassName
          )}
        >
          {author} - {formatDateLong(publishedAt)}
        </p>
      )}

      {/* Meta: categoria + tempo de leitura */}
      <p className={clsx("w-full", metaRowClassName)}>
        <span className="border-t border-foreground/20 text-foreground/60 py-4 text-xs sm:text-sm w-full flex items-center justify-center gap-3">
          <span
            className={clsx("inline-flex items-center gap-1", categoryClassName)}
          >
            <TagIcon className="-mr-1 h-5 w-5 sm:h-5 sm:w-5" />
            {category}
          </span>
          <span
            className={clsx(
              "inline-flex items-center gap-1",
              readingTimeClassName
            )}
          >
            <TimerIcon className="-mr-1 h-5 w-5 sm:h-5 sm:w-5" />
            {readingTime}
          </span>
        </span>
      </p>

      {/* Ação "Leia mais"
          - Se houver href: usamos <a> com newTab consistente.
          - Se não houver href: renderizamos <button> para a ação local.
      */}
      {onSeeDetails &&
        (href ? (
          <a
            href={href}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noopener noreferrer" : undefined}
            onClick={onSeeDetails}
            className={clsx(
              "w-full flex items-center justify-center px-3 py-2 bg-none",
              "text-primary-600 text-sm sm:text-base rounded-lg font-bold hover:underline",
              readMoreButtonClassName
            )}
            aria-label="Ver detalhes do artigo"
          >
            Leia mais
          </a>
        ) : (
          <button
            type="button"
            onClick={onSeeDetails}
            className={clsx(
              "w-full flex items-center justify-center px-3 py-2 bg-none",
              "text-primary-600 text-sm sm:text-base rounded-lg font-bold hover:underline",
              readMoreButtonClassName
            )}
            aria-label="Ver detalhes do artigo"
          >
            Leia mais
          </button>
        ))}
    </Wrapper>
  );
}
