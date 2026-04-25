"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { BarLoader, ClipLoader, DotLoader, ScaleLoader } from "react-spinners";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto do botão. */
  label: string;
  /** Se o botão está em estado de carregamento. */
  loading?: boolean;
  /** Variante de estilo. */
  variant?: "filled" | "outlined" | "alert" | "destructive";
  /** Estilo de variação do ícone. */
  iconVariant?: "scale" | "bar" | "clip" | "dot";
  /** Cor do ícone. */
  iconColor?: string;
  /** Classe CSS adicional para customização. */
  className?: string;
}

/** Componente de botão genérico. */
export default function Button({
  label,
  loading,
  variant = "filled",
  iconVariant = "scale",
  iconColor = "#ffffff",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        `flex items-center justify-center w-fit px-3 py-2 sm:px-4 sm:py-3 rounded-md  ${
          variant === "filled"
            ? "bg-primary-500 text-white"
            : variant === "outlined"
            ? "border border-primary-500 text-primary-500"
            : variant === "alert"
            ? "bg-amber-500 text-white"
            : variant === "destructive"
            ? "bg-destructive-500 text-white"
            : ""
        }`,
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm">{label}</span>
          {iconVariant === "scale" ? (
            <ScaleLoader
              color={iconColor}
              loading={loading}
              width={4}
              height={16}
            />
          ) : iconVariant === "clip" ? (
            <ClipLoader color={iconColor} loading={loading} size={24} />
          ) : iconVariant === "dot" ? (
            <DotLoader color={iconColor} loading={loading} size={24} />
          ) : (
            <BarLoader color={iconColor} loading={loading} width={32} />
          )}
        </div>
      ) : (
        <span className="opacity-100 text-xs sm:text-sm">{label}</span>
      )}
    </button>
  );
}

