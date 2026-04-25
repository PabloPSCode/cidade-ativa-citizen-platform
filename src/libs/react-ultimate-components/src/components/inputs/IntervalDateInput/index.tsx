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

export interface IntervalDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo do campo de data inicial (exibido acima do input). */
  labelStartDate: string;
  /** Rótulo do campo de data final (exibido acima do input). */
  labelEndDate: string;
  /** Data selecionada. */
  startDate?: Date;
  /** Função para atualizar a data inicial selecionada. */
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate?: Date;
  /** Função para atualizar a data final selecionada. */
  setEndDate: Dispatch<SetStateAction<Date>>;
  /** Texto de ajuda (exibido abaixo do input da data inicial quando não há erro). */
  helperTextStartDate?: string;
  /** Texto de ajuda (exibido abaixo do input da data final quando não há erro). */
  helperTextEndDate?: string;
  /** Mensagem de erro para a data inicial (prioridade sobre o helperText). */
  errorMessageStartDate?: string;
  /** Mensagem de erro para a data final (prioridade sobre o helperText). */
  errorMessageEndDate?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
}

/**
 * Campo de seleção de data.
 */
const IntervalDateInput = forwardRef<HTMLInputElement, IntervalDateInputProps>(
  (
    {
      id,
      labelStartDate,
      labelEndDate,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      helperTextStartDate,
      helperTextEndDate,
      errorMessageStartDate,
      errorMessageEndDate,
      className,
      containerClassName,
      disabled,
      ...rest
    }: IntervalDateInputProps,
    ref
  ) => {
    const inputId = id ?? "input";
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-errorMessage`;

    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);

    const toggleStartDateCalendar = () => setIsStartOpen((v) => !v);
    const toggleEndDateCalendar = () => setIsEndOpen((v) => !v);

    return (
      <div className={clsx("w-full flex flex-col sm:flex-row items-center gap-4", containerClassName)}>
        <div className={clsx("w-full", containerClassName)}>
          <label
            htmlFor={inputId}
            className={clsx(
              "flex font-medium text-xs sm:text-sm text-foreground"
            )}
          >
            {labelStartDate}
          </label>

          <div
            className={clsx(
              "flex w-full h-10 items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base",
              "border border-gray-300 dark:border-gray-600",
              "outline-none transition",
              "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-300/30",
              "disabled:cursor-not-allowed disabled:opacity-70",
              errorMessageStartDate &&
              "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/40",
              "px-2 py-1 my-1 gap-2"
            )}
          >
           <button onClick={toggleStartDateCalendar}>
             <CalendarIcon className="text-foreground/70 text-md sm:text-lg" weight="duotone" />
           </button>

            <DatePicker
              id={inputId}
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              //@ts-expect-error different type
              ref={ref}
              selected={startDate}
              //@ts-expect-error different type
              onChange={(date) => setStartDate(date as Date)}
              open={isStartOpen}
              disabled={disabled}
              aria-invalid={!!errorMessageStartDate || undefined}
              aria-describedby={
                errorMessageStartDate ? errorId : helperTextStartDate ? helpId : undefined
              }
              className={clsx("outline-none", className)}
              {...rest}
            />
          </div>

          {errorMessageStartDate ? (
            <p id={errorId} className={clsx("text-red-400 text-xs sm:text-sm")}>
              {errorMessageStartDate}
            </p>
          ) : helperTextStartDate && !disabled ? (
            <p
              id={helpId}
              className={clsx("text-foreground/70 text-xs sm:text-sm")}
            >
              {helperTextStartDate}
            </p>
          ) : null}
        </div>

        <div className={clsx("w-full", containerClassName)}>
          <label
            htmlFor={inputId}
            className={clsx(
              "flex font-medium text-xs sm:text-sm text-foreground"
            )}
          >
            {labelEndDate}
          </label>

          <div
            className={clsx(
              "flex w-full h-10 items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base",
              "border border-gray-300 dark:border-gray-600",
              "outline-none transition",
              "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-300/30",
              "disabled:cursor-not-allowed disabled:opacity-70",
              errorMessageEndDate &&
              "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/40",
              "px-2 py-1 my-1 gap-2"
            )}
          >
            <button onClick={toggleEndDateCalendar}>
              <CalendarIcon className="text-foreground/70 text-md sm:text-lg" weight="duotone" />
            </button>

            <DatePicker
              id={inputId}
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              //@ts-expect-error different type
              ref={ref}
              selected={endDate}
              //@ts-expect-error different type
              onChange={(date) => setEndDate(date as Date)}
              open={isEndOpen}
              disabled={disabled}
              aria-invalid={!!errorMessageEndDate || undefined}
              aria-describedby={
                errorMessageEndDate ? errorId : helperTextEndDate ? helpId : undefined
              }
              className={clsx("outline-none", className)}
              {...rest}
            />
          </div>

          {errorMessageEndDate ? (
            <p id={errorId} className={clsx("text-red-400 text-xs sm:text-sm")}>
              {errorMessageEndDate}
            </p>
          ) : helperTextEndDate && !disabled ? (
            <p
              id={helpId}
              className={clsx("text-foreground/70 text-xs sm:text-sm")}
            >
              {helperTextEndDate}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

IntervalDateInput.displayName = "IntervalDateInput";
export default IntervalDateInput;
