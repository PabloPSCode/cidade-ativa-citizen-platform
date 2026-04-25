"use client";

import { sizes } from "../../../theme/theme";
import { getThemeColor } from "../../../utils/colors";
import { ArrowRightIcon } from "@phosphor-icons/react";

interface InfoLinkCardProps {
  /** URL para onde o card deve navegar */
  url: string;
  /** Título do card */
  title: string;
  /** Texto descritivo do card */
  text: string;
}

/**Card utilizado para realizar navegação entre páginas*/
export default function InfoLinkCard({
  url,
  title,
  text,
}: InfoLinkCardProps) {
  const primaryColor = getThemeColor("--color-primary-500");

  return (
    <a
      className="flex w-full items-center justify-between p-3 sm:p-4 gap-8 rounded-md border border-foreground shadow-md cursor-pointer"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Navegar para ${title}`}
    >
      <div className="flex-1">
        <h3 className="text-md sm:text-lg font-semibold text-foreground break-words">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground text-foreground">{text}</p>
      </div>
      {/* Icon for small devices */}
      <ArrowRightIcon color={primaryColor} size={sizes.large} weight="bold" className="hidden sm:flex" />
      {/* Icon for medium and large devices */}
      <ArrowRightIcon color={primaryColor} size={sizes.medium} weight="bold" className="sm:hidden" />
    </a>
  );
}

