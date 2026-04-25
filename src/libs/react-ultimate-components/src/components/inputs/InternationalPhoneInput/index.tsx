"use client";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";
import { PhoneInput, type PhoneInputProps } from "react-international-phone";
// Global styles for react-international-phone are imported in src/styles/index.css.

export interface InternationalPhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  /** Rótulo do campo (exibido acima do input). */
  label: string;
  /** Valor controlado no formato internacional (ex.: +55 11 99999-9999). */
  value: string;
  /** Dispara a cada digitação/seleção de país. Recebe o valor formatado. */
  onChange: (value: string) => void;

  /** País padrão (ex.: "br", "us"). Padrão: "br". */
  defaultCountry?: PhoneInputProps["defaultCountry"];
  /** Países preferidos no seletor (ex.: ["br","us","pt"]). */
  preferredCountries?: PhoneInputProps["preferredCountries"];
  /** Placeholder customizado. */
  placeholder?: string;

  /** Texto de ajuda (exibido quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;

  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Classe opcional para o container do componente PhoneInput (wrapper). */
  phoneContainerClassName?: string;
  /** Classe opcional para o input interno do PhoneInput. */
  inputClassName?: string;
  /** Classe opcional para o botão do seletor de país. */
  selectorButtonClassName?: string;
  /** Classe opcional para o dropdown/lista de países. */
  dropdownClassName?: string;
}

/**
 * Campo de telefone internacional com aparência padronizada (igual a TextInput/PasswordInput).
 *
 * - **Responsivo** e **dark mode** (usa tokens bg-background/text-foreground).
 * - **Acessível** (label, aria-invalid, aria-describedby).
 * - **Foco consistente** via `focus-within` no wrapper, igual aos demais inputs.
 *
 * Mercado BR:
 * - Forms de cadastro/checkout com celular e DDI
 * - Fluxos de WhatsApp/contato (com formatação internacional)
 */
const InternationalPhoneInput = forwardRef<
  HTMLInputElement,
  InternationalPhoneInputProps
>(
  ({
    id,
    name,
    label,
    value,
    onChange,
    defaultCountry = "br",
    preferredCountries,
    placeholder = "Seu telefone com DDI",
    helperText,
    errorMessage,
    disabled,
    containerClassName,
    className, // compat: aplicado junto ao wrapper do PhoneInput
    phoneContainerClassName,
    inputClassName,
    selectorButtonClassName,
    ...rest
  }) => {
    const reactId = useId();
    const inputId = id ?? `intl-phone-${reactId}`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    // === Mesma base visual dos inputs de texto/senha ===
    const baseWrapper =
      "flex w-full items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base border transition bg-white p-0";
    const baseBorder = "";
    const enabledFocus =
      "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-400/40";
    const paddingHeight = "pl-2 py-1 pr-2 sm:pr-3 my-1 h-10"; // alturas/espacamentos padronizados
    const disabledStyles = "opacity-70 cursor-not-allowed";
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

        {/* O próprio PhoneInput recebe as classes do WRAPPER, tal como o PasswordInput faz */}
        <PhoneInput
          value={value}
          onChange={onChange}
          defaultCountry={defaultCountry}
          preferredCountries={preferredCountries}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            baseWrapper,
            paddingHeight,
            disabled && disabledStyles,
            errorMessage ? errorStyles : clsx(baseBorder, enabledFocus),
            className,
            phoneContainerClassName
          )}
          inputClassName={clsx(
            // input interno precisa herdar a altura e ocupar todo o espaço
            "w-full h-full bg-transparent outline-none",
            "text-foreground placeholder:text-foreground/50",
            inputClassName
          )}
          countrySelectorStyleProps={{
            // Botão do seletor com borda à direita, altura total e paddings consistentes
            buttonClassName: clsx(
              "h-full",
              "px-2 sm:px-3 bg-transparent",
              selectorButtonClassName
            ),
          }}
          inputProps={{
            id: inputId,
            name,
            disabled,
            "aria-invalid": errorMessage ? true : undefined,
            "aria-describedby": errorMessage
              ? errorId
              : helperText
              ? helpId
              : undefined,
            ...rest,
          }}
        />

        {errorMessage ? (
          <p id={errorId} className="text-red-400 text-xs sm:text-sm mt-1">
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

InternationalPhoneInput.displayName = "InternationalPhoneInput";
export default InternationalPhoneInput;
