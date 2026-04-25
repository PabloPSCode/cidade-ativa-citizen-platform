"use client";

import {
  CalendarDotsIcon,
  MapPinLineIcon,
  SpinnerGapIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "../../libs/react-ultimate-components/src";

export type SolicitationStatus = "not_resolved" | "in_progress" | "resolved";

export interface SolicitationCardProps {
  requestingUserId: string;
  description: string;
  imageUrls: string[];
  neighborhood: string;
  createdAt: string;
  street: string;
  status: SolicitationStatus;
  className?: string;
}

export const solicitationStatusMap: Record<
  SolicitationStatus,
  {
    label: string;
    dotClassName: string;
    badgeClassName: string;
  }
> = {
  not_resolved: {
    label: "Nao resolvido",
    dotClassName: "bg-amber-400",
    badgeClassName:
      "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  },
  in_progress: {
    label: "Em andamento",
    dotClassName: "bg-sky-400",
    badgeClassName:
      "bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200",
  },
  resolved: {
    label: "Resolvido",
    dotClassName: "bg-emerald-500",
    badgeClassName:
      "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export default function SolicitationCard({
  requestingUserId,
  description,
  imageUrls,
  neighborhood,
  createdAt,
  street,
  status,
  className,
}: SolicitationCardProps) {
  const statusConfig = solicitationStatusMap[status];
  const mainImageUrl = imageUrls[0] || "/logo.png";

  return (
    <article
      className={clsx(
        "solicitation-card Container",
        "rounded-[2rem] border border-border-card/70 bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-5 xl:p-6",
        className
      )}
    >
      <div className="grid gap-5 xl:grid-cols-[136px_minmax(0,1.45fr)_repeat(4,minmax(0,0.9fr))_auto] xl:items-center">
        <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-neutral-200 dark:bg-white/5 sm:h-52 xl:h-28 xl:w-[136px]">
          <Image
            src={mainImageUrl}
            alt={`Imagem da solicitacao em ${street}`}
            fill
            sizes="(min-width: 1280px) 136px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-black tracking-tight">
                Solicitacao
              </h3>
              <span
                className={clsx(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                  statusConfig.badgeClassName
                )}
              >
                <span
                  className={clsx(
                    "h-2.5 w-2.5 rounded-full",
                    statusConfig.dotClassName
                  )}
                />
                {statusConfig.label}
              </span>
            </div>

            <p className="text-sm leading-6 text-foreground/75 sm:text-[0.95rem]">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs font-medium text-foreground/60 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <MapPinLineIcon size={16} weight="fill" />
              {street}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <SpinnerGapIcon size={16} weight="bold" />
              {neighborhood}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:contents">
          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Bairro
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
              {neighborhood}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Status
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
              {statusConfig.label}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Requerente
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
              <UserCircleIcon
                size={18}
                weight="fill"
                className="shrink-0 text-foreground/55"
              />
              <span className="truncate">{requestingUserId}</span>
            </div>
          </div>

          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Data de cadastro
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
              <CalendarDotsIcon
                size={18}
                weight="fill"
                className="shrink-0 text-foreground/55"
              />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="xl:justify-self-end">
          <Button
            type="button"
            label="Ver detalhes"
            className="w-full justify-center rounded-2xl px-6 py-3 text-sm font-bold !bg-emerald-600 hover:!bg-emerald-500 xl:min-w-[10rem]"
          />
        </div>
      </div>
    </article>
  );
}
