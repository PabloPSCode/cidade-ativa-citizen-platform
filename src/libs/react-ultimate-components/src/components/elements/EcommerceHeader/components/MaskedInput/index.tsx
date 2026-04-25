"use client";

import clsx from "clsx";
import React, { forwardRef, useId } from "react";
import { IMaskInput } from "react-imask";

export interface MaskedTextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Máscara de entrada (ex.: "(00) 00000-0000", "000.000.000-00"). */
  mask: string;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Retorna valor “cru” (sem máscara). Padrão: false (retorna mascarado). */
  unmask?: boolean;
  /**
   * onChange “normal” do React. Recebe um SyntheticEvent com `target.value`
   * mapeado a partir do IMask `onAccept`.
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback opcional direto do valor aceito (já mapeado para string). */
  onAcceptValue?: (value: string) => void;
}

/**
 * Campo de texto com **máscara** usando `react-imask`.
 * - Totalmente tipado com props nativas de `<input>`.
 * - Dark mode e responsividade alinhados ao restante da UI.
 * - Erro/foco acessíveis via `aria-invalid`/`aria-describedby`.
 */
const MaskedTextInput = forwardRef<HTMLInputElement, MaskedTextInputProps>(
  (
    {
      id,
      label,
      mask,
      helperText,
      errorMessage,
      className,
      containerClassName,
      unmask = false,
      onChange,
      onAcceptValue,
      disabled,
      ...rest
    }: MaskedTextInputProps,
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `masked-${reactId}`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    const handleAccept = (value: unknown) => {
      const str = String(value ?? "");
      onAcceptValue?.(str);

      if (onChange) {
        // Cria um SyntheticEvent mínimo para compat com controlados
        const evt = {
          target: { value: str } as unknown as EventTarget & HTMLInputElement,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(evt);
      }
    };

    return (
      <div className={clsx("w-full", containerClassName)}>
        <label
          htmlFor={inputId}
          className="block font-medium text-xs sm:text-sm text-foreground"
        >
          {label}
        </label>
        {/* @ts-expect-error MaskInput has different props */}
        <IMaskInput
          id={inputId}
          // mapeia o ref para o <input> interno
          inputRef={ref}
          mask={mask}
          // "typed" = retorna string crua; false = valor mascarado
          unmask={unmask ? "typed" : false}
          // acessibilidade
          aria-invalid={!!errorMessage || undefined}
          aria-describedby={
            errorMessage ? errorId : helperText ? helpId : undefined
          }
          // estados
          disabled={disabled}
          className={clsx(
            "flex w-full h-10 rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base",
            "border border-gray-300 dark:border-gray-600",
            "outline-none transition",
            "focus:border-primary-600 focus:ring-2 focus:ring-primary-300/30",
            "disabled:cursor-not-allowed disabled:opacity-70",
            "px-2 py-1 my-1",
            errorMessage &&
              "border-red-400 focus:border-red-400 focus:ring-red-400/40",
            className
          )}
          // repassa demais props nativas (value, name, placeholder, etc.)
          {...rest}
          // usa o ciclo do IMask; converte para onChange “normal”
          onAccept={handleAccept}
        />

        {errorMessage ? (
          <p id={errorId} className="text-red-600 text-xs sm:text-sm mt-1">
            {errorMessage}
          </p>
        ) : helperText && !disabled ? (
          <p id={helpId} className="text-foreground/70 text-xs sm:text-sm mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

MaskedTextInput.displayName = "MaskedTextInput";
export default MaskedTextInput;
