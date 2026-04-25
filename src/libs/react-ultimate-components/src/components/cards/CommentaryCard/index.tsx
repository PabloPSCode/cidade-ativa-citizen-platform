"use client";

// components/cards/CommentaryCard/index.tsx
import { formatDateLong } from "../../../utils/format";
import clsx from "clsx";

/** ===================== Tipagem ===================== */
export interface CommentaryCardProps {
  /** Nome do autor do comentário. */
  author: string;
  /** Data de publicação (ISO ou legível). */
  publishDate: string;
  /** Conteúdo em texto (aceita \n para quebras de linha). */
  content: string;
  /** Classes extras para o container externo. */
  className?: string;
}

/**
 * CommentaryCard — cartão de comentário de usuário.
 *
 * Padrões:
 * - **Responsivo**: tipografia fluida e quebras naturais.
 * - **Dark-mode**: usa tokens `bg-bg-card`, `text-foreground`, `border-border-card`.
 * - **Acessível**: semântica com `<article>`, `<header>` e `<p>`.
 */
export default function CommentaryCard({
  author,
  publishDate,
  content,
  className,
}: CommentaryCardProps) {
  return (
    <article
      className={clsx(
        "w-full rounded-xl border border-border-card bg-bg-card",
        "p-3 sm:p-4 md:p-5 shadow-sm text-foreground",
        className
      )}
    >
      {/* Cabeçalho */}
      <header className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
          {author}
        </h3>
        <time
          dateTime={publishDate}
          className="shrink-0 text-xs sm:text-sm font-medium text-foreground/70"
          aria-label="Data da publicação"
        >
          {formatDateLong(publishDate)}
        </time>
      </header>

      {/* Conteúdo */}
      <p className="text-xs sm:text-sm  leading-relaxed text-foreground/90 whitespace-pre-line">
        {content}
      </p>
    </article>
  );
}

