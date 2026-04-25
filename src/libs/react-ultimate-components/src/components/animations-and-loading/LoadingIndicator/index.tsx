"use client";

import { getThemeColor } from "../../../utils/colors";
import clsx from "clsx";
import { BarLoader, ClipLoader, DotLoader, ScaleLoader } from "react-spinners";
import { sizes } from "../../../theme/theme";

interface LoadingProps {
  /** Se está carregando ou não. */
  loading: boolean;
  /** Cor personalizada para o loader. */
  color?: string;
  /** Texto personalizado para o indicador de carregamento. */
  text?: string;
  /** Se deve ocultar o texto de carregamento. */
  hideText?: boolean;
  /** Estilo de variação do ícone */
  iconVariant?: "scale" | "bar" | "clip" | "dot";
  /** Se deve ocupar a tela inteira */
  fullscreen?: boolean;
}
/** Loading para indicar estados assíncronos.*/
export default function LoadingIndicator({
  loading = true,
  color,
  text,
  hideText,
  iconVariant,
  fullscreen,
}: LoadingProps) {
  const primary500 = getThemeColor("--color-primary-500");

  if (!loading) return null;

  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center gap-4",
        fullscreen ? "fixed inset-0 bg-background z-50 opacity-80" : "m-4"
      )}
    >
      {iconVariant === "scale" ? (
        <ScaleLoader
          color={color ?? primary500}
          loading
          width={sizes.xxxsmall}
          height={sizes.medium}
        />
      ) : iconVariant === "clip" ? (
        <ClipLoader color={color ?? primary500} loading size={sizes.large} />
      ) : iconVariant === "dot" ? (
        <DotLoader color={color ?? primary500} loading size={sizes.large} />
      ) : (
        <BarLoader color={color ?? primary500} loading width={sizes.huge} />
      )}
      {!hideText && (
        <span className="text-sm sm:text-sm text-foreground">
          {text ? text : "Carregando dados..."}
        </span>
      )}
    </div>
  );
}

