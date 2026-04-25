"use client";

import { formatDateLong } from "../../../utils/format";
import { CalendarIcon, ClockIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

export interface ArticleImageProps {
  /** URL da imagem a ser exibida. */
  imgUrl: string;
  /** Título do artigo. */
  title: string;
  /** Data de publicação (ISO 8601). */
  publishedAt: string;
  /** Tempo estimado de leitura (ex.: "7 min" ou "11:20"). */
  readingTime?: string;

  /** URL do artigo. */
  href?: string;
  /** Abre o link em uma nova aba. */
  newTab?: boolean;
  /** Destaca o card como principal (tamanho maior). */
  isMain?: boolean;
  /** Callback ao clicar no card (opcional). */
  onClick?: () => void;
  /** Classes para personalização (cada elemento)*/
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  titleClassName?: string;
}

export default function ArticleImage({
  imgUrl,
  title,
  publishedAt,
  readingTime,
  href,
  newTab,
  isMain = false,
  onClick,
  className,
  imageClassName,
  overlayClassName,
  titleClassName,
} : ArticleImageProps) {
  const Wrapper: React.ElementType = href ? "a" : "div";
  const wrapperProps = href
    ? {
        href,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : {};
  const imageSizes = isMain
    ? "(min-width: 1024px) 70vw, 100vw"
    : "(min-width: 1024px) 33vw, 100vw";

  return (
    <Wrapper
      {...wrapperProps}
      onClick={onClick}
      className={clsx(
        "block group relative overflow-hidden rounded-2xl border border-border-card bg-bg-card",
        "shadow-sm transition-transform duration-200 will-change-transform",
        "hover:shadow-md hover:-translate-y-[1px]",
        isMain
          ? "aspect-[16/11] sm:aspect-[16/10] lg:aspect-[16/9] w-full"
          : "aspect-[4/3] sm:aspect-[5/4] w-full max-w-md",
        className
      )}
      aria-label={title}
    >
      <Image
        src={imgUrl}
        alt={title}
        loading="lazy"
        fill
        sizes={imageSizes}
        className={clsx(
          "absolute inset-0 h-full w-full object-cover",
          "transition-transform duration-300 group-hover:scale-[1.03]",
          imageClassName
        )}
      />

      <div
        className={clsx(
          "pointer-events-none absolute inset-0",
          "bg-gradient-to-t from-black/70 via-black/20 to-black/0",
          "dark:from-black/75",
          overlayClassName
        )}
      />

      <div className="absolute left-4 top-4 flex items-center gap-4 text-white/90 drop-shadow-sm">
        <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium">
          <CalendarIcon weight="bold" className="h-4 w-4" />
          {formatDateLong(publishedAt)}
        </span>
        {readingTime && (
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium">
            <ClockIcon weight="bold" className="h-4 w-4" />
            {readingTime}
          </span>
        )}
      </div>

      <h3
        className={clsx(
          "absolute left-4 right-4 bottom-4 text-white drop-shadow",
          "font-extrabold tracking-[-0.01em] leading-tight",
          isMain ? "text-lg sm:text-2xl" : "text-base sm:text-lg",
          titleClassName
        )}
      >
        {title}
      </h3>
    </Wrapper>
  );
}
