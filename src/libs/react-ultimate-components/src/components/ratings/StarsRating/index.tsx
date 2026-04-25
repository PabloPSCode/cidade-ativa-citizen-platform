"use client";

import { Rating, type RatingProps } from "@smastrom/react-rating";
import clsx from "clsx";
import { useMemo, useState } from "react";

export interface StarsRatingProps extends RatingProps {
  /** Rótulos para notas inteiras 1..5 (0 = sem rótulo). */
  labels?: string[]; // length 5 → [1,2,3,4,5]
  /** Exibir rótulo abaixo das estrelas (padrão: true). */
  showLabels?: boolean;
  /** Classes para o container externo. */
  containerClassName?: string;
  /** Classes para o texto do rótulo. */
  labelClassName?: string;
}

export default function StarsRating({
  labels = ["Muito ruim", "Ruim", "Ok", "Bom", "Excelente"],
  showLabels = true,
  containerClassName,
  labelClassName,
  value,
  onChange, // <-- interceptamos para limpar hoverValue
  onHoverChange, // <-- ainda disponibilizamos
  ...rest
}: StarsRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // Map 0..5 → label (0 = sem rótulo; 1..5 pegam labels[0..4])
  const clamp05 = (v: number | null | undefined) =>
    Math.max(0, Math.min(5, Math.round(v ?? 0)));

  const currentLabel = useMemo(() => {
    const idx = clamp05(hoverValue ?? value ?? 0);
    return idx === 0 ? "" : labels[idx - 1] ?? "";
  }, [hoverValue, value, labels]);

  return (
    <div
      className={clsx(
        "inline-flex flex-col items-center gap-1 sm:gap-1.5 text-foreground",
        containerClassName
      )}
    >
      {/* Wrapper define tamanho responsivo das estrelas */}
      <div
        className="w-16 sm:w-20 md:w-24"
        onMouseLeave={() => setHoverValue(null)} // ← limpa hover ao sair
      >
        <Rating
          style={{ maxWidth: "100%" }}
          value={value}
          onChange={(v: number) => {
            onChange?.(v);
            setHoverValue(null); // ← garante que o rótulo reflita o novo value
          }}
          onHoverChange={(v) => {
            setHoverValue(v);
            onHoverChange?.(v ?? null);
          }}
          {...rest}
        />
      </div>

      {showLabels && (
        <span
          className={clsx(
            "min-h-4 text-xs sm:text-sm text-foreground/80",
            labelClassName
          )}
          aria-live="polite"
        >
          {currentLabel}
        </span>
      )}
    </div>
  );
}

