"use client";

import { formatBRL } from "../../../utils/format";
import { CheckCircleIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import React from "react";

export interface PlanCardProps {
  /** Nome do plano. */
  title: string;
  /** Lista de vantagens exibidas com ícones. */
  advantages: Array<string | React.ReactNode>;
  /** Preço principal do plano (aceita string ou number). */
  price: string | number;
  /** Texto que acompanha o preço (ex.: "/mês"). */
  priceSuffix?: string;
  /** Observação abaixo do preço (ex.: "+ R$ 6,90/usuário adicional"). */
  priceNote?: string;
  /** Subtítulo em destaque (ex.: trial ou mensagem de teste). */
  subtitle?: string;
  /** Exibe selo de destaque. */
  isBestOption?: boolean;
  /** Texto do selo de destaque. */
  badgeLabel?: string;

  /** Classe para o container principal. */
  className?: string;
  /** Classe para o título. */
  titleClassName?: string;
  /** Classe para o subtítulo. */
  subtitleClassName?: string;
  /** Alias para subtítulo (mantém compatibilidade com a nomenclatura pedida). */
  subTitleClassName?: string;
  /** Classe para o preço. */
  priceClassName?: string;
  /** Classe para a lista de vantagens. */
  advantagesClassName?: string;
  /** Alias para a lista de vantagens (grafia solicitada). */
  advantgesClassName?: string;
  /** Classe para cada item de vantagem. */
  advantagesItemClassName?: string;
  /** Classe para a observação de preço. */
  priceNoteClassName?: string;
}

const basePalette = {
  header:
    "bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700 text-white",
  price: "text-primary-700 dark:text-primary-200",
  badge:
    "bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-200",
};

/**
 * Card de plano/pricing inspirado no modelo de três colunas.
 * - Responsivo (grid amigável, tipografia fluida).
 * - Dark-mode usando tokens e gradientes com variantes.
 * - Propriedades de classe para personalizar trechos específicos.
 */
export default function PlanCard({
  title,
  advantages,
  price,
  priceSuffix = "/mês",
  priceNote,
  subtitle,
  isBestOption,
  badgeLabel,
  className,
  titleClassName,
  subtitleClassName,
  subTitleClassName,
  priceClassName,
  advantagesClassName,
  advantgesClassName,
  advantagesItemClassName,
  priceNoteClassName,
}: PlanCardProps) {
  const resolvedSubtitleClass =
    subtitleClassName ?? subTitleClassName ?? undefined;
  const resolvedAdvantagesClass =
    advantagesClassName ?? advantgesClassName ?? undefined;
  const palette = basePalette;
  const formattedPrice =
    typeof price === "number" ? formatBRL(price) : price.trim();

  return (
    <article
      className={clsx(
        "relative flex h-full w-full max-w-full flex-col overflow-hidden",
        "rounded-2xl border border-border-card bg-bg-card text-foreground shadow-sm",
        className
      )}
      aria-label={`Plano ${title}`}
    >
      {isBestOption ? (
        <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 mb-1">
          <span
            className={clsx(
              "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
              palette.badge
            )}
          >
            {badgeLabel || "Melhor opção"}
          </span>
        </div>
      ) : null}

      {/* Cabeçalho com gradiente */}
      <div
        className={clsx(
          "flex flex-col items-center justify-center px-5 text-center",
          isBestOption ? "pt-9 pb-6" : "py-6",
          palette.header
        )}
      >
        <h3
          className={clsx(
            "text-lg sm:text-xl font-extrabold uppercase tracking-wide drop-shadow-sm",
            titleClassName
          )}
        >
          {title}
        </h3>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-5 sm:py-6">
        <ul
          className={clsx(
            "space-y-2 sm:space-y-3 text-sm sm:text-base",
            resolvedAdvantagesClass
          )}
        >
          {advantages.map((item, idx) => (
            <li
              key={idx}
              className={clsx(
                "flex items-start gap-2 text-foreground/90",
                advantagesItemClassName
              )}
            >
              <CheckCircleIcon
                weight="fill"
                size={18}
                className="mt-0.5 text-success-600 dark:text-success-400 w-4 h-4 min-w-4 min-h-4"
                aria-hidden
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-2 text-center sm:space-y-3">
          {subtitle ? (
            <p
              className={clsx(
                "text-sm sm:text-base font-semibold text-foreground",
                resolvedSubtitleClass
              )}
            >
              {subtitle}
            </p>
          ) : null}

          <div className="flex items-baseline justify-center gap-1 sm:gap-2">
            <span
              className={clsx(
                "text-2xl sm:text-3xl font-extrabold",
                palette.price,
                priceClassName
              )}
            >
              {formattedPrice}
            </span>
            {priceSuffix ? (
              <span className="text-[11px] sm:text-xs font-semibold text-foreground/70">
                {priceSuffix}
              </span>
            ) : null}
          </div>

          {priceNote ? (
            <p
              className={clsx(
                "text-[11px] sm:text-xs font-medium text-foreground/60",
                priceNoteClassName
              )}
            >
              {priceNote}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

