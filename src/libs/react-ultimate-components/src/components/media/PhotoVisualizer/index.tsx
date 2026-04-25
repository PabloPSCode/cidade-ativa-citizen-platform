"use client";

import clsx from "clsx";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";

/** ===================== Tipos ===================== */
type Photo = {
  /** URL da imagem. */
  src: string;
  /** Texto alternativo (acessibilidade). */
  alt?: string;
  /** Classe extra aplicada APENAS a esta imagem (thumbnail). */
  className?: string;
};

export interface PhotoVisualizerProps {
  /** Lista de fotos para miniaturas + lightbox. */
  photos: Photo[];
  /** Classes extras para o container principal. */
  containerClassName?: string;
  /** Classes extras para o grid/faixa de miniaturas. */
  thumbsContainerClassName?: string;
  /** Classes extras aplicadas a TODAS as miniaturas. */
  thumbClassName?: string;
}

/**
 * PhotoVisualizer — Galeria de miniaturas com lightbox (react-photo-view).
 *
 * Padrões (mercado brasileiro):
 * - **Responsivo**: miniaturas em grid flexível que “quebra” em múltiplas linhas.
 * - **Dark-mode**: usa tokens `bg-background`, `text-foreground`, `border-border-card`.
 * - **Acessível**: `alt` nas imagens, foco visível nos botões, `role=list`.
 *
 * Casos de uso:
 * - Vitrine de produto, portfólio, galerias em landing pages.
 */
export default function PhotoVisualizer({
  photos,
  containerClassName,
  thumbsContainerClassName,
  thumbClassName,
}: PhotoVisualizerProps) {
  if (!photos?.length) return null;

  return (
    <div
      className={clsx(
        "w-full bg-background text-foreground",
        containerClassName
      )}
    >
      <PhotoProvider loop speed={() => 200}>
        <div
          role="list"
          aria-label="Miniaturas da galeria"
          className={clsx("flex flex-wrap gap-1", thumbsContainerClassName)}
        >
          {photos.map((photo, index) => (
            <PhotoView key={`${photo.src}-${index}`} src={photo.src}>
              {/* Botão fornece foco via teclado e ring consistente com o design system */}
              <button
                type="button"
                role="listitem"
                className="rounded"
                aria-label={photo.alt ?? `Abrir foto ${index + 1}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt ?? `Foto ${index + 1}`}
                  loading="lazy"
                  width={96}
                  height={96}
                  sizes="(min-width: 768px) 96px, (min-width: 640px) 80px, 64px"
                  className={clsx(
                    // Tamanhos responsivos das thumbs
                    "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-cover",
                    thumbClassName, // classes globais
                    photo.className // classes específicas da imagem
                  )}
                />
              </button>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
}
