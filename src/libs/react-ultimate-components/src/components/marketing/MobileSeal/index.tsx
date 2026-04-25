"use client";

/* eslint-disable react-hooks/static-components */
import clsx from "clsx";
import appStoreLogo from "../../../assets/apple-logo.png";
import googlePlayLogo from "../../../assets/google-play-logo.png";
import Image from "next/image";
import type { PropsWithChildren } from "react";

/** ===================== Tipagem =====================
 * Componente de selos/links para as lojas mobile (Brasil).
 * - Sempre com **fundo escuro** para garantir contraste com os selos.
 * - **Responsivo** (ícones aumentam em telas maiores).
 * - **Acessível** (alt/aria-label) e com foco visível.
 *
 * Casos de uso (mercado brasileiro):
 * - Landing pages que promovem o app corporativo.
 * - Seções “Baixe o app” para iOS/Android.
 */
export interface MobileSealProps {
  /** Exibir o selo da App Store (iOS). Padrão: true. */
  showAppStoreLogo?: boolean;
  /** Exibir o selo do Google Play (Android). Padrão: true. */
  showGooglePlayLogo?: boolean;

  /** Link para a App Store (ex.: https://apps.apple.com/br/app/...). */
  appStoreLink?: string;
  /** Link para o Google Play (ex.: https://play.google.com/store/apps/details?id=...). */
  googlePlayLink?: string;

  /** Texto alternativo para os selos (padrões em português do Brasil). */
  appStoreText?: string;
  /** Texto alternativo para os selos (padrões em português do Brasil). */
  googlePlayText?: string;

  /** Classes opcionais para o container externo. */
  containerClassName?: string;
  /** Classes opcionais para cada “cartão”/item (ambos os selos). */
  itemClassName?: string;
  /** Classes opcionais para as imagens dos selos. */
  imageClassName?: string;
  /** Classes opcionais para o texto ao lado dos selos. */
  textClassName?: string;
}

/** ===================== Componente ===================== */
export default function MobileSeal({
  showAppStoreLogo = true,
  showGooglePlayLogo = true,
  appStoreLink,
  googlePlayLink,
  appStoreText = "Disponível na App Store",
  googlePlayText = "Disponível no Google Play",
  containerClassName,
  itemClassName,
  imageClassName,
  textClassName,
}: MobileSealProps) {
  /** Wrapper que vira <a> quando tem link, senão <div>. */
  const LinkOrDiv = ({
    href,
    label,
    children,
  }: PropsWithChildren<{ href?: string; label: string }>) =>
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={clsx(
          "group flex items-center gap-3 sm:gap-4 rounded-lg border border-neutral-800",
          "bg-neutral-900 p-2 sm:p-4 shadow-sm transition-colors hover:bg-neutral-800",
          "focus:outline-none",
          itemClassName
        )}
      >
        {children}
      </a>
    ) : (
      <div
        aria-label={label}
        className={clsx(
          "group flex items-center gap-4 rounded-lg border border-neutral-800",
          "bg-neutral-900 p-4 shadow-sm",
          itemClassName
        )}
      >
        {children}
      </div>
    );

  return (
    <div
      className={clsx(
        "max-w-xs w-fit flex flex-col gap-2 select-none",
        containerClassName
      )}
    >
      {showAppStoreLogo && (
        <LinkOrDiv
          href={appStoreLink}
          label="Abrir App Store em nova aba (Brasil)"
        >
          <Image
            src={appStoreLogo}
            alt="Disponível na App Store"
            loading="lazy"
            width={40}
            height={40}
            className={clsx(
              "h-8 w-8 sm:h-10 sm:w-10 object-contain",
              "transition-transform group-hover:scale-[1.03]",
              imageClassName
            )}
          />
          <span
            className={clsx(
              "text-white text-sm sm:text-base font-medium",
              textClassName
            )}
          >
            {appStoreText}
          </span>
        </LinkOrDiv>
      )}

      {showGooglePlayLogo && (
        <LinkOrDiv
          href={googlePlayLink}
          label="Abrir Google Play em nova aba (Brasil)"
        >
          <Image
            src={googlePlayLogo}
            alt="Disponível no Google Play"
            loading="lazy"
            width={40}
            height={40}
            className={clsx(
              "h-8 w-8 sm:h-10 sm:w-10 object-contain -mb-2",
              "transition-transform group-hover:scale-[1.03]",
              imageClassName
            )}
          />
          <span
            className={clsx(
              "text-white text-sm sm:text-base font-medium",
              textClassName
            )}
          >
            {googlePlayText}
          </span>
        </LinkOrDiv>
      )}
    </div>
  );
}
