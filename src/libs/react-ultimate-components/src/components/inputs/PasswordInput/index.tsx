"use client";

import { EyeClosed as EyeClosedIcon, Eye as EyeIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useId, useState } from "react";

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Exibe o botão de mostrar/ocultar senha. */
  showPasswordVisibility?: boolean;
}

/**
 * Campo de senha com suporte a foco, erro e modo escuro.
 * - Usa `focus-within:` no wrapper para aplicar anel/borda ao focar o input interno.
 * - `errorMessage` sobrescreve cores de foco para garantir contraste correto.
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      label,
      helperText,
      errorMessage,
      className,
      containerClassName,
      disabled,
      showPasswordVisibility = true,
      autoComplete = "current-password",
      ...rest
    }: PasswordInputProps,
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `pwd-${reactId}`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    const [showPassword, setShowPassword] = useState(false);

    const baseWrapper =
      "flex w-full items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base border transition";
    const enabledFocus =
      "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-400/40";
    const baseBorder = "border-gray-300 dark:border-gray-600";
    const padding = "pl-2 py-1 pr-2 sm:pr-3 my-1 h-10";

    // Quando há erro, reforça as cores e também no estado de foco
    const errorStyles =
      "border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/40";

    return (
      <div className={clsx("w-full", containerClassName)}>
        <label
          htmlFor={inputId}
          className="block font-medium text-xs sm:text-sm text-foreground"
        >
          {label}
        </label>

        <div
          className={clsx(
            baseWrapper,
            padding,
            disabled && "opacity-70 cursor-not-allowed",
            errorMessage ? errorStyles : clsx(baseBorder, enabledFocus),
            className
          )}
        >
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={!!errorMessage || undefined}
            aria-describedby={errorMessage ? errorId : helperText ? helpId : undefined}
            className="w-full bg-transparent outline-none"
            {...rest}
          />

          {showPasswordVisibility && (
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              // Evita roubar foco do input ao clicar no botão
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((v) => !v)}
              disabled={disabled}
              className={clsx(
                "ml-2 inline-flex items-center justify-center text-foreground/70 hover:text-foreground transition",
                disabled && "pointer-events-none"
              )}
            >
              {showPassword ? (
                <EyeClosedIcon size={20} weight="light" />
              ) : (
                <EyeIcon size={20} weight="light" />
              )}
            </button>
          )}
        </div>

        {errorMessage ? (
          <p id={errorId} className="text-red-400 text-xs sm:text-sm mt-1">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helpId} className="text-foreground/70 text-xs sm:text-sm mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
