"use client";
import clsx from "clsx";
import type { ReactNode } from "react";

export interface ItemListCardProps {
  /** Ícone do item (componente React). */
  icon: ReactNode;
  /** Título do item. */
  title: string;
  /** Descrição do item (opcional). */
  description?: string;
  /** Classes adicionais para customização. */
  containerClassName?: string;
  /** Classes adicionais para o título. */
  titleClassName?: string;
  /** Classes adicionais para a descrição. */
  descriptionClassName?: string;
}

export default function ItemListCard({
  icon,
  title,
  description,
  containerClassName,
  titleClassName,
  descriptionClassName,
}: ItemListCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col border border-border-card rounded-lg p-4 bg-bg-card shadow-sm",
        containerClassName
      )}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div className="flex flex-col gap-1">
          <h3 className={clsx("text-base sm:text-lg font-semibold text-foreground", titleClassName)}>
            {title}
          </h3>
          {description && (
            <p className={clsx("text-sm sm:text-base text-foreground/70", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

