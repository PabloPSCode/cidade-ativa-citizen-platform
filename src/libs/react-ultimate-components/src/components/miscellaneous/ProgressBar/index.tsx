"use client";

import clsx from "clsx";

interface ProgressBarProps {
  /** Rótulo descritivo para a barra de progresso. */
  label?: string;
  /** Valor atual do progresso. */
  value: number;
  /** Valor máximo do progresso (padrão: 100). */
  max?: number;
  /** Cor da barra (qualquer cor CSS: "#22c55e", "rgb(...)", "hsl(...)", "red"...). */
  color?: string;
  /** Classe aplicada ao contêiner externo. */
  className?: string;
  /** Exibe a porcentagem ao lado do rótulo. */
  showPercentage?: boolean;
  /** Espessura da barra em pixels (padrão: 8). */
  thickness?: number;
  /** Cor do trilho (fundo) — opcional. */
  trackColor?: string;
}

export default function ProgressBar({
  label,
  value,
  max = 100,
  color,
  className,
  showPercentage = false,
  thickness = 8,
  trackColor,
}: ProgressBarProps) {
  const clampedMax = Math.max(1, max);
  const clampedValue = Math.min(Math.max(0, value), clampedMax);
  const pct = (clampedValue / clampedMax) * 100;

  return (
    <div className={clsx("w-full", className)}>
      {(label || showPercentage) && (
        <div className="mb-1 flex items-center justify-between gap-4
        ">
          {label ? (
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {label}
            </span>
          ) : <span />}
          {showPercentage && (
            <span className="text-xs sm:text-sm font-medium text-foreground/80">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}

      <div
        className="w-full rounded-full bg-foreground/10 dark:bg-foreground/15"
        style={{
          height: thickness,
          backgroundColor: trackColor ?? undefined,
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={clampedMax}
        aria-valuenow={clampedValue}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-[width,background-color] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color ?? "var(--color-primary, rgb(59,130,246))",
          }}
        />
      </div>
    </div>
  );
}

