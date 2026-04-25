"use client";

import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useMemo } from "react";

export interface TextAreaInputProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Tamanho máximo do texto (em caracteres). */
  maxTextLength: number;
  /** Tamanho atual do texto (em caracteres). */
  currentTextLength: number;
  /** Exibir contagem de caracteres restantes. */
  showTextLength?: boolean;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
}

/**
 * Campo de texto de área para formulários.
 * - **Responsivo**: tipografia e alturas variam por `fieldSize`.
 * - **Dark mode**: usa utilitários `bg-background` e `text-foreground`.
 * - **Acessível**: rótulo associado por `htmlFor`, `aria-invalid` e `aria-describedby`.
 */
const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  (
    {
      id,
      label,
      maxTextLength,
      currentTextLength,
      showTextLength = true,
      helperText,
      errorMessage,
      className,
      containerClassName,
      disabled,
      ...rest
    }: TextAreaInputProps,
    ref
  ) => {
    const inputId = id ?? "input";
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-errorMessage`;

    const remainingTextLength = useMemo(() => {
      return maxTextLength && currentTextLength
        ? maxTextLength - currentTextLength
        : maxTextLength;
    }, [maxTextLength, currentTextLength]);

    return (
      <div className={clsx("w-full", containerClassName)}>
        <label
          htmlFor={inputId}
          className={clsx(
            "flex font-medium text-xs sm:text-sm text-foreground"
          )}
        >
          {label}
        </label>

        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          rows={3}
          maxLength={maxTextLength}
          aria-invalid={!!errorMessage || undefined}
          aria-describedby={
            errorMessage ? errorId : helperText ? helpId : undefined
          }
          className={clsx(
            "flex w-full min-h-20 rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base",
            "border border-gray-300 dark:border-gray-600",
            "outline-none transition",
            "focus:border-primary-600 focus:ring-2 focus:ring-primary-300/30",
            "disabled:cursor-not-allowed disabled:opacity-70",
            "px-2 py-1 my-1",
            errorMessage &&
              "border-red-400 focus:border-red-400 focus:ring-red-400/40",
            className
          )}
          {...rest}
        />

        <div className="w-full flex items-center justify-between gap-4">
          {errorMessage ? (
            <p id={errorId} className={clsx("text-red-400 text-xs sm:text-sm")}>
              {errorMessage}
            </p>
          ) : helperText && !disabled ? (
            <p
              id={helpId}
              className={clsx("text-foreground/70 text-xs sm:text-sm")}
            >
              {helperText}
            </p>
          ) : null}

          {showTextLength && (
            <span className="text-xs text-foreground/70 text-right">
              Caracteres restantes: {remainingTextLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextAreaInput.displayName = "TextAreaInput";
export default TextAreaInput;
