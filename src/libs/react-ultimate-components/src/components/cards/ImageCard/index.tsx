"use client";
import Image from "next/image";

interface ImageCardProps {
  /** URL da imagem a ser exibida. */
  imgUrl: string;
  /** Título da imagem. */
  title: string;
  /** Descrição da imagem (opcional). */
  description?: string;
  /** Função chamada ao clicar em "Ver Detalhes" (opcional). */
  onSeeDetails?: () => void;
}

/**
 * Card de imagem.
 * - Responsivo para ser usado em seções de landing pages ou vitrines de produtos.
 */
export default function ImageCard({
  imgUrl,
  title,
  description,
  onSeeDetails,
}: ImageCardProps) {
  const handleSeeDetails = () => {
    if (onSeeDetails) {
      onSeeDetails();
    }
  };

  return (
    <div
      className="
        flex flex-col items-center text-center border-border-card border bg-bg-card 
         gap-4 shadow-md rounded-lg p-4 max-w-sm mx-auto
      "
    >
      {/* Imagem */}
      <Image
        src={imgUrl}
        alt={title}
        width={800}
        height={400}
        className="w-full h-48 object-cover rounded-lg mb-4"
        sizes="(min-width: 640px) 480px, 100vw"
      />

      {/* Título */}
      <h3 className="font-semibold text-md sm:text-lg text-foreground">
        {title}
      </h3>

      {/* Descrição */}
      {description && (
        <p className="text-foreground/70 text-xs sm:text-sm">{description}</p>
      )}

      {/* Botão "Ver Detalhes" */}
      {onSeeDetails && (
        <button
          onClick={handleSeeDetails}
          className="w-full flex items-center justify-center
        mt-4 px-3 py-2 bg-primary-600 text-white text-xs sm:text-sm rounded-lg 
        hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
      "
          aria-label="Ver detalhes da imagem"
          aria-roledescription="botão"
        >
          Ver Detalhes
        </button>
      )}
    </div>
  );
}
