"use client";

import clsx from "clsx";
import { forwardRef } from "react";

export type Option = { label: string; value: string | number };

interface RadioGroupInputProps {
  // Defina as props necessárias aqui
  options: Option[];
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Se o grupo de rádio está desabilitado */
  disabled?: boolean;
  onSelectOption: (option : Option) => void;
}

const RadioGroupInput = forwardRef<HTMLDivElement, RadioGroupInputProps>(
  (
    {
      options,
      label,
      helperText,
      errorMessage,
      containerClassName,
      disabled,
      onSelectOption,
    }: RadioGroupInputProps,
    ref
  ) => {
    return (
      <div ref={ref} className={`flex flex-col gap-2 ${containerClassName}`}>
        <label className="flex font-medium text-xs sm:text-sm text-foreground gap-2 items-center">
          {label}
        </label>
        {options.map((option) => (
          <label
            key={option.value}
            className="text-sm sm:text-base flex items-center gap-2"
          >
            <input
              type="radio"
              name="radio-group"
              value={option.value}
              className="w-4 h-4 sm:w-5 sm:h-5 accent-primary-500"
              onChange={() => onSelectOption(option)}
              disabled={disabled}
            />
            {option.label}
          </label>
        ))}
        {errorMessage ? (
          <p className={clsx("text-red-400 text-xs sm:text-sm")}>
            {errorMessage}
          </p>
        ) : helperText && !disabled ? (
          <p className={clsx("text-foreground/70 text-xs sm:text-sm")}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

RadioGroupInput.displayName = "RadioGroupInput";

export default RadioGroupInput;
