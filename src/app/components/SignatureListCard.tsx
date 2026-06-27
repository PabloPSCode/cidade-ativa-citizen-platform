"use client";

import { CalendarDotsIcon } from "@phosphor-icons/react";
import clsx from "clsx";

export interface SignatureListCardProps {
  userName: string;
  signatureImageUrl: string;
  /** Data em que a assinatura foi adicionada à solicitação. */
  signedAt?: string | Date | null;
  className?: string;
}

const formatSignedAt = (value?: string | Date | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
};

/** Cartão de uma assinatura vinculada a uma solicitação. */
export default function SignatureListCard({
  userName,
  signatureImageUrl,
  signedAt,
  className,
}: SignatureListCardProps) {
  const signedAtLabel = formatSignedAt(signedAt);

  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-[1.25rem] border border-border-card/70 bg-background/80 p-4 dark:bg-white/[0.03]",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={signatureImageUrl}
        alt={`Assinatura de ${userName}`}
        className="h-16 w-28 shrink-0 rounded-md border border-border-card/70 bg-white object-contain p-1"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
          Assinante
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-foreground sm:text-base">
          {userName}
        </p>
        {signedAtLabel ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/55">
            <CalendarDotsIcon size={14} weight="fill" className="shrink-0" />
            Assinado em {signedAtLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
