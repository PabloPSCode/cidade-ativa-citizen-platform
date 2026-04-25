"use client";
import { collapseLongString } from "../../../utils/format";
import clsx from "clsx";
import { forwardRef, useId, useMemo } from "react";
import Select, {
  type GroupBase,
  type Props as RSProps,
  type SelectInstance,
  type SingleValue,
} from "react-select";

/** Opção básica do select. */
export type Option = {
  label: string;
  value: string | number;
};

type RSBaseProps = RSProps<Option, false, GroupBase<Option>>;

export interface SelectInputProps
  extends Omit<
    RSBaseProps,
    | "options"
    | "onChange"
    | "className"
    | "classNamePrefix"
    | "styles"
    | "isDisabled"
    | "isSearchable"
    | "placeholder"
  > {
  /** Rótulo exibido acima do campo. */
  label: string;
  /** Lista de opções. */
  options: Option[];
  /** Callback ao selecionar uma opção. */
  onSelectOption?: (selected: Option | null) => void;
  /** Mensagem de ajuda (exibida quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (tem prioridade sobre helperText). */
  errorMessage?: string;
  /** Variante de largura. */
  widthVariant?: "mid" | "full";
  /** Habilita busca por texto. */
  isSearchable?: boolean;
  /** Desabilita o campo. */
  isDisabled?: boolean;
  /** Placeholder exibido no input. */
  placeholder?: string;
  /** Classe aplicada ao contêiner externo. */
  containerClassName?: string;
  /** Classe aplicada ao rótulo. */
  labelClassName?: string;
    /** Mensagem exibida quando nenhuma opção é encontrada na busca. */
  notFoundOptionsMessage?: string;
}

/**
 * Select baseado em `react-select` com:
 * - Dark mode via CSS variables e tokens utilitários;
 * - Responsividade (tipografia e alturas por breakpoint);
 * - Acessibilidade (label, aria-attrs);
 * - Tipagem correta (SingleValue).
 */
const SelectInput = forwardRef<SelectInstance<Option>, SelectInputProps>(
  (
    {
      label,
      options,
      widthVariant = "full",
      isSearchable = true,
      isDisabled,
      helperText,
      errorMessage,
      containerClassName,
      labelClassName,
      onSelectOption,
      placeholder = "Selecione...",
      notFoundOptionsMessage,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const selectId = `select-${reactId}`;
    const helpId = `${selectId}-help`;
    const errorId = `${selectId}-error`;

    // Limita rótulos muito longos conforme variante de largura
    const [maxMid, maxFull] = [32, 80];
    const formattedOptions = useMemo(() => {
      const max = widthVariant === "mid" ? maxMid : maxFull;
      return options
        .map((o) => ({
          value: o.value,
          label: collapseLongString(o.label, max),
        }))
        .sort((a, b) =>
          String(a.label).localeCompare(String(b.label), "pt-BR", {
            sensitivity: "base",
          })
        );
    }, [maxFull, maxMid, options, widthVariant]);

    // Estilos CSS-in-JS do react-select usando CSS vars para dark/light
    const styles = {
      control: (base, state) => ({
        ...base,
        minHeight: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "var(--color-bg, transparent)",
        borderColor: state.isFocused
          ? "var(--color-primary-600, #2563eb)"
          : "var(--color-border, rgba(107,114,128,.6))",
        boxShadow: state.isFocused
          ? "0 0 0 2px color-mix(in srgb, var(--color-primary-400, #60a5fa) 40%, transparent)"
          : "none",
        ":hover": {
          borderColor: "var(--color-primary-600, #2563eb)",
        },
        // tipografia responsiva
        fontSize: "14px",
      }),
      valueContainer: (base) => ({
        ...base,
        padding: "0 10px",
      }),
      input: (base) => ({
        ...base,
        color: "var(--color-foreground, #111827)",
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--color-foreground, #111827)",
      }),
      placeholder: (base) => ({
        ...base,
        color:
          "color-mix(in srgb, var(--color-foreground, #111827) 50%, transparent)",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "var(--color-card, white)",
        border: "1px solid var(--color-border, rgba(107,114,128,.6))",
        borderRadius: 8,
        overflow: "hidden",
      }),
      option: (base, state) => ({
        ...base,
        fontSize: "14px",
        backgroundColor: state.isSelected
          ? "#f4f3f3"
          : state.isFocused
          ? "#ebebeb"
          : "#f3f3f3",
        color: "black",
        ":active": {
          backgroundColor: "#ebebeb",
        },
      }),
      indicatorsContainer: (base) => ({
        ...base,
        color: "var(--color-foreground, #111827)",
      }),
      dropdownIndicator: (base, state) => ({
        ...base,
        transition: "transform .2s",
        transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
        color: "var(--color-foreground, #111827)",
        ":hover": { color: "var(--color-primary-600, #2563eb)" },
      }),
      clearIndicator: (base) => ({
        ...base,
        color: "var(--color-foreground, #111827)",
        ":hover": { color: "var(--color-primary-600, #2563eb)" },
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 5000,
      }),
    } satisfies RSBaseProps["styles"];

    const handleChange = (opt: SingleValue<Option>) => {
      onSelectOption?.(opt ?? null);
      // Se você também passar `onChange` pelo `...rest`, react-select lida internamente
    };

    return (
      <div className={clsx("w-full", containerClassName)}>
        <label
          htmlFor={selectId}
          className={clsx(
            "block font-medium text-xs sm:text-sm text-foreground mb-1",
            labelClassName
          )}
        >
          {label}
        </label>

        <div
          className={clsx(
            "rounded-md bg-background",
            isDisabled && "opacity-70 cursor-not-allowed",
            errorMessage && "ring-1 ring-red-500 focus-within:ring-red-400/40"
          )}
          aria-invalid={!!errorMessage || undefined}
        >
          <Select
            ref={ref}
            inputId={selectId}
            className={clsx(
              // permite ajustar largura por variante
              widthVariant === "mid" ? "max-w-sm" : "w-full",
              "text-foreground"
            )}
            classNamePrefix="wcbr-select"
            options={formattedOptions}
            styles={styles}
            isDisabled={isDisabled}
            isSearchable={isSearchable}
            placeholder={placeholder}
            onChange={handleChange}
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : undefined
            } // evita clipping em modais/overflows
            menuPosition="fixed"
            noOptionsMessage={({ inputValue }) =>
              !inputValue
                ? inputValue
                : notFoundOptionsMessage ?? "Não foi encontrado nenhum dado nesta lista para a pesquisa " +
                  "'" +
                  inputValue +
                  "'"
            }
            {...rest}
          />
        </div>

        {errorMessage ? (
          <p id={errorId} className="text-red-600 text-xs sm:text-sm mt-1">
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

SelectInput.displayName = "SelectInput";
export default SelectInput;
