"use client";

import clsx from "clsx";

export interface BadgeProps {
  /** Texto exibido no badge */
  text: string;
  /** Cor personalizada do badge */
  color?: string;
  /** Tamanho do badge */
  size?: "small" | "medium" | "large";
  /** Variante do badge */
  variant?: "filled" | "outlined" | "alert" | "destructive";
  /** Classes CSS adicionais */
  className?: string;
}

export default function Badge({
  text,
  color,
  size = "medium",
  variant = "filled",
  className,
}: BadgeProps) {
  // Tamanhos (responsivo na tipografia via base da app)
  const sizeClasses =
    size === "small"
      ? "px-2 py-0.5 text-[11px] sm:text-xs"
      : size === "large"
      ? "px-4 py-2 text-sm sm:text-base"
      : "px-3 py-1.5 text-xs sm:text-sm";

  // Sem cor custom: usar esquema padrão do DS
  const fallbackVariantClasses = clsx(
    variant === "outlined" &&
      "bg-transparent border border-border-card text-foreground",
    variant === "filled" && "bg-primary-600 text-white",
    variant === "alert" && "bg-alert-500 text-white",
    variant === "destructive" && "bg-destructive-600 text-white"
  );

  // Quando `color` é passado, ele prevalece.
  // - filled/alert/destructive: background = color, border = color, texto branco por padrão
  // - outlined: border = color, text = color, fundo transparente
  const isOutlined = variant === "outlined";
  const styleOverride: React.CSSProperties | undefined = color
    ? isOutlined
      ? { color, borderColor: color }
      : { backgroundColor: color, borderColor: color, color: "#fff" }
    : undefined;

  return (
    <span
      className={clsx(
        "inline-flex select-none items-center rounded-full font-semibold",
        "leading-none shadow-sm",
        // leve contraste com o fundo + foco visível
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
        sizeClasses,
        color
          ? // Com cor custom: garantir borda consistente entre temas
            clsx(
              "border",
              isOutlined ? "bg-transparent" : "bg-[--badge-bg]",
              // quando color existe, classes de cor do variant ficam neutras
              "transition-colors"
            )
          : fallbackVariantClasses,
        className
      )}
      style={styleOverride}
      aria-label={text}
    >
      {text}
    </span>
  );
}

