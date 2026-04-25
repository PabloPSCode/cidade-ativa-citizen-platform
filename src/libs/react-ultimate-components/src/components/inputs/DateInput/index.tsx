"use client";

import { CalendarIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { ptBR } from "date-fns/locale/pt-BR";
import {
  forwardRef,
  useState,
  type Dispatch,
  type InputHTMLAttributes,
  type SetStateAction,
} from "react";
import DatePicker from "react-datepicker";

export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Data selecionada. */
  date?: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
}

/**
 * Campo de seleção de data.
 */
const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      id,
      label,
      date,
      setDate,
      helperText,
      errorMessage,
      className,
      containerClassName,
      disabled,
      ...rest
    }: DateInputProps,
    ref
  ) => {
    const inputId = id ?? "input";
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-errorMessage`;

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const toggleCalendar = () => setIsCalendarOpen((v) => !v);

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

        <div
          className={clsx(
            "flex w-full h-10 items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base",
            "border border-gray-300 dark:border-gray-600",
            "outline-none transition",
            "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-300/30",
            "disabled:cursor-not-allowed disabled:opacity-70",
            errorMessage &&
            "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/40",
            "px-2 py-1 my-1 gap-2"
          )}
        >
          <button onClick={toggleCalendar} disabled={disabled} type="button">
            <CalendarIcon
              className="text-foreground/70 text-md sm:text-lg"
              weight="duotone"
            />
          </button>

          <DatePicker
            id={inputId}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/aaaa"
            //@ts-expect-error different type
            ref={ref}
            selected={date}
            //@ts-expect-error different type
            onChange={(date) => setDate(date as Date)}
            open={isCalendarOpen}
            disabled={disabled}
            aria-invalid={!!errorMessage || undefined}
            aria-describedby={
              errorMessage ? errorId : helperText ? helpId : undefined
            }
            className={clsx("outline-none", className)}
            {...rest}
          />
        </div>

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

DateInput.displayName = "DateInput";
export default DateInput;
