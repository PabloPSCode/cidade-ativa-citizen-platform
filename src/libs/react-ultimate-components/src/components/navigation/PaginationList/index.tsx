"use client";

import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import React, { useState } from "react";

interface ListPaginationProps {
  /** Página atual (base 1). */
  page: number;
  /** Itens por página. */
  itemsPerPage?: 5 | 10 | 20 | 30 | 50 | 100;
  /** Quantidade de páginas exibidas no meio. */
  pagesToShow?: number;
  /** Callback ao trocar de página. */
  onPageChange: (newPage: number) => void;
  /** Lista de elementos a paginar. */
  children: React.ReactNode[];
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Classe opcional para os botões de número de página. */
  pageNumberClassName?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  firstIcon?: React.ReactNode;
  lastIcon?: React.ReactNode;
}

export default function ListPagination({
  page,
  itemsPerPage = 10,
  pagesToShow = 5,
  onPageChange,
  children,
  containerClassName,
  pageNumberClassName,
  rightIcon,
  leftIcon,
  firstIcon,
  lastIcon,
}: ListPaginationProps) {
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  const totalPages = Math.max(
    1,
    Math.ceil(children.length / itemsPerPageState)
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const handleGoToFirstPage = () => handlePageChange(1);
  const handleGoToLastPage = () => handlePageChange(totalPages);

  const currentItemsToShow = children.slice(
    (page - 1) * itemsPerPageState,
    page * itemsPerPageState
  );

  const getVisiblePageNumbers = () => {
    const half = Math.floor(pagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = start + pagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - pagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <section className={clsx("w-full", containerClassName)}>
      {/* Lista paginada */}
      <div className="w-full flex flex-col items-start gap-3">
        {currentItemsToShow}
      </div>

      <nav
        className={clsx(
          "mt-8 sm:mt-10 mx-auto w-full",
          "flex flex-col sm:flex-row sm:items-center justify-center",
          "rounded-md bg-background",
          "px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-sm"
        )}
        role="navigation"
        aria-label="Paginação"
      >
        <div className="w-full flex">
          {/* Primeiro */}
          {totalPages > pagesToShow && (
            <button
              type="button"
              onClick={handleGoToFirstPage}
              disabled={isFirst}
              aria-label="Primeira página"
              className={clsx(
                "inline-flex items-center justify-center ",
                "w-8 h-8 sm:w-9 sm:h-9",
                "text-foreground/80",
                "border rounded-md border-foreground/20",
                isFirst && "opacity-50 cursor-not-allowed"
              )}
            >
              {firstIcon ?? <CaretDoubleLeftIcon size={18} weight="bold" />}
            </button>
          )}

          {/* Anterior */}
          {totalPages > pagesToShow && (
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={isFirst}
              aria-label="Página anterior"
              className={clsx(
                "ml-1 inline-flex items-center justify-center",
                "w-8 h-8 sm:w-9 sm:h-9",
                "text-foreground/80",
                "border rounded-md border-foreground/20",
                isFirst && "opacity-50 cursor-not-allowed"
              )}
            >
              {leftIcon ?? <CaretLeftIcon size={18} weight="bold" />}
            </button>
          )}

          {/* Números */}
          <ul className="mx-1 sm:mx-2 flex items-center gap-1 sm:gap-1.5">
            {getVisiblePageNumbers().map((n) => {
              const active = n === page;
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => handlePageChange(n)}
                    aria-label={`Ir para página ${n}`}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "inline-flex items-center justify-center font-medium",
                      "w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm",
                      active
                        ? "text-primary-600 scale-125"
                        : "bg-background text-foreground",
                      pageNumberClassName
                    )}
                  >
                    {n < 10 ? `0${n}` : n}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Próxima */}
          {totalPages > pagesToShow && (
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={isLast}
              aria-label="Próxima página"
              className={clsx(
                "mr-1 inline-flex items-center justify-center",
                "w-8 h-8 sm:w-9 sm:h-9",
                "text-foreground/80",
                "border rounded-md border-foreground/20",
                isLast && "opacity-50 cursor-not-allowed"
              )}
            >
              {rightIcon ?? <CaretRightIcon size={18} weight="bold" />}
            </button>
          )}

          {/* Último */}
          {totalPages > pagesToShow && (
            <button
              type="button"
              onClick={handleGoToLastPage}
              disabled={isLast}
              aria-label="Última página"
              className={clsx(
                "inline-flex items-center justify-center",
                "w-8 h-8 sm:w-9 sm:h-9",
                "text-foreground/80",
                "border rounded-md border-foreground/20",
                isLast && "opacity-50 cursor-not-allowed"
              )}
            >
              {lastIcon ?? <CaretDoubleRightIcon size={18} weight="bold" />}
            </button>
          )}
        </div>
        {/* Controles de paginação */}
        <select
          name="items-per-page"
          id="items-per-page"
          value={itemsPerPageState}
          onChange={(e) => {
            const newItemsPerPage = parseInt(
              e.target.value
            ) as ListPaginationProps["itemsPerPage"];
            setItemsPerPageState(newItemsPerPage as never);
            onPageChange(1);
          }}
          className="p-2 border border-foreground/20 rounded-md bg-background text-foreground/80 text-xs sm:text-sm mt-2 sm:mt-0 sm:ml-4"
        >
          {[5, 10, 20, 30, 50, 100].map((option) => (
            <option key={option} value={option}>
              {option} itens por página
            </option>
          ))}
        </select>
      </nav>
    </section>
  );
}

