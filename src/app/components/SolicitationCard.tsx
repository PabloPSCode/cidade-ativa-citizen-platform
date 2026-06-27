"use client";

import {
  CalendarDotsIcon,
  MapPinLineIcon,
  PencilSimpleLineIcon,
  SpinnerGapIcon,
  TrashIcon,
  UserCircleIcon,
  UsersThreeIcon,
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
  extends Omit<SolicitationSummary, "id"> {
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
  protocolNumber,
  requestingUserId,
  requestingUserName,
  description,
  imageUrls,
  neighborhood,
  createdAt,
  street,
  status,
  isCollective,
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
        "solicitation-card Container w-full max-w-full rounded-[2rem] border border-border-card/70 bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-5 xl:p-6",
        isInteractive &&
          "cursor-pointer hover:border-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
        className
      )}
    >
      <div className="grid w-full gap-5 xl:grid-cols-[136px_minmax(0,1fr)_auto] xl:items-start">
        <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-neutral-200 dark:bg-white/5 sm:h-52 xl:h-28 xl:w-[136px]">
          <Image
            src={mainImageUrl}
            alt={`Imagem de ${title.toLowerCase()} em ${street}`}
            fill
            sizes="(min-width: 1280px) 136px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4 xl:self-center">
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  {titleLabel}
                </p>
                <span className="text-xs font-semibold text-foreground/45">
                  #{protocolNumber}
                </span>
              </div>
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

                {isCollective ? (
                  <span
                    title="Ação coletiva"
                    aria-label="Ação coletiva"
                    className="inline-flex items-center gap-1.5 rounded-full bg-success-500 px-3 py-1 text-xs font-semibold text-white"
                  >
                    <UsersThreeIcon size={14} weight="fill" />
                    Coletiva
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs font-medium text-foreground/60 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <MapPinLineIcon size={16} weight="fill" />
              {street}
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <SpinnerGapIcon size={16} weight="bold" />
              {neighborhood}
            </span>
          </div>
        </div>

        <div
          className={clsx(
            "flex flex-wrap items-center gap-3 xl:justify-self-end xl:self-center",
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-destructive-500/25 bg-destructive-500/10 text-destructive-600 transition hover:bg-destructive-500/15 dark:text-destructive-300"
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
            className="flex-1 justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600 xl:min-w-[10rem]"
          />
        </div>

        <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03] xl:col-span-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Descrição
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/75 sm:text-[0.95rem]">
            {description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:col-span-full">
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
              <span className="truncate">{requestingUserName || requestingUserId}</span>
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
      </div>
    </article>
  );
}
