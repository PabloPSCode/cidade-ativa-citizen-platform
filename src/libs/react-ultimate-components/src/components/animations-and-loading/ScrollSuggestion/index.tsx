"use client";

import { MouseScrollIcon } from "@phosphor-icons/react";
import clsx from "clsx";

interface ScrollSugestionProps {
  /** Texto auxiliar opcional. */
  helperText?: string;
  /** Animação a ser utilizada. */
  animation?: "bounce" | "pulse";
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Classe opcional para o ícone. */
  iconClassName?: string;
  /** Classe opcional para o texto. */
  textClassName?: string;
  /** Ícone opcional a ser exibido. */
  icon?: React.ReactNode;
}

/** Componente que sugere ao usuário que ele deve rolar a página para baixo. */
export default function ScrollSuggestion({
  helperText,
  animation = "bounce",
  containerClassName,
  iconClassName,
  textClassName,
  icon,
}: ScrollSugestionProps) {
  return (
    <div
      className={clsx("flex flex-col items-center gap-y-2", containerClassName)}
    >
      {icon ?? (
        <MouseScrollIcon
          size={24}
          className={clsx(
            "text-primary-500",
            iconClassName,
            animation === "pulse" ? "animate-pulse" : "animate-bounce"
          )}
        />
      )}
      <span
        className={clsx("text-xs sm:text-sm text-foreground", textClassName)}
      >
        {helperText ?? "Role para baixo"}
      </span>
    </div>
  );
}

