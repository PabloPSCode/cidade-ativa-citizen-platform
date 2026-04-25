"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HTMLAttributes } from "react";
import { useMemo } from "react";
import { IProduct } from "../../../../../../types";

export interface ItemsSearchListProps extends HTMLAttributes<HTMLDivElement> {
  /** Lista completa de itens para pesquisa. */
  items?: IProduct[];
  /** Termo digitado no SearchInput. */
  searchTerm: string;
  /** Classe extra aplicada ao container com scroll. */
  listClassName?: string;
  /** Classe extra aplicada a cada item da lista. */
  itemClassName?: string;
  /** Classe extra aplicada ao estado vazio. */
  emptyStateClassName?: string;
  /** Callback ao clicar em um item. */
  onItemClick?: (item: IProduct) => void;
}

const MIN_SEARCH_LENGTH = 3;

export default function ItemsSearchList({
  items = [],
  searchTerm,
  listClassName,
  itemClassName,
  emptyStateClassName,
  onItemClick,
  className,
  ...rest
}: ItemsSearchListProps) {
  const router = useRouter();

  const trimmedTerm = searchTerm.trim();
  const shouldShow = trimmedTerm.length >= MIN_SEARCH_LENGTH;

  const filteredItems = useMemo(() => {
    if (!shouldShow) return [];
    const normalizedTerm = trimmedTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.description?.toLowerCase().includes(normalizedTerm) ||
        item.name.toLowerCase().includes(normalizedTerm)
    );
  }, [items, shouldShow, trimmedTerm]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={clsx("w-full", className)} {...rest}>
      <div
        className={clsx(
          "h-40 overflow-y-auto rounded-md border border-border-card bg-bg-card text-foreground shadow-sm",
          listClassName
        )}
      >
        {filteredItems.length === 0 ? (
          <div
            className={clsx(
              "flex h-full items-center justify-center px-4 text-center text-xs sm:text-sm text-foreground/70",
              emptyStateClassName
            )}
          >
            <span>
              Não foi encontrado nenhum produto para a pesquisa{" "}
              <span className="font-mono text-foreground">
                {`\`${trimmedTerm}\``}
              </span>
            </span>
          </div>
        ) : (
          <ul className="divide-y divide-foreground/10">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <div
                  onClick={() => {
                    onItemClick?.(item);
                    router.push(`/produto/${item.slug}`);
                  }}
                  className={clsx(
                    "flex w-full items-center gap-3 px-3 py-2 text-left transition",
                    "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 cursor-pointer",
                    itemClassName
                  )}
                >
                  {item.imageUrls[0] ? (
                    <Image
                      src={item.imageUrls[0]}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md object-cover bg-white"
                    />
                  ) : null}
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-medium text-foreground">
                      {item.name}
                    </span>
                    {item.description ? (
                      <span className="text-xs sm:text-sm text-foreground/70">
                        {item.description}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
