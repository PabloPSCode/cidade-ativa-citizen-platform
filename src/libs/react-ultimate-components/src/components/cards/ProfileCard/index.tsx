"use client";

import Image from "next/image";

interface ProfileCardProps {
  /** URL do avatar do usuário */
  avatarUrl: string;
  /** Nome do usuário */
  userName: string;
  /** Papel/função do usuário (opcional, ex.: "Designer", "CEO"). */
  userRole?: string;
  /** Biografia do usuário (opcional). */
  bio?: string;
}

/**
 * Componente de cartão de perfil de usuário.
 */
export default function ProfileCard({
  avatarUrl,
  userName,
  userRole,
  bio,
}: ProfileCardProps) {
  return (
    <div
      className="
        flex flex-col items-center text-center bg-bg-card border-border-card border bg-card
         gap-4 shadow-md rounded-lg 
        p-4 max-w-xs mx-auto
      "
    >
      {/* Avatar */}
      <Image
        src={avatarUrl}
        alt={`Foto de ${userName}`}
        width={128}
        height={128}
        className="w-32 h-32 rounded-full object-cover mb-4"
        sizes="128px"
      />

      {/* Nome e Função */}
      <div>
        <p className="font-semibold text-foreground">
          {userName}
        </p>
        {userRole && <p className="text-sm text-gray-400">{userRole}</p>}
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-xs sm:text-sm text-foreground/70mb-2 text-left">
          {bio}
        </p>
      )}
    </div>
  );
}

export type { ProfileCardProps };
