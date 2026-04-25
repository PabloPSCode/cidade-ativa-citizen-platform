"use client";

import type React from "react";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useId, useState } from "react";

export interface TitleProps {
    /** Título do formulário. */
    title: string;
    /** Classe opcional para o título. */
    className?: string;
}

export function Title({
    title,
    className,
}: TitleProps) {
    return (
        <h2 className={clsx("text-md sm:text-lg font-bold text-foreground", className)}>
            {title}
        </h2>
    );
}


export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
}

/**
 * Campo de texto padrão para formulários.
 * - **Responsivo**: tipografia e alturas variam por `fieldSize`.
 * - **Dark mode**: usa utilitários `bg-background` e `text-foreground`.
 * - **Acessível**: rótulo associado por `htmlFor`, `aria-invalid` e `aria-describedby`.
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      helperText,
      errorMessage,
      className,
      containerClassName,
      disabled,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? "input";
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-errorMessage`;

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

        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={!!errorMessage || undefined}
          aria-describedby={
            errorMessage ? errorId : helperText ? helpId : undefined
          }
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
          {...rest}
        />

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
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
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
    },
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
            aria-describedby={
              errorMessage ? errorId : helperText ? helpId : undefined
            }
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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**Label para o botão */
  label: string;
  /** Texto de ajuda (exibido antes do label). */
  helperText?: string;
  /** Elementos filhos opcionais para o botão. */
  children?: React.ReactNode;
  /** Classe opcional para o botão. */
  className?: string;
}

function LoginButton({
  label,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={clsx(
        "w-full flex items-center justify-center rounded-md text-white bg-primary-500  py-2 sm:px-4 sm:py-3 text-sm font-semibold cursor-pointer",
        className
      )}
      {...rest}
    >
      {label}
      {children && children}
    </button>
  );
}


function ActionButton({
  label,
  helperText,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "flex items-center gap-4 text-foreground text-xs sm:text-sm font-medium cursor-pointer py-3 ",
        className
      )}
      type="button"
      {...rest}
    >
      {helperText && <span className="text-foreground/70">{helperText}</span>}
      {label}
      {children && children}
    </button>
  );
}


export interface SeparatorTextProps {
    /** Texto do separador */
    text: string;
    /** Classe opcional para o contêiner do separador */
    className?: string;
}
function SeparatorText({
    text,
    className,
}: SeparatorTextProps) {
    return (
        <div className={clsx("flex items-center w-full", className)}>
            <hr className="flex-grow border-t border-foreground/30" />
            <span className="mx-2 text-foreground/50 text-sm">{text}</span>
            <hr className="flex-grow border-t border-foreground/30" />
        </div>
    );
}


export interface SignInFormProps {
  /** Função chamada ao enviar o formulário */
  onSubmit?: (e: React.FormEvent) => void;
  /** Elementos filhos opcionais para o formulário */
  children?: React.ReactNode;
  /** Classe opcional para o contêiner do formulário */
  className?: string;
}

function Root({
  children,
  className,
  onSubmit,
}: SignInFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        "min-w-sm flex flex-col p-4 rounded-md",
        "border border-foreground/20",
        className
      )}
    >
      {children}
    </form>
  );
}


type SignInFormExtras = {
  Root: typeof Root;
  Title: typeof Title;
  TextInput: typeof TextInput;
  PasswordInput: typeof PasswordInput;
  LoginButton: typeof LoginButton;
  ActionButton: typeof ActionButton;
  SeparatorText: typeof SeparatorText;
};

function SignInForm(props: SignInFormProps) {
  return <Root {...props} />;
}

type SignInFormComponent = typeof SignInForm & SignInFormExtras;

const SignInFormComponent: SignInFormComponent = Object.assign(SignInForm, {
  Root,
  Title,
  TextInput,
  PasswordInput,
  LoginButton,
  ActionButton,
  SeparatorText,
});

export default SignInFormComponent;
