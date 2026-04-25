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
  /** Funcao para atualizar o valor do estado da pesquisa */
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  /** Funcao a ser executada ao cancelar pesquisa */
  onCancelSearch?: () => void;
  /** Classe opcional para o conteiner externo. */
  containerClassName?: string;
  variant?: "button-highlight" | "secondary" | "citizen";
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
    const showClearButton = search.length >= MIN_SEARCH_LENGTH;

    if (variant === "citizen") {
      return (
        <div className={clsx("w-full", containerClassName)}>
          <div
            className={clsx(
              "flex w-full items-center gap-3 rounded-[1.85rem] border border-border-card/70 bg-bg-card p-3 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)]",
              disabled && "cursor-not-allowed opacity-70",
              className
            )}
          >
            <div className="flex min-w-0 flex-1 items-center rounded-[1.3rem] bg-black/[0.04] px-4 py-3 dark:bg-white/[0.06]">
              <input
                id={inputId}
                ref={ref}
                type="text"
                disabled={disabled}
                placeholder={
                  placeholder || "Digite um texto para iniciar a pesquisa"
                }
                className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/55 sm:text-base"
                value={search}
                onChange={handleChange}
                {...rest}
              />
            </div>

            {showClearButton ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  onCancelSearch?.();
                }}
                className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-foreground text-background transition hover:opacity-90"
                aria-label="Limpar pesquisa"
              >
                <XIcon className="text-lg sm:text-xl" />
              </button>
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-foreground text-background">
                <MagnifyingGlassIcon className="text-xl sm:text-2xl" />
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={clsx("w-full", containerClassName)}>
        <div
          className={clsx(
            "flex w-full items-center rounded-md border bg-background text-sm text-foreground placeholder:text-foreground/50 sm:text-base",
            "border-gray-300 dark:border-gray-600",
            variant === "button-highlight"
              ? "my-1 h-10 pl-2 py-0 pr-0 sm:pr-1"
              : "pl-2",
            disabled && "cursor-not-allowed opacity-70",
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
          {showClearButton ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onCancelSearch?.();
              }}
            >
              <XIcon className="mx-2 text-md text-foreground sm:text-lg" />
            </button>
          ) : (
            <MagnifyingGlassIcon
              className={clsx(
                variant === "button-highlight"
                  ? "mr-2 scale-125 rounded-md bg-primary-500 p-1 text-lg text-white sm:text-xl"
                  : "ml-2 text-md text-foreground/50 sm:text-lg"
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
