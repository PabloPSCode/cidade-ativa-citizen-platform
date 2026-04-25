"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import Image from "next/image";

export interface CategoryCardProps {
  /** Nome da categoria exibida no card. */
  name: string;
  /** Link para a listagem da categoria. */
  onSeeCategory: () => void;
  /** URL da imagem apresentada no card. */
  imgUrl?: string;
  /** Nome do ícone (Solar) exibido quando nenhuma imagem é enviada. */
  iconName?: string;
  /** Cor do ícone (Solar) exibido quando nenhuma imagem é enviada. */
  iconColor?: string;
  /** Classes extras aplicadas ao contêiner externo. */
  className?: string;
  /** Abre o link em uma nova aba (opcional). */
  newTab?: boolean;
}

/**
 * Card clicável para destacar categorias em vitrines ou seções de navegação.
 * Prioriza a imagem fornecida via `imgUrl` e, na ausência dela, renderiza o
 * ícone Solar informado em `iconName`, mantendo uma área padronizada e
 * responsiva.
 */
export default function CategoryCard({
  name,
  onSeeCategory,
  imgUrl,
  iconName,
  iconColor,
  className,
  newTab,
}: CategoryCardProps) {
  const resolvedIconName = iconName?.startsWith("solar:")
    ? iconName
    : iconName
    ? `solar:${iconName}`
    : undefined;

  const media = imgUrl ? (
    <Image
      src={imgUrl}
      alt={name}
      width={96}
      height={96}
      className="h-full w-full rounded-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
      loading="lazy"
      sizes="(min-width: 768px) 96px, (min-width: 640px) 80px, 64px"
    />
  ) : resolvedIconName ? (
    <Icon
      icon={resolvedIconName}
      className={clsx(
        iconColor
          ? `text-${iconColor} "h-8 w-8 sm:h-10 sm:w-10"`
          : "h-8 w-8 sm:h-10 sm:w-10"
      )}
    />
  ) : null;

  return (
    <div
      role="button"
      rel={newTab ? "noopener noreferrer" : undefined}
      className={clsx(
        "group flex flex-col items-center gap-3 rounded-xl border border-border-card bg-bg-card p-4 sm:p-5 shadow-sm text-foreground",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
        className
      )}
      aria-label={`Ver categoria ${name}`}
      onClick={onSeeCategory}
    >
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center overflow-hidden rounded-full  bg-gray-200 text-primary-600 dark:text-primary-400 text-2xl sm:text-3xl transition-colors ">
        {media}
      </div>
      <span className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400 text-center leading-tight line-clamp-2">
        {name}
      </span>
    </div>
  );
}
