"use client";

import { getThemeColor } from "../../../utils/colors";
import clsx from "clsx";
import type { SliderProps } from "rc-slider";
import Slider from "rc-slider";
import React, { useMemo, useState } from "react";

type Value = number | number[];

export interface SliderInputProps {
  /** Rótulo exibido acima do controle. */
  label: string;
  /** Texto auxiliar exibido abaixo quando não há erro. */
  helperText?: string;
  /** Mensagem de erro (tem prioridade sobre helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Exibe um tooltip com o valor atual do handle. */
  showValue?: boolean;
  /** Formata o valor exibido no tooltip. */
  formatValue?: (value: number) => string;
  /** Valor mínimo do slider. */
  minValue: number;
  /** Valor máximo do slider. */
  maxValue: number;
  /** Valor padrão do slider. */
  defaultValue?: number;
  /** Incremento do valor ao mover o slider. */
  stepValue?: number;
  /**
   * Controlado: valor atual. Quando passado, o componente não mantém estado interno.
   * Use em conjunto com `onChange`.
   */
  value?: number;
  /** Função chamada quando o valor do slider muda. */
  onChange?: (value: number | number[]) => void;
  /** Desabilita o controle. */
  disabled?: boolean;
  /**
   * Estilos customizados (sobrescrevem os padrões).
   * Equivalente ao `styles` do rc-slider (v10+), mas opcional e com tipagem explícita.
   */
  customStyles?: {
    rail?: React.CSSProperties;
    track?: React.CSSProperties;
    handle?: React.CSSProperties;
    dot?: React.CSSProperties;
    activeDot?: React.CSSProperties;
    marks?: React.CSSProperties;
    steps?: React.CSSProperties;
  };
}

/**
 * Slider de valor único com suporte a:
 * - Tooltip de valor no *handle* (opcional)
 * - Estilização customizável (track/rail/handle/dots)
 * - Padrões consistentes (dark mode, foco, erro, desabilitado)
 */
export default function SliderInput({
  label,
  helperText,
  errorMessage,
  containerClassName,
  showValue = true,
  formatValue = (v) => String(v),
  minValue = 0,
  maxValue = 100,
  stepValue = 1,
  defaultValue,
  value,
  onChange,
  disabled,
  customStyles,
  ...rest
} : SliderInputProps) {
  // ======= Cores do tema (fallback se não houver CSS var) =======
  const primary500 = getThemeColor("--color-primary-500")
  const primary600 = getThemeColor("--color-primary-600")

  // ======= Estado interno quando não-controlado =======
  const initial = useMemo(() => {
    if (typeof value === "number") return value;
    if (typeof defaultValue === "number") return defaultValue;
    // centro por padrão
    return Math.floor((Number(maxValue) + Number(minValue)) / 2);
  }, [value, defaultValue, minValue, maxValue]);

  const [inner, setInner] = useState<number>(initial);
  const effective = typeof value === "number" ? value : inner;

  // ======= Estilos (padrão + custom) =======
  const baseStyles: NonNullable<SliderProps["styles"]> = {
    rail: {
      backgroundColor:"var(--slider-rail, rgba(175, 175, 175, 0.481))",
      height: 6,
      borderRadius: 999,
    },
    track: {
      backgroundColor: customStyles?.track?.backgroundColor ?? primary600,
      height: 6,
      borderRadius: 999,
    },
    handle: {
      borderColor: disabled? primary500 : customStyles?.handle?.borderColor ?? primary500,
      backgroundColor: customStyles?.track?.backgroundColor ?? "#fff",
      borderWidth: 2,
      width: 18,
      height: 18,
      marginTop: -6, // centraliza no trilho de 6px
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0)",
      transition: "box-shadow .15s ease, transform .15s ease",
      opacity: 1,
      ...customStyles?.handle,
    },
  };

  if (customStyles?.rail)
    baseStyles.rail = { ...baseStyles.rail, ...customStyles.rail };
  if (customStyles?.track)
    baseStyles.track = { ...baseStyles.track, ...customStyles.track };

  const [trackValue, setTrackValue] = useState(initial);

  // ======= Handlers =======
  const handleChange = (val: Value) => {
    const num = Array.isArray(val) ? (val[0] as number) : (val as number);
    if (typeof value !== "number") setInner(num); // não-controlado
    onChange?.(num);
    setTrackValue(num);
  };

  return (
    <div className={clsx("w-full", containerClassName)}>
      {label && (
        <label className="block font-medium text-xs sm:text-sm text-foreground mb-1">
          {label}
        </label>
      )}

      <div
        className={clsx(
          " bg-background px-2 py-0",
          errorMessage &&
            "border-red-500 focus-within:border-red-600 focus-within:ring-red-400/40"
        )}
        aria-invalid={!!errorMessage || undefined}
      >
        <div className="w-full flex items-center gap-2">
          {showValue && (
            <div
              className={clsx(
                "text-foreground text-xs sm:text-sm font-medium whitespace-nowrap",
                "px-1 py-0.5 -ml-3 ",
              )}
              role="status"
              aria-live="polite"
            >
              {formatValue(trackValue)}
              <span
                className="absolute left-1/2 top-full -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid currentColor",
                  color: "var(--tooltip-bg, currentColor)",
                }}
              />
            </div>
          )}
          <Slider
            min={minValue}
            max={maxValue}
            step={stepValue}
            value={effective}
            onChange={handleChange}
            disabled={disabled}
            styles={baseStyles}
            {...rest}
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="text-red-600 text-xs sm:text-sm mt-1">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-foreground/70 text-xs sm:text-sm mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

