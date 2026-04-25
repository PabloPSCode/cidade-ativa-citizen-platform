"use client";

import { sizes } from "../../../theme/theme";
import { GoogleLogoIcon } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes } from "react";
import { BarLoader, ClipLoader, DotLoader, ScaleLoader } from "react-spinners";

interface GoogleSignInButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto do botão. */
  label?: string;
  /** Se o botão está em estado de carregamento. */
  loading?: boolean;
  /** Variante de estilo. */
  variant?: "primary" | "gray" | "red" | "blue";
  /** Estilo de variação do ícone. */
  iconVariant?: "scale" | "bar" | "clip" | "dot";
  /** Cor do ícone. */
  iconColor?: string;
}

/** Botão de autenticação baseado no Google. */
export default function GoogleSignInButton({
  label = "Entrar com o Google",
  loading,
  variant = "red",
  iconVariant = "scale",
  iconColor = "#ffffff",
  ...props
}: GoogleSignInButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-full px-3 py-2 sm:px-4  rounded-md font-semibold ${
        variant === "primary"
          ? "bg-primary-500 text-white hover:bg-primary-600"
          : variant === "gray"
          ? "bg-gray-500 text-white hover:bg-gray-600"
          : variant === "red"
          ? "bg-red-500 text-white hover:bg-red-600"
          : variant === "blue"
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : ""
      }`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          {/* For medium and large devices */}
          <GoogleLogoIcon
            color={iconColor}
            size={sizes.large}
            weight="fill"
            className="hidden sm:flex"
          />
          {/* For small devices */}
          <GoogleLogoIcon
            color={iconColor}
            size={sizes.medium}
            weight="fill"
            className="flex sm:hidden"
          />
          <span className="text-xs sm:text-sm">{label}</span>
          {iconVariant === "scale" ? (
            <ScaleLoader
              color={iconColor}
              loading={loading}
              width={sizes.xxxsmall}
              height={sizes.small}
            />
          ) : iconVariant === "clip" ? (
            <ClipLoader color={iconColor} loading={loading} size={sizes.medium} />
          ) : iconVariant === "dot" ? (
            <DotLoader color={iconColor} loading={loading} size={sizes.medium} />
          ) : (
            <BarLoader color={iconColor} loading={loading} width={sizes.medium} />
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* For medium and large devices */}
          <GoogleLogoIcon
            color={iconColor}
            size={sizes.large}
            weight="fill"
            className="hidden sm:flex"
          />
          {/* For small devices */}
          <GoogleLogoIcon
            color={iconColor}
            size={sizes.medium}
            weight="fill"
            className="flex sm:hidden"
          />
          <span className="opacity-100 text-xs sm:text-sm">{label}</span>
        </div>
      )}
    </button>
  );
}

export type { GoogleSignInButtonProps };
