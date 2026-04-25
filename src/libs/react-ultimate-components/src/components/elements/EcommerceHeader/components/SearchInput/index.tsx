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
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  onCancelSearch?: () => void;
  containerClassName?: string;
}

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
            "pl-2 py-1 pr-2 sm:pr-3 my-1 h-10",
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
              <XIcon className="text-foreground text-md sm:text-lg ml-2" />
            </button>
          ) : (
            <MagnifyingGlassIcon className="text-foreground text-md sm:text-lg ml-2" />
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
