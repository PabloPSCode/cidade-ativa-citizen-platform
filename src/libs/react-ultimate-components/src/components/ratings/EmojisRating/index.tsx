"use client";

import clsx from "clsx";
import React, { useMemo, useState } from "react";

export interface EmojisRatingProps {
  /** Valor atual (0–5). 0 = sem seleção. */
  value: number;
  /** Dispara quando o usuário escolhe uma nota (1..5). */
  onChange: (val: number) => void;
  /** (Opcional) Dispara ao passar o mouse sobre uma nota (preview). */
  onHoverChange?: (val: number | null) => void;

  /** Emojis (ou nós React) usados para cada nível. Tamanho deve ser 5. */
  emojis?: Array<React.ReactNode | string>;
  /** Rótulos exibidos para 1..5 (usado abaixo do componente). */
  labels?: string[]; // length 5
  /** Exibir o rótulo abaixo (padrão: true). */
  showLabels?: boolean;

  /** Estados visuais. */
  readOnly?: boolean;
  disabled?: boolean;

  /** Classes para customização. */
  containerClassName?: string;
  labelClassName?: string;
  emojiClassName?: string;
}

const DEFAULT_EMOJIS = ["😕", "😐", "🙂", "😃", "😍"];
const DEFAULT_LABELS = ["Muito ruim", "Ruim", "Ok", "Bom", "Excelente"];

/**
 * EmojisRating — Avaliação usando **emojis** no lugar de estrelas/barras.
 *
 * Padrões:
 * - **Responsivo**: tamanhos escalam por breakpoints.
 * - **Dark-mode**: tokens `bg-bg-card`, `text-foreground`, `border-border-card`.
 * - **Acessível**: `role="radiogroup"`/`role="radio"`, setas do teclado, Home/End.
 * - **UX**: rótulo muda no **hover** e acompanha o `value` controlado.
 */
export default function EmojisRating({
  value,
  onChange,
  onHoverChange,
  emojis = DEFAULT_EMOJIS,
  labels = DEFAULT_LABELS,
  showLabels = true,
  readOnly,
  disabled,
  containerClassName,
  labelClassName,
  emojiClassName,
}: EmojisRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = !readOnly && !disabled;

  // Label atual: prioriza preview de hover
  const currentLabel = useMemo(() => {
    const idx = Math.max(0, Math.min(5, Math.round(hoverValue ?? value ?? 0)));
    if (idx === 0) return "";
    return labels[idx - 1] ?? "";
  }, [hoverValue, value, labels]);

  const handleHover = (v: number | null) => {
    setHoverValue(v);
    onHoverChange?.(v);
  };

  const handleSelect = (v: number) => {
    if (!isInteractive) return;
    onChange(v);
    setHoverValue(null);
  };

  return (
    <div
      className={clsx(
        "inline-flex flex-col items-center gap-1 sm:gap-1.5 text-foreground",
        containerClassName
      )}
    >
      <div
        role="radiogroup"
        aria-label="Avaliação por emoji"
        className="flex items-center gap-1 sm:gap-1.5"
        onMouseLeave={() => handleHover(null)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const idx = i + 1;
          const selected = value === idx;
          const previewed = (hoverValue ?? 0) >= idx; // pré-visualização até a posição do hover
          const content = emojis[i] ?? DEFAULT_EMOJIS[i] ?? "⭐";

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={labels[i] ?? `Nota ${idx}`}
              disabled={!isInteractive}
              onMouseEnter={() => handleHover(idx)}
              onFocus={() => handleHover(idx)}
              onBlur={() => handleHover(null)}
              onClick={() => handleSelect(idx)}
              className={clsx(
                "inline-flex items-center justify-center rounded-md transition",
                "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10",
                previewed && "translate-y-[-1px]",
                !isInteractive && "opacity-70 cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40"
              )}
            >
              <span
                className={clsx(
                  "leading-none select-none",
                  "text-xl sm:text-2xl md:text-3xl",
                  // leve destaque visual no preview
                  previewed ? "scale-[1.08]" : "scale-100",
                  "transition-transform duration-150 ease-out",
                  emojiClassName
                )}
              >
                {content}
              </span>
            </button>
          );
        })}
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

