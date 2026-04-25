"use client";

import clsx from "clsx";
import { useMemo } from "react";
import MainArticleImage from "../MainArticleImage";
import ArticleImage from "../ArticleImage";

/* ===================== Types ===================== */
export interface ArticleItem {
  id: string;
  title: string;
  imgUrl: string;
  category?: string;
  href?: string;
  newTab?: boolean;
  publishedAt?: string;
  readingTime?: string;
  className?: string;
}

export interface ArticlesGridProps {
  /** ID do artigo principal (será destacado) */
  mainArticleId: string;
  /** Lista de artigos a exibir (incluindo o principal) */
  articles: ArticleItem[];
  /** Classes extras para o container externo */
  className?: string;
    /** Label opcional acima da grid */
  label?: string;
}

/**
 * ArticlesGrid — grade responsiva de artigos.
 *
 * Padrões:
 * - **Responsivo**: empilha no mobile; em `md+` o destaque ocupa 2 col/2 rows.
 * - **Dark-mode**: herda tokens de cor dos cards (já compatíveis).
 * - **Acessível**: ordem de leitura mantém o principal primeiro.
 */
export default function ArticlesGrid({
  mainArticleId,
  articles,
  className,
  label
}: ArticlesGridProps) {
  const { main, others } = useMemo(() => {
    const main = articles.find((a) => a.id === mainArticleId) ?? articles[0];
    const others = articles.filter((a) => a.id !== main?.id);
    return { main, others };
  }, [articles, mainArticleId]);

  if (!main) return null;

  return (
    <section
      className={clsx(
        "w-full bg-background text-foreground",
        "mx-auto",
        className
      )}
      aria-label="Lista de artigos"
    >
        {label && (
          <h2 className="px-1 mb-4 text-lg font-semibold">{label}</h2>
        )}
      {/* Grid principal */}
      <div
        className={clsx(
          "grid gap-4 sm:gap-5",
          // mobile: 1 coluna; md+: 3 colunas
          "grid-cols-1 md:grid-cols-3"
        )}
      >
        {/* Destaque (sempre primeiro na leitura) */}
        <div className="order-1 md:col-span-2 md:row-span-2">
          <MainArticleImage
            imgUrl={main.imgUrl}
            title={main.title}
            category={main.category ?? "Destaque"}
            className="h-full"
          />
        </div>

        {/* Demais itens — até 4 ficam como no mock; extra itens continuam fluindo */}
        {others.map((item) => (
          <ArticleImage
            key={item.id}
            imgUrl={item.imgUrl}
            title={item.title}
            publishedAt={item.publishedAt ?? ""}
            readingTime={item.readingTime}
            href={item.href}
            newTab={item.newTab}
            className="order-2"
          />
        ))}
      </div>
    </section>
  );
}

