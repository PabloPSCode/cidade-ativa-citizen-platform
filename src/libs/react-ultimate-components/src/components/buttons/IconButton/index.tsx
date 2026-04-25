"use client";

import {
  ChatCircleIcon,
  EyeIcon,
  HeartIcon,
  PenIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { sizes } from "../../../theme/theme";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Se o botão está em estado de carregamento. */
  loading?: boolean;
  /** Variante de estilo. */
  variant?: "filled" | "outlined" | "alert" | "destructive";
  /** Nome do ícone a ser exibido */
  iconName?: "heart" | "trash" | "plus" | "pen" | "eye" | "cart" | "chat";
  /** Tamanho do ícone. */
  iconSize?: number;
  /** Estilo de variação do ícone. */
  iconVariation?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  /** Elemento opcional para exibir outro ícone */
  icon?: ReactNode;
}

/** Componente de botão de ícone. */
export default function IconButton({
  loading,
  variant = "filled",
  iconSize = sizes.medium,
  iconVariation = "fill",
  iconName = "heart",
  icon,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-fit p-2 rounded-md ${
        variant === "filled"
          ? "bg-primary-500 text-white hover:bg-primary-600 hover:text-white"
          : variant === "outlined"
          ? "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
          : variant === "alert"
          ? "bg-alert-500 text-white hover:bg-alert-600"
          : variant === "destructive"
          ? "bg-destructive-500 text-white hover:bg-destructive-600"
          : ""
      }`}
      disabled={loading}
      {...props}
    >
      {iconName === "heart" && (
        <HeartIcon size={iconSize} weight={iconVariation} />
      )}
      {iconName === "trash" && (
        <TrashIcon size={iconSize} weight={iconVariation} />
      )}
      {iconName === "plus" && <PlusIcon size={iconSize} weight={iconVariation} />}
      {iconName === "pen" && <PenIcon size={iconSize} weight={iconVariation} />}
      {iconName === "eye" && <EyeIcon size={iconSize} weight={iconVariation} />}
      {iconName === "cart" && (
        <ShoppingCartIcon size={iconSize} weight={iconVariation} />
      )}
      {iconName === "chat" && (
        <ChatCircleIcon size={iconSize} weight={iconVariation} />
      )}
      {!iconName && icon && icon}
    </button>
  );
}

