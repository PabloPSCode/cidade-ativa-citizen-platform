"use client";

import { ShareNetworkIcon, StarIcon, TimerIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDefaultDate } from "../../../../../../utils/format";
import { formatBRL } from "../../../utils/format";

type Rating = 0 | 1 | 2 | 3 | 4 | 5;

interface ProductCardProps {
  /** URL da imagem do produto. */
  imageUrl: string;
  /** Título do produto. */
  title: string;
  /** Preço do produto (valor numérico). */
  price: number;
  /** Avaliação do produto (0 a 5). */
  rating?: Rating;
  /** Quantidade de parcelas (opcional). */
  installments?: number;
  /** Valor de cada parcela (opcional). */
  installmentValue?: number;
  /** Rótulo do botão (ex.: “Adicionar ao carrinho”). */
  ctaLabel?: string;
  /** Rótulo do botão secundário */
  shareLabel?: string;
  /** Classe opcional aplicada ao cartão */
  className?: string;
  /** Callback ao clicar no botão de ação. */
  onAddToCart?: () => void;
  /** Callback ao clicar no botão de compartilhar. */
  onShare?: () => void;
  /** Callback ao ver os detalhes do produto. */
  onSeeProductDetails?: (productId?: string) => void;

  /**
   * Se deve mostrar a promoção (deal).
   * Quando `true`, o card exibe preço promocional e um contador regressivo.
   */
  showDeal?: boolean;

  /** Preço da promoção. Quando não informado, usa `price` como fallback. */
  dealPrice?: number;

  /**
   * Horário (ISO string) em que a promoção termina.
   * - **Padrão:** 24 horas a partir do primeiro render.
   * - Ex.: "2025-12-31T23:59:59.000Z"
   */
  dealEndsWithIn?: string;
}

/**
 * Card de produto para listagens em e-commerce.
 * - **Responsivo:** tipografia, imagem e botões adaptam por breakpoint.
 * - **Acessível:** `alt` na imagem, labels ARIA e botão com foco visível.
 * - **Promoção com contador:** se `showDeal` for `true`, exibe preço promocional e um contador que
 *   por padrão encerra em 24 horas (ou no horário definido em `dealEndsWithIn`).
 */
export default function ProductCard({
  imageUrl,
  title,
  price,
  rating,
  installments,
  installmentValue,
  ctaLabel = "Tenho interesse",
  shareLabel = "Compartilhar",
  onAddToCart,
  onShare,
  onSeeProductDetails,
  showDeal,
  dealPrice,
  dealEndsWithIn,
  className,
}: ProductCardProps) {
  const formattedBasePrice = formatBRL(price);
  const effectiveDealPrice = dealPrice ?? price;
  const formattedDealPrice = formatBRL(effectiveDealPrice);

  const defaultEnd = useMemo(() => {
    return getDefaultDate();
  }, []);

  const dealEndsAt = useMemo<Date>(() => {
    if (!showDeal) return defaultEnd;
    if (!dealEndsWithIn) return defaultEnd;
    const parsed = new Date(dealEndsWithIn);
    return isNaN(parsed.getTime()) ? defaultEnd : parsed;
  }, [dealEndsWithIn, defaultEnd, showDeal]);

  const [remainingMs, setRemainingMs] = useState<number>(
    Math.max(0, dealEndsAt.getTime() - Date.now())
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showDeal) return;
    setRemainingMs(Math.max(0, dealEndsAt.getTime() - Date.now()));

    intervalRef.current = window.setInterval(() => {
      setRemainingMs(() => {
        const next = Math.max(0, dealEndsAt.getTime() - Date.now());
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dealEndsAt, showDeal]);

  const dealExpired = showDeal ? remainingMs <= 0 : false;

  // === Estrelas de avaliação ===
  const renderStars = (value: Rating) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < value);
    return (
      <div
        className="flex items-center gap-1 text-base sm:text-lg"
        aria-label={`Avaliação ${value} de 5`}
      >
        {stars.map((filled, i) => (
          <StarIcon
            key={i}
            size="1em"
            weight={filled ? "fill" : "regular"}
            className={filled ? "text-yellow-400" : "text-foreground/30"}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "group flex flex-col rounded-2xl border border-border-card bg-bg-card shadow-sm text-foreground",
        "p-4 sm:p-5 gap-3 max-w-full w-full transition-transform hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      role="article"
      aria-label={`Produto: ${title}`}
    >
      {/* Imagem */}
      <div className="mb-2 sm:mb-3">
        <button
          type="button"
          onClick={() => onSeeProductDetails?.()}
          className="w-full overflow-hidden h-28 sm:h-32 md:h-40 flex items-center justify-center relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40"
        >
          <Image
            src={imageUrl}
            alt={title}
            width={640}
            height={640}
            className="w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 80vw"
          />
        </button>
      </div>

      {/* Título */}
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground uppercase tracking-tight mb-1 line-clamp-2">
        {title}
      </h3>

      {/* Avaliação */}
      {typeof rating === "number" && (
        <div className="mb-2">{renderStars(rating)}</div>
      )}

      {/* Preços */}
      <div className="flex flex-col gap-1 mb-1">
        {showDeal && !dealExpired ? (
          <>
            {effectiveDealPrice < price && (
              <p className="text-xs sm:text-sm text-foreground/60 font-semibold line-through">
                {formattedBasePrice}
              </p>
            )}
            <p className="text-xl md:text-2xl font-extrabold text-foreground">
              {formattedDealPrice}
            </p>
          </>
        ) : (
          <p className="text-xl md:text-2xl font-extrabold text-foreground">
            {formattedBasePrice}
          </p>
        )}
      </div>

      {/* Parcelamento */}
      {installments && installmentValue ? (
        <p className="text-xs sm:text-sm text-foreground mb-2 sm:mb-3">
          Em até {installments}x de {formatBRL(installmentValue)} sem juros
        </p>
      ) : (
        <div className="mb-1 sm:mb-2" />
      )}

      {showDeal && (
        <div
          className="
                inline-flex gap-2 rounded-md
                 dark:text-primary-200
                px-3 py-1.5 text-[11px] sm:text-xs font-semibold
              "
        >
          <TimerIcon size={20} weight="bold" />
          <span>Confira a disponibilidade com o vendedor</span>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={showDeal ? dealExpired : false}
          className={clsx(
            "inline-flex items-center justify-center gap-2 rounded-md px-4 py-3",
            "text-sm sm:text-base font-semibold transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60 cursor-pointer",
            showDeal && dealExpired
              ? "text-background cursor-not-allowed text-white"
              : "bg-primary-500 text-white"
          )}
          aria-label={`${ctaLabel} - ${title}`}
        >
          {showDeal && dealExpired ? "Indisponível" : ctaLabel}
        </button>

        {shareLabel && onShare && (
          <button
            type="button"
            onClick={onShare}
            className="
            inline-flex items-center justify-between gap-2
            rounded-md border border-foreground/15 px-4 py-3
            text-sm sm:text-base font-semibold text-foreground
            transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40
          "
            aria-label={`${shareLabel} - ${title}`}
          >
            <span>{shareLabel}</span>
            <ShareNetworkIcon size={18} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}

export type { ProductCardProps };
