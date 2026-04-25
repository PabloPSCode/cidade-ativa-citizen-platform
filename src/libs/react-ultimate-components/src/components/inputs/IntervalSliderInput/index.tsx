"use client";

import { getThemeColor } from "../../../utils/colors";
import clsx from "clsx";
import type { SliderProps } from "rc-slider";
import Slider from "rc-slider";
import React, { useMemo, useState } from "react";

type Pair = [number, number];

export interface IntervalSliderInputProps {
  /** Rótulo exibido acima do controle. */
  label: string;
  /** Texto auxiliar exibido abaixo quando não há erro. */
  helperText?: string;
  /** Mensagem de erro (tem prioridade sobre helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;

  /** Exibe os valores de início e fim. */
  showValues?: boolean;
  /** Formata a exibição dos valores. */
  formatValue?: (value: number) => string;

  /** Valor mínimo do slider. */
  minValue: number;
  /** Valor máximo do slider. */
  maxValue: number;
  /** Valores padrão do slider (não-controlado). */
  defaultValues?: Pair;
  /** Incremento do valor ao mover o slider. */
  stepValue?: number;

  /** Valores controlados (início, fim). */
  values?: Pair;
  /** Callback quando os valores mudarem. */
  onChange?: (values: Pair) => void;

  /** Desabilita o controle. */
  disabled?: boolean;

  /**
   * Estilos customizados (sobrescrevem os padrões).
   * Equivalente ao `styles` do rc-slider (v10+).
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
 * Slider intervalar (range) com dois *handles* (início/fim).
 * - Mostra os dois valores (opcional) com formatação customizável.
 * - Estilos customizáveis (track/rail/handle/dots).
 * - Responsivo, acessível e com suporte a dark mode.
 */
export default function IntervalSliderInput({
  label,
  helperText,
  errorMessage,
  containerClassName,
  showValues = true,
  formatValue = (v) => String(v),
  minValue = 0,
  maxValue = 100,
  stepValue = 1,
  defaultValues,
  values,
  onChange,
  disabled,
  customStyles,
  ...rest
}: IntervalSliderInputProps) {
  // ======= Cores do tema =======
  const primary500 = getThemeColor("--color-primary-500") ?? "#2563eb";
  const primary600 = getThemeColor("--color-primary-600") ?? "#1d4ed8";

  // ======= Estado inicial =======
  const initial: Pair = useMemo(() => {
    if (Array.isArray(values) && values.length === 2) return [values[0], values[1]];
    if (Array.isArray(defaultValues) && defaultValues.length === 2)
      return [defaultValues[0], defaultValues[1]];
    // fallback: 20% e 80% da faixa
    const span = maxValue - minValue;
    return [Math.round(minValue + 0.2 * span), Math.round(minValue + 0.8 * span)];
  }, [values, defaultValues, minValue, maxValue]);

  const [inner, setInner] = useState<Pair>(initial);
  const effective: Pair = Array.isArray(values) && values.length === 2 ? values : inner;

  // ======= Estilos (padrão + custom) =======
  const baseStyles: NonNullable<SliderProps["styles"]> = {
    rail: {
      backgroundColor: "var(--slider-rail, rgba(175,175,175,0.48))",
      height: 6,
      borderRadius: 999,
      ...customStyles?.rail,
    },
    track: {
      backgroundColor: customStyles?.track?.backgroundColor ?? primary600,
      height: 6,
      borderRadius: 999,
      ...customStyles?.track,
    },
    handle: {
      borderColor: customStyles?.handle?.borderColor ?? primary500,
      backgroundColor: customStyles?.handle?.backgroundColor ?? "#fff",
      borderWidth: 2,
      width: 18,
      height: 18,
      marginTop: -6,
      boxShadow: "0 0 0 3px rgba(37,99,235,0)",
      transition: "box-shadow .15s ease, transform .15s ease",
      opacity: 1,
      ...customStyles?.handle,
    },
  };

  // ======= Handler =======
  const handleChange = (val: number | number[]) => {
    const next = (Array.isArray(val) ? val : [val, val]) as Pair;
    if (!(Array.isArray(values) && values.length === 2)) setInner(next);
    onChange?.(next);
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
          "bg-transparent px-2 py-0",
          errorMessage &&
            "border-red-500 focus-within:border-red-600 focus-within:ring-red-400/40"
        )}
        aria-invalid={!!errorMessage || undefined}
      >
        {showValues && (
          <div className="flex justify-between text-foreground text-xs sm:text-sm font-medium mb-1">
            <span>{formatValue(effective[0])}</span>
            <span>{formatValue(effective[1])}</span>
          </div>
        )}

        <Slider
          range
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

      {errorMessage ? (
        <p className="text-red-600 text-xs sm:text-sm mt-1">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-foreground/70 text-xs sm:text-sm mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
