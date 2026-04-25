"use client";

import clsx from "clsx";
import React from "react";
import { Check } from "@phosphor-icons/react";

type StepLike = string | { label: string };

export interface StepProgressProps {
  /** Lista de passos. Pode ser array de strings ou objetos `{ label }`. */
  steps: StepLike[];
  /**
   * Índice do passo atual (base **0**).
   * Ex.: `0` = primeiro passo, `1` = segundo...
   */
  currentStep: number;
  /** Exibir na vertical (mobile-friendly). */
  vertical?: boolean;
  /** Classes extras para o container externo. */
  className?: string;
}

/**
 * StepProgress — indicador de progresso por etapas.
 *
 * Padrões:
 * - **Responsivo**: horizontal por padrão; pode ser vertical via `vertical`.
 * - **Dark-mode**: usa tokens `bg-background`, `text-foreground` e cores do tema.
 * - **Acessível**: usa `<ol>` e ARIA (`aria-current` no passo atual).
 *
 * Convenção visual (similar à imagem):
 * - Passos concluídos: círculo verde com ✓ e conector verde.
 * - Passo atual: círculo azul com número e rótulo em destaque.
 * - Próximos passos: círculo azul e conector azul.
 */
export default function StepProgress({
  steps,
  currentStep,
  vertical = false,
  className,
}: StepProgressProps) {
  const normalized = steps.map((s) => (typeof s === "string" ? { label: s } : s));
  const lastIndex = normalized.length - 1;

  const renderDot = (index: number) => {
    const isDone = index < currentStep;
    // const isCurrent = index === currentStep;

    const base =
      "flex items-center justify-center rounded-full shrink-0 transition-colors";

    if (isDone) {
      return (
        <span
          className={clsx(
            base,
            "h-6 w-6 sm:h-7 sm:w-7 bg-success-500 text-white"
          )}
          aria-hidden
        >
          <Check weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
      );
    }

    // atual e futuros = azul (info)
    return (
      <span
        className={clsx(
          base,
          "h-6 w-6 sm:h-7 sm:w-7 bg-info-600 text-white"
        )}
        aria-hidden
      >
        <span className="text-[11px] sm:text-xs font-semibold">{index + 1}</span>
      </span>
    );
  };

  const connectorClass = (index: number) =>
    clsx(
      vertical
        ? "w-[2px] h-6 sm:h-8 mx-auto"
        : "h-[2px] w-8 sm:w-12 md:w-16 my-auto",
      index < currentStep ? "bg-success-500" : "bg-info-500",
      "rounded"
    );

  return (
    <nav
      aria-label="Progresso de etapas"
      className={clsx(
        "w-fit bg-background text-foreground",
        vertical ? "py-2" : "py-3",
        className
      )}
    >
      <ol
        className={clsx(
          vertical
            ? "flex flex-col items-start gap-3 sm:gap-4"
            : "flex flex-row items-center gap-3 sm:gap-4"
        )}
      >
        {normalized.map((step, idx) => {
          const isCurrent = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <React.Fragment key={`${step.label}-${idx}`}>
              <li
                className={clsx(
                  "flex items-center",
                  vertical ? "gap-3" : "gap-2"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {renderDot(idx)}
                <span
                  className={clsx(
                    "text-sm sm:text-base",
                    isCurrent ? "font-semibold text-foreground" : "text-foreground",
                    isDone && "opacity-90"
                  )}
                >
                  {step.label}
                </span>
              </li>

              {/* Conector entre os passos */}
              {idx !== lastIndex && (
                <div
                  aria-hidden
                  className={connectorClass(idx)}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

