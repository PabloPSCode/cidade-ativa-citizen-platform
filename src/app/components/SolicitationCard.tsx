"use client";

import {
  CalendarDotsIcon,
  MapPinLineIcon,
  PencilSimpleLineIcon,
  SpinnerGapIcon,
  TrashIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../libs/react-ultimate-components/src";
import {
  formatSolicitationDate,
  solicitationStatusMap,
  type SolicitationSummary,
} from "../constants/solicitations";

export interface SolicitationCardProps
  extends Omit<SolicitationSummary, "id" | "protocolNumber"> {
  className?: string;
  detailsHref?: string;
  titleLabel?: string;
  requestingUserLabel?: string;
  statusLabel?: string;
  detailsButtonLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SolicitationCard({
  title,
  requestingUserId,
  description,
  imageUrls,
  neighborhood,
  createdAt,
  street,
  status,
  className,
  detailsHref,
  titleLabel = "Solicitação",
  requestingUserLabel = "Requerente",
  statusLabel,
  detailsButtonLabel = "Ver detalhes",
  onEdit,
  onDelete,
}: SolicitationCardProps) {
  const router = useRouter();
  const statusConfig = solicitationStatusMap[status];
  const mainImageUrl = imageUrls[0] || "/logo.png";
  const isInteractive = Boolean(detailsHref);

  const handleNavigateToDetails = () => {
    if (detailsHref) {
      router.push(detailsHref);
    }
  };

  const hasManagementActions = Boolean(onEdit || onDelete);

  return (
    <article
      role={isInteractive ? "link" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleNavigateToDetails : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleNavigateToDetails();
              }
            }
          : undefined
      }
      className={clsx(
        "solicitation-card Container rounded-[2rem] border border-border-card/70 bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-5 xl:p-6",
        isInteractive &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-foreground/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
        className
      )}
    >
      <div className="grid gap-5 xl:grid-cols-[136px_minmax(0,1.45fr)_repeat(4,minmax(0,0.9fr))_auto] xl:items-center">
        <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-neutral-200 dark:bg-white/5 sm:h-52 xl:h-28 xl:w-[136px]">
          <Image
            src={mainImageUrl}
            alt={`Imagem de ${title.toLowerCase()} em ${street}`}
            fill
            sizes="(min-width: 1280px) 136px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                {titleLabel}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-black tracking-tight">{title}</h3>
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
                  {statusLabel ?? statusConfig.label}
                </span>
              </div>
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
              {statusLabel ?? statusConfig.label}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              {requestingUserLabel}
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
              <span>{formatSolicitationDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "flex flex-wrap items-center gap-3 xl:justify-self-end",
            hasManagementActions ? "xl:max-w-[18rem]" : "xl:max-w-[11rem]"
          )}
        >
          {onEdit ? (
            <button
              type="button"
              title="Editar solicitação"
              aria-label="Editar solicitação"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-foreground/10 bg-background/80 text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
            >
              <PencilSimpleLineIcon size={20} weight="bold" />
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              title="Excluir solicitação"
              aria-label="Excluir solicitação"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-500/10 text-rose-600 transition hover:bg-rose-500/15 dark:border-rose-400/20 dark:text-rose-300"
            >
              <TrashIcon size={20} weight="fill" />
            </button>
          ) : null}

          <Button
            type="button"
            label={detailsButtonLabel}
            onClick={
              detailsHref
                ? (event) => {
                    event?.stopPropagation?.();
                    handleNavigateToDetails();
                  }
                : undefined
            }
            className="flex-1 justify-center rounded-2xl px-6 py-3 text-sm font-bold !bg-emerald-600 hover:!bg-emerald-500 xl:min-w-[10rem]"
          />
        </div>
      </div>
    </article>
  );
}
