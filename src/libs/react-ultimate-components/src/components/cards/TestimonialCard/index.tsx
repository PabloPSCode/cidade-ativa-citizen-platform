"use client";

import { StarIcon } from "@phosphor-icons/react";
import Image from "next/image";

interface TestimonialCardProps {
  /** URL do avatar do usuário que deu o depoimento. */
  avatarUrl: string;
  /** Nome do usuário que deu o depoimento. */
  userName: string;
  /** Papel/função do usuário (opcional, ex.: "Designer", "CEO"). */
  userRole?: string;
  /** Avaliação em estrelas (0 a 5, opcional). */
  rating?: number;
  /** Texto do depoimento do usuário. */
  testimonial: string;
}

/**
 * Card de depoimento de cliente/usuário.
 * - Inclui avatar, nome, função (opcional), estrelas de avaliação e texto do depoimento.
 * - Responsivo para ser usado em seções de landing pages ou vitrines de produtos.
 */
export default function TestimonialCard({
  avatarUrl,
  userName,
  userRole,
  rating,
  testimonial,
}: TestimonialCardProps) {
  const renderStars = (value: number) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < value);
    return (
      <div className="flex justify-center gap-1 my-3" aria-label={`Avaliação ${value} de 5`}>
        {stars.map((filled, i) => (
          <StarIcon
            key={i}
            size={20}
            weight={filled ? "fill" : "regular"}
            className={filled ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="
        flex flex-col items-center text-center bg-bg-card border-border-card border bg-card
         gap-4 shadow-md rounded-lg 
        p-6 max-w-sm mx-auto
      "
    >
      {/* Avatar */}
      <Image
        src={avatarUrl}
        alt={`Foto de ${userName}`}
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover mb-4"
        sizes="80px"
      />

      {/* Depoimento */}
      <p className="text-sm sm:text-base text-foreground/70 mb-2">
        {testimonial}
      </p>

      {/* Estrelas */}
      {typeof rating === "number" && renderStars(rating)}

      {/* Nome e Função */}
      <div>
        <p className="font-semibold text-foreground">{userName}</p>
        {userRole && <p className="text-sm text-foreground/70">{userRole}</p>}
      </div>
    </div>
  );
}

export type { TestimonialCardProps };
