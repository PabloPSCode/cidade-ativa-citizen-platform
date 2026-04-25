"use client";

import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";

export interface QRCodeProps {
  /** String a ser codificada (ex.: URL). **Obrigatória**. */
  address: string;

  /** Rótulo curto exibido abaixo do QR (opcional). */
  label?: string;

  /** Descrição/ajuda abaixo do QR (opcional). */
  description?: string;

  /** Classes extras para o container externo (opcional). */
  className?: string;

  /** Tamanho base em px (apenas referência; continua fluido). */
  size?: number;
}

/**
 * QRCode — usando `qrcode.react` (SVG).
 * - **Responsivo**: o wrapper controla a largura; o SVG se ajusta com `w-full`.
 * - **Dark-mode**: `fgColor="currentColor"` herda de `text-foreground`.
 */
export default function QRCodeCard({
  address,
  label,
  description,
  className,
}: QRCodeProps) {
  if (!address?.trim()) return null;

  return (
    <div
      className={clsx(
        "flex w-full max-w-48 sm:max-w-72 flex-col items-center gap-2 sm:gap-3",
        "rounded-lg border border-border-card bg-bg-card p-3 sm:p-4 shadow-sm",
        "text-foreground",
        className
      )}
    >
      {/* Wrapper responsivo controla a largura/escala */}
      <div
        aria-label={label ?? "Código QR"}
        className={clsx(
          "w-40 sm:w-48 md:w-64 aspect-square",
          "rounded-md bg-background p-2 sm:p-3",
          "text-foreground"
        )}
      >
        <QRCodeSVG
          value={address}
          level="M"
          fgColor="currentColor"
          bgColor="transparent"
          className="h-full w-full"
          aria-hidden
        />
      </div>

      {label && (
        <strong className="mt-1 text-center text-sm sm:text-base">
          {label}
        </strong>
      )}

      {description && (
        <p className="text-center text-xs sm:text-sm text-foreground/70">
          {description}
        </p>
      )}
    </div>
  );
}

