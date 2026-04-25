"use client";

import clsx from "clsx";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export type BrandLogo = {
  /** URL do logotipo (SVG/PNG/WebP). */
  src: string;
  /** Texto alternativo para acessibilidade. */
  alt: string;
  /** Link opcional ao clicar no logotipo. */
  href?: string;
};

export interface BrandMarqueeProps {
  /** Lista de logotipos a exibir rolando horizontalmente. */
  logos: BrandLogo[];
  /** Título opcional acima do carrossel. */
  title?: string;

  /** Velocidade do scroll (padrão: 40). */
  speed?: number;
  /** Pausa ao passar o mouse (padrão: true). */
  pauseOnHover?: boolean;
  /** Inverte a direção (padrão: "left"). */
  direction?: "left" | "right";
  /** Espaçamento entre os logos (padrão: "normal"). */
  itemsGap?: "close" | "normal" | "wide";
  /** Filtro de imagem aplicado aos logotipos (padrão: "none"). */
  imageFilter?: "none" | "grayscale" | "sepia";

  /**
   * Ativa o desvanecimento nas bordas (padrão: true).
   * Usamos *overlays* com gradiente para casar 100% com o tema.
   */
  showEdgeFade?: boolean;

  /** Altura máxima do logotipo (padrão: 40px em mobile → 56px em ≥sm). */
  maxLogoHeightPx?: number;

  /** Classe extra para o contêiner externo. */
  className?: string;
}

/**
 * # BrandMarquee
 *
 * Expositor de marcas com rolagem horizontal **infinita** (right→left).
 * - **Responsivo** (tamanho dos logos e gaps por breakpoint);
 * - **Dark mode**: usa tokens utilitários (`bg-background`, `text-foreground`);
 * - **Acessível**: `alt` e links opcionais;
 * - **Efeito de sombra/gradiente nas bordas** para suavizar o corte visual.
 */
export default function BrandMarquee({
  logos,
  title,
  speed = 40,
  pauseOnHover = true,
  direction = "left",
  showEdgeFade = true,
  itemsGap = "normal",
  maxLogoHeightPx = 120,
  className,
  imageFilter = "none",
}: BrandMarqueeProps) {
  if (!logos?.length) return null;
  const maxLogoWidth = maxLogoHeightPx * 3;

  return (
    <section className={clsx("w-full max-w-7xl", className)}>
      {title && (
        <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-medium text-foreground">
          {title}
        </h3>
      )}

      <div className="relative w-full overflow-hidden bg-background">
        {/* Overlays de fade que acompanham o tema (não dependem do lib) */}
        {showEdgeFade && (
          <>
            <div className="w-[10vw] pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r from-background to-transparent" />
            <div className="w-[10vw] pointer-events-none absolute inset-y-0 right-0 z-10 bg-gradient-to-l from-background to-transparent" />
          </>
        )}

        <Marquee
          pauseOnHover={pauseOnHover}
          speed={speed}
          direction={direction}
          gradient={false}
          autoFill
        >
          <ul className="flex items-center" aria-label="Logotipos de marcas">
            {logos.map((logo, i) => {
              const imgEl = (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  width={maxLogoWidth}
                  height={maxLogoHeightPx}
                  sizes={`${maxLogoWidth}px`}
                  className={clsx(
                    "w-auto h-auto opacity-50 hover:opacity-100 transition-opacity",
                    "object-contain",
                    itemsGap === "close"
                      ? "mx-4 sm:mx-6 md:mx-8"
                      : itemsGap === "wide"
                      ? "mx-24 sm:mx-28 md:mx-32"
                      : "mx-12 sm:mx-16 md:mx-20",
                    "mix-blend-normal dark:mix-blend-screen", // ajuda logos escuros em bg escuro
                    imageFilter === "sepia" && "sepia-100",
                    imageFilter === "grayscale" && "grayscale"
                  )}
                  style={{
                    maxHeight: maxLogoHeightPx,
                  }}
                />
              );

              return (
                <li key={`${logo.alt}-${i}`} className="flex items-center">
                  {logo.href ? (
                    <a
                      href={logo.href}
                      aria-label={logo.alt}
                      className="inline-flex items-center"
                      target="_blank"
                    >
                      {imgEl}
                    </a>
                  ) : (
                    imgEl
                  )}
                </li>
              );
            })}
          </ul>
        </Marquee>
      </div>
    </section>
  );
}
