"use client";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import type {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
} from "react";
import { forwardRef, useId } from "react";

export interface SearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** Valor do estado da pesquisa */
  search: string;
  /** Função para atualizar o valor do estado da pesquisa */
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  /** Função a ser executada ao cancelar pesquisa */
  onCancelSearch?: () => void;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  variant?: "button-highlight" | "secondary";
}

/**
 * Campo para pesquisa com funcionalidade de limpar pesquisa.
 */
const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      id,
      search,
      setSearch,
      onCancelSearch,
      className,
      containerClassName,
      placeholder,
      disabled,
      onChange,
      variant = "secondary",
      ...rest
    }: SearchInputProps,
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `search-${reactId}`;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      onChange?.(e);
    };

    const MIN_SEARCH_LENGTH = 3;

    return (
      <div className={clsx("w-full", containerClassName)}>
        <div
          className={clsx(
            "flex w-full items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base border",
            "border-gray-300 dark:border-gray-600",
            variant === "button-highlight"
              ? "pl-2 py-0 pr-0 sm:pr-1 my-1 h-10"
              : "pl-2",
            disabled && "opacity-70 cursor-not-allowed",
            className
          )}
        >
          <input
            id={inputId}
            ref={ref}
            type="text"
            disabled={disabled}
            placeholder={
              placeholder || "Digite um texto para iniciar a pesquisa"
            }
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={handleChange}
            {...rest}
          />
          {search.length >= MIN_SEARCH_LENGTH ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onCancelSearch?.();
              }}
            >
              <XIcon className="text-foreground text-md sm:text-lg mx-2" />
            </button>
          ) : (
            <MagnifyingGlassIcon
              className={clsx(
                variant === "button-highlight"
                  ? "text-foreground text-lg sm:text-xl mr-2 bg-primary-500 p-1 rounded-md text-white scale-125"
                  : "text-foreground/50 text-md sm:text-lg ml-2"
              )}
            />
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
