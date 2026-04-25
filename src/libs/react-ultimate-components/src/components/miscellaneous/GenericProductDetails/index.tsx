"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { formatBRL } from "../../../utils/format";

type Photo = {
  /** URL da imagem. */
  src: string;
  /** Texto alternativo (acessibilidade). */
  alt?: string;
  /** Classe extra aplicada APENAS a esta imagem (thumbnail). */
  className?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  description: string;
  photos: Photo[];
  shareUrl?: string;
};

export interface GenericProductDetailsProps {
  /** Imagens a serem exibidas. */
  product: Product;
  /** Classes extras para o container principal. */
  className?: string;
  /** Classes extras para a imagem principal. */
  mainImageClassName?: string;
  /** Classes extras aplicadas a TODOS os thumbnails. */
  thumbClassName?: string;
  showHelperText?: boolean;
  /** Callback acionado ao clicar em “Adicionar ao carrinho”. */
  onAddToCart?: (product: Product) => void;
  /** Callback acionado ao compartilhar o produto. */
  onShare?: (product: Product) => void;
}

export default function GenericProductDetails({
  product,
  className,
  mainImageClassName,
  thumbClassName,
  showHelperText = true,
  onAddToCart,
  onShare,
}: GenericProductDetailsProps) {
  const safeImages = useMemo(
    () => product.photos?.filter(Boolean) ?? [],
    [product.photos]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [origin, setOrigin] = useState<string>("50% 50%");
  const current = safeImages[currentIndex];

  // Atualiza índice caso a lista mude
  useEffect(() => {
    if (currentIndex > safeImages.length - 1) setCurrentIndex(0);
  }, [safeImages, currentIndex]);

  if (!safeImages.length) return null;

  // --- Navegação
  const goPrev = () =>
    setCurrentIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const goNext = () =>
    setCurrentIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  const handleMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  };

  const normalizedDiscount =
    typeof product.discount === "number"
      ? Math.round(
          product.discount > 0 && product.discount <= 1
            ? product.discount * 100
            : product.discount
        )
      : undefined;

  const derivedDiscount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : undefined;

  const discountPercentage =
    normalizedDiscount ??
    (derivedDiscount && derivedDiscount > 0 ? derivedDiscount : undefined);

  const formattedPrice = formatBRL(product.price);
  const formattedOldPrice = product.oldPrice
    ? formatBRL(product.oldPrice)
    : null;

  const handleAddToCart = () => onAddToCart?.(product);
  const handleShare = () => onShare?.(product);

  return (
    <div className="flex flex-col lg:flex-row bg-background">
      <div
        className={clsx(
          "w-full flex-1 grid gap-3 md:grid-cols-[88px_1fr] items-start",
          "text-foreground rounded-md bg-background",
          className
        )}
      >
        {/* Thumbs: horizontal no mobile; vertical no desktop */}
        <div className="order-2 md:order-1 flex md:flex-col gap-2 md:h-[520px] md:overflow-y-auto pr-1">
          {safeImages.map((img, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={`${img.src}-${idx}`}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={clsx("relative overflow-hidden rounded-md")}
                aria-label={img.alt ?? `Imagem ${idx + 1}`}
                aria-current={active ? "true" : undefined}
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? `Miniatura ${idx + 1}`}
                  width={120}
                  height={120}
                  className={clsx(
                    "w-full object-cover",
                    active
                      ? "border-2 border-primary-500"
                      : "hover:brightness-90",
                    thumbClassName,
                    img.className
                  )}
                />
              </button>
            );
          })}
          {safeImages.length > 0 && (
            <span className="text-xs text-foreground/70">{`${
              currentIndex + 1
            }/${safeImages.length}`}</span>
          )}
        </div>

        {/* Área principal */}
        <div className="order-1 md:order-2">
          <div
            className={clsx(
              "relative w-full overflow-hidden bg-foreground/5 max-w-5xl max-h-[60vh]",
              // Mantém proporção elegante e responsiva
              "aspect-square sm:aspect-4/3 rounded-md"
            )}
            // Acessibilidade: navegação via teclado
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") goPrev();
              if (e.key === "ArrowRight") goNext();
            }}
          >
            {/* Botões de navegação (sempre posicionados corretamente) */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Imagem anterior"
              className={clsx(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "inline-flex items-center justify-center rounded-full p-2",
                "bg-background/80 hover:bg-background/95 text-foreground"
              )}
            >
              <ArrowLeftIcon weight="bold" className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima imagem"
              className={clsx(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "inline-flex items-center justify-center rounded-full p-2",
                "bg-background/80 hover:bg-background/95 text-foreground"
              )}
            >
              <ArrowRightIcon weight="bold" className="h-5 w-5" />
            </button>

            {/* Wrapper do zoom */}
            <div
              className={clsx(
                "group relative h-full w-full cursor-zoom-in select-none"
              )}
              onMouseMove={handleMove}
            >
              <Image
                src={current.src}
                alt={current.alt ?? `Imagem ${currentIndex + 1}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                style={{ transformOrigin: origin }}
                className={clsx(
                  "h-full w-full object-contain transition-transform duration-200 ease-out cursor-zoom-out",
                  "group-hover:scale-[1.5]",
                  mainImageClassName
                )}
              />
            </div>
          </div>
          {showHelperText && (
            <p className="mt-2 text-xs text-foreground/70">
              Passe o mouse para ampliar • Use as setas ou os botões para
              navegar.
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 w-full rounded-md p-4 sm:p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 text-foreground">
          <h2 className="text-lg sm:text-xl font-semibold leading-tight">
            {product.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {formattedPrice}
            </p>
            {formattedOldPrice && (
              <span className="text-sm sm:text-base text-foreground/60 line-through">
                {formattedOldPrice}
              </span>
            )}
            {discountPercentage && (
              <span className="inline-flex items-center rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>
          <div className="h-px w-full bg-foreground/10" />
          <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-foreground/60">
            Descrição
          </span>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
            {product.description}
          </p>
        </div>
        <div className="w-full max-w-69 mt-6 flex flex-col gap-3 ">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-fit items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-base font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
          >
            <ShoppingCartIcon className="h-5 w-5" weight="bold" />
            Tenho interesse
          </button>
          <div className="flex flex-col w-full gap-3 sm:w-auto">
            <span className="text-sm sm:text-base text-foreground">
              Compartilhe nas redes sociais:
            </span>
            {product.shareUrl && (
              <div className="w-full flex items-center gap-2">
                <WhatsappShareButton
                  url={product.shareUrl}
                  children={<WhatsappIcon className="rounded-lg w-8 h-8 sm:w-12 sm:h-12" />}
                />
                <FacebookShareButton
                  url={product.shareUrl}
                  children={<FacebookIcon className="rounded-lg w-8 h-8 sm:w-12 sm:h-12" />}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
