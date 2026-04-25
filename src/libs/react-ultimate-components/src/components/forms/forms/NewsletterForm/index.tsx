"use client";

import type React from "react";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /*** Label para o input */
  label: string;
  /** Texto auxiliar abaixo do input */
  helperText?: string;
  /** Mensagem de erro abaixo do input */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Classe opcional para o rótulo do input. */
  labelClassName?: string;
  /** Classe opcional para o elemento input. */
  inputClassName?: string;
  /** Classe opcional para o texto auxiliar. */
  helperTextClassName?: string;
}

function Input({
  label,
  helperText,
  containerClassName,
  labelClassName,
  inputClassName,
  helperTextClassName,
  ...props
}: InputProps) {
  return (
    <div className={clsx("flex flex-col", containerClassName)}>
      <label className={clsx("text-sm font-medium mb-1", labelClassName)}>
        {label}
      </label>
      <input
        className={clsx(
          "flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-sm placeholder-black/50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          "dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-white/50",
          inputClassName
        )}
        {...props}
      />
      {helperText && (
        <span
          className={clsx("text-xs text-gray-500 mt-1", helperTextClassName)}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto do botão */
  buttonTitle?: string;
  /** Ícones ou conteúdo do botão */
  children?: React.ReactNode;
  /** Classe opcional para o botão */
  className?: string;
}

function Button({
  buttonTitle,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "flex items-center justify-center rounded-md px-3 py-2 text-sm sm:text-base font-medium",
        "bg-primary-600 text-white",
        className
      )}
      type="button"
      {...props}
    >
      {buttonTitle || children}
    </button>
  );
}


interface FormProps {
  /** Título do formulário */
  formTitle?: string;
  /** Classe opcional para o formulário */
  className?: string;
  /** Função chamada ao enviar o formulário */
  onSubmit?: (e: React.FormEvent) => void;
  /** Conteúdo do formulário (inputs, botões, etc.) */
  children: React.ReactNode;
}

function Root({
  formTitle,
  className,
  onSubmit,
  children,
}: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };
  return (
    <form
      className={clsx("w-full flex flex-col max-w-xl  ", className)}
      onSubmit={handleSubmit}
    >
      {formTitle && (
        <h2 className="mb-2 text-base sm:text-lg font-semibold">{formTitle}</h2>
      )}
      <div className="w-full flex flex-col sm:flex-row gap-4 sm:items-end">
        {children}
      </div>
    </form>
  );
}


type NewsletterFormExtras = {
  Root: typeof Root;
  Input: typeof Input;
  Button: typeof Button;
};

function NewsletterForm(props: FormProps) {
  return <Root {...props} />;
}

type NewsletterFormComponent = typeof NewsletterForm & NewsletterFormExtras;

const NewsletterFormComponent: NewsletterFormComponent = Object.assign(NewsletterForm, {
  Root,
  Input,
  Button,
});

export default NewsletterFormComponent;
