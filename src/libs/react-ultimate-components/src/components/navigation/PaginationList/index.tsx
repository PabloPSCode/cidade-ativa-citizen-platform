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
  /** Pagina atual (base 1). */
  page: number;
  /** Itens por pagina. */
  itemsPerPage?: 5 | 10 | 20 | 30 | 50 | 100;
  /** Quantidade de paginas exibidas no meio. */
  pagesToShow?: number;
  /** Callback ao trocar de pagina. */
  onPageChange: (newPage: number) => void;
  /** Lista de elementos a paginar. */
  children: React.ReactNode;
  /** Classe opcional para o conteiner externo. */
  containerClassName?: string;
  /** Classe opcional para o conteiner da lista. */
  listClassName?: string;
  /** Classe opcional para o conteiner da navegacao. */
  navigationClassName?: string;
  /** Classe opcional para os botoes de numero de pagina. */
  pageNumberClassName?: string;
  /** Classe opcional para a pagina ativa. */
  activePageNumberClassName?: string;
  /** Classe opcional para as paginas inativas. */
  inactivePageNumberClassName?: string;
  /** Classe opcional para o botao anterior. */
  previousButtonClassName?: string;
  /** Classe opcional para o botao proximo. */
  nextButtonClassName?: string;
  /** Classe opcional para o seletor de itens por pagina. */
  itemsPerPageSelectClassName?: string;
  /** Exibe o seletor de itens por pagina. */
  showItemsPerPageSelect?: boolean;
  /** Exibe os botoes de primeira e ultima pagina. */
  showFirstLastButtons?: boolean;
  /** Texto opcional do botao anterior. */
  previousButtonLabel?: string;
  /** Texto opcional do botao proximo. */
  nextButtonLabel?: string;
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
  listClassName,
  navigationClassName,
  pageNumberClassName,
  activePageNumberClassName,
  inactivePageNumberClassName,
  previousButtonClassName,
  nextButtonClassName,
  itemsPerPageSelectClassName,
  showItemsPerPageSelect = true,
  showFirstLastButtons = true,
  previousButtonLabel,
  nextButtonLabel,
  rightIcon,
  leftIcon,
  firstIcon,
  lastIcon,
}: ListPaginationProps) {
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const childrenArray = React.Children.toArray(children);

  const totalPages = Math.max(
    1,
    Math.ceil(childrenArray.length / itemsPerPageState)
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const handleGoToFirstPage = () => handlePageChange(1);
  const handleGoToLastPage = () => handlePageChange(totalPages);

  const currentItemsToShow = childrenArray.slice(
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
  const shouldRenderEdgeButtons =
    showFirstLastButtons && totalPages > 1 && totalPages > pagesToShow;

  const previousButtonContent =
    previousButtonLabel ?? leftIcon ?? <CaretLeftIcon size={18} weight="bold" />;
  const nextButtonContent =
    nextButtonLabel ?? rightIcon ?? (
      <CaretRightIcon size={18} weight="bold" />
    );

  return (
    <section className={clsx("w-full", containerClassName)}>
      <div
        className={clsx("flex w-full flex-col items-start gap-3", listClassName)}
      >
        {currentItemsToShow}
      </div>

      <nav
        className={clsx(
          "mx-auto mt-8 flex w-full flex-col gap-3 rounded-md bg-background px-2.5 py-1.5 shadow-sm sm:mt-10 sm:px-3 sm:py-2",
          navigationClassName
        )}
        role="navigation"
        aria-label="Paginação"
      >
        <div className="grid w-full gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <div className="flex items-center justify-start gap-2">
            {shouldRenderEdgeButtons && (
              <button
                type="button"
                onClick={handleGoToFirstPage}
                disabled={isFirst}
                aria-label="Primeira página"
                className={clsx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/20 text-foreground/80",
                  isFirst && "cursor-not-allowed opacity-50"
                )}
              >
                {firstIcon ?? <CaretDoubleLeftIcon size={18} weight="bold" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={isFirst}
              aria-label="Pagina anterior"
              className={clsx(
                "inline-flex items-center justify-center rounded-md border border-foreground/20 text-foreground/80",
                previousButtonLabel
                  ? "min-h-10 px-4"
                  : "h-10 w-10 rounded-xl",
                isFirst && "cursor-not-allowed opacity-50",
                previousButtonClassName
              )}
            >
              {previousButtonContent}
            </button>
          </div>

          <ul className="flex items-center justify-center gap-1 sm:gap-1.5">
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
                      "inline-flex h-8 w-8 items-center justify-center text-xs font-medium sm:h-9 sm:w-9 sm:text-sm",
                      active
                        ? "scale-110 text-primary-600"
                        : "bg-background text-foreground",
                      pageNumberClassName,
                      active
                        ? activePageNumberClassName
                        : inactivePageNumberClassName
                    )}
                  >
                    {n}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={isLast}
              aria-label="Próxima página"
              className={clsx(
                "inline-flex items-center justify-center rounded-md border border-foreground/20 text-foreground/80",
                nextButtonLabel ? "min-h-10 px-4" : "h-10 w-10 rounded-xl",
                isLast && "cursor-not-allowed opacity-50",
                nextButtonClassName
              )}
            >
              {nextButtonContent}
            </button>

            {shouldRenderEdgeButtons && (
              <button
                type="button"
                onClick={handleGoToLastPage}
                disabled={isLast}
                aria-label="Última página"
                className={clsx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/20 text-foreground/80",
                  isLast && "cursor-not-allowed opacity-50"
                )}
              >
                {lastIcon ?? <CaretDoubleRightIcon size={18} weight="bold" />}
              </button>
            )}
          </div>
        </div>

        {showItemsPerPageSelect && (
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
            className={clsx(
              "rounded-md border border-foreground/20 bg-background p-2 text-xs text-foreground/80 sm:text-sm",
              itemsPerPageSelectClassName
            )}
          >
            {[5, 10, 20, 30, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option} itens por página
              </option>
            ))}
          </select>
        )}
      </nav>
    </section>
  );
}
