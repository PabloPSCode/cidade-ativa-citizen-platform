"use client";

import {
  CalendarDotsIcon,
  MapPinLineIcon,
  MedalIcon,
  PencilSimpleLineIcon,
  StackIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { GoogleMapsRender } from "../../libs/react-ultimate-components/src";
import { formatDoneCoolActionDate } from "../constants/done-cool-actions";

export interface DoneCoolActionCardProps {
  coolActionTitle: string;
  category: string;
  points: number;
  description: string;
  neighborhood: string;
  street: string;
  actionPhotoURL: string;
  createdAt: string;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DoneCoolActionCard({
  coolActionTitle,
  category,
  points,
  description,
  neighborhood,
  street,
  actionPhotoURL,
  createdAt,
  className,
  onEdit,
  onDelete,
}: DoneCoolActionCardProps) {
  const mapAddress = [street, neighborhood].filter(Boolean).join(", ");

  return (
    <article
      className={clsx(
        "w-full max-w-full rounded-[2rem] border border-border-card/70 bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-5 xl:p-6",
        className
      )}
    >
      <div className="grid w-full gap-5 xl:grid-cols-[136px_minmax(0,1fr)_auto] xl:items-start">
        <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-neutral-200 dark:bg-white/5 sm:h-52 xl:h-28 xl:w-[136px]">
          <Image
            src={actionPhotoURL || "/logo.png"}
            alt={`Foto da ação ${coolActionTitle.toLowerCase()}`}
            fill
            sizes="(min-width: 1280px) 136px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4 xl:self-center">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Ação legal
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-black tracking-tight">
                {coolActionTitle}
              </h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-200">
                <MedalIcon size={14} weight="fill" />
                {points} pontos
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs font-medium text-foreground/60 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <StackIcon size={16} weight="fill" />
              {category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <MapPinLineIcon size={16} weight="fill" />
              {neighborhood}
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-2 dark:bg-white/5">
              <CalendarDotsIcon size={16} weight="fill" />
              {formatDoneCoolActionDate(createdAt)}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-3 xl:justify-self-end xl:self-center">
            {onEdit ? (
              <button
                type="button"
                title="Editar ação"
                aria-label="Editar ação"
                onClick={onEdit}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-foreground/10 bg-background/80 text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
              >
                <PencilSimpleLineIcon size={20} weight="bold" />
              </button>
            ) : null}

            {onDelete ? (
              <button
                type="button"
                title="Remover ação"
                aria-label="Remover ação"
                onClick={onDelete}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-destructive-500/25 bg-destructive-500/10 text-destructive-600 transition hover:bg-destructive-500/15 dark:text-destructive-300"
              >
                <TrashIcon size={20} weight="fill" />
              </button>
            ) : null}
          </div>
        )}

        <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03] xl:col-span-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Descrição
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/75 sm:text-[0.95rem]">
            {description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-full">
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
              Endereço
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
              {street}
            </p>
          </div>
        </div>

        {mapAddress ? (
          <div className="xl:col-span-full">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground/60">
              Localização no mapa
            </h3>
            <GoogleMapsRender
              address={mapAddress}
              aspect="4:3"
              minHeight={300}
              borderRadius={4}
              containerClassName="mt-3"
              title={`Mapa da ação ${coolActionTitle}`}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
