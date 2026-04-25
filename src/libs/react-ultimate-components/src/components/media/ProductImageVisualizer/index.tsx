"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

type Photo = {
  /** URL da imagem. */
  src: string;
  /** Texto alternativo (acessibilidade). */
  alt?: string;
  /** Classe extra aplicada APENAS a esta imagem (thumbnail). */
  className?: string;
};

export interface ProductImageVisualizerProps {
  /** Imagens a serem exibidas. */
  images: Photo[];
  /** Classes extras para o container principal. */
  className?: string;
  /** Classes extras para a imagem principal. */
  mainImageClassName?: string;
  /** Classes extras aplicadas a TODOS os thumbnails. */
  thumbClassName?: string;
  showHelperText?: boolean;
}

export default function ProductImageVisualizer({
  images,
  className,
  mainImageClassName,
  thumbClassName,
  showHelperText = true,
}: ProductImageVisualizerProps) {
  const safeImages = useMemo(() => images?.filter(Boolean) ?? [], [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // --- Zoom: ajusta transform-origin baseado no cursor
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [origin, setOrigin] = useState<string>("50% 50%");
  const handleMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  };

  return (
    <div
      className={clsx(
        "w-full  grid gap-3 md:grid-cols-[88px_1fr] items-start",
        "bg-background text-foreground",
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
                loading="lazy"
                width={88}
                height={88}
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
          <span className="text-xs text-foreground/70">{`${currentIndex + 1}/${
            safeImages.length
          }`}</span>
        )}
      </div>

      {/* Área principal */}
      <div className="order-1 md:order-2  ">
        <div
          className={clsx(
            "relative w-full overflow-hidden bg-foreground/5 max-w-5xl max-h-[50vh]",
            // Mantém proporção elegante e responsiva
            "aspect-square sm:aspect-[4/3]"
          )}
          // Acessibilidade: navegação via teclado
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeftIcon") goPrev();
            if (e.key === "ArrowRightIcon") goNext();
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
              // Zoom suave no hover; transform-origin acompanha o cursor
              style={{ transformOrigin: origin }}
              fill
              sizes="(min-width: 768px) 70vw, 100vw"
              className={clsx(
                "h-full w-full object-contain transition-transform duration-200 ease-out cursor-zoom-out",
                "group-hover:scale-[1.5]", // zoom ao passar o mouse
                mainImageClassName
              )}
            />
          </div>
        </div>
        {showHelperText && (
          <p className="mt-2 text-xs text-foreground/70">
            Passe o mouse para ampliar • Use as setas ou os botões para navegar.
          </p>
        )}
      </div>
    </div>
  );
}
