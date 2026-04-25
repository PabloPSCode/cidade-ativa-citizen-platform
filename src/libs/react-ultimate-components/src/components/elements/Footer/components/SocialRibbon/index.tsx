"use client";

import type React from "react";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  RedditLogoIcon,
  TiktokLogoIcon,
  TwitchLogoIcon,
  WhatsappLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Link from "next/link";

type item = {
  /** Nome do ícone */
  iconName:
    | "instagram"
    | "tiktok"
    | "twitch"
    | "x"
    | "facebook"
    | "youtube"
    | "reddit"
    | "whatsapp"
    | "custom";
  /** Link do ícone */
  href: string;
  /** Ícone customizado (se `iconName` for `custom`) */
  icon?: React.ReactNode;
};

export interface SocialRibbonProps {
  /** Itens do SocialRibbon */
  items: item[];
  /** Classe aplicada aos ícones (útil para cores, tamanho, etc) */
  iconsClassName?: string;
  /** Peso dos ícones (padrão: regular) */
  iconsWeight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  title?: string;
}
/** Componente SocialRibbon */
export default function SocialRibbon({
  items,
  iconsClassName,
  iconsWeight,
  title,
}: SocialRibbonProps) {
  return (
    <div className="flex flex-col">
      {title && (
        <h4 className="mb-3 text-xs sm:text-sm font-semibold tracking-wide text-foreground">
          {title}
        </h4>
      )}
      <ul className="flex gap-3 items-center">
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href} className="flex items-center">
              {item.iconName === "instagram" ? (
                <InstagramLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "tiktok" ? (
                <TiktokLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "twitch" ? (
                <TwitchLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "x" ? (
                <XLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "facebook" ? (
                <FacebookLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "youtube" ? (
                <YoutubeLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "whatsapp" ? (
                <WhatsappLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : item.iconName === "reddit" ? (
                <RedditLogoIcon
                  className={clsx("w-5 h-5 sm:w-7 sm:h-7", iconsClassName)}
                  weight={iconsWeight}
                />
              ) : (
                item.icon
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
