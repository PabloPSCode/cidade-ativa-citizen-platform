"use client";

import { ClipboardIcon } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes } from "react";
import { sizes } from "../../../theme/theme";

export type ClipboardButtonVariant = "filled" | "outlined";

export interface ClipboardButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto a ser copiado para a área de transferência. */
  textToCopy: string;
  /** Texto do botão. */
  label?: string;
  /** Variante de estilo. */
  variant?: ClipboardButtonVariant;
  /** Chamado após o texto ser copiado. */
  onCopy?: () => void;
}
/** Componente de botão de área de transferência. */
export default function ClipboardButton({
  textToCopy,
  label = "Copiar texto",
  onCopy,
  variant = "outlined",
  ...props
}: ClipboardButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-fit px-3 py-2 sm:px-4 sm:py-3  rounded-md gap-2 text-xs sm:text-sm ${
        variant === "filled"
          ? "bg-primary-500 text-white hover:bg-primary-600"
          : variant === "outlined"
          ? "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
          : ""
      }`}
      onClick={() => {
        navigator.clipboard.writeText(textToCopy);
        if (onCopy) {
          onCopy();
        }
      }}
      {...props}
    >
      <ClipboardIcon size={sizes.small} className="flex sm:hidden" />
      <ClipboardIcon size={sizes.medium} className="hidden sm:flex" />
      {label}
    </button>
  );
}

