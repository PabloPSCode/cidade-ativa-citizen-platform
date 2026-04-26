"use client";

import {
  CalendarDotsIcon,
  ChatCircleTextIcon,
  MapPinAreaIcon,
  MapPinLineIcon,
  SpinnerGapIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import {
  GoogleMapsRender,
  ProductImageVisualizer as ProductVisualizer,
} from "../../libs/react-ultimate-components/src";
import {
  formatSolicitationDate,
  solicitationStatusMap,
  type SolicitationRecord,
} from "../constants/solicitations";

export interface SolicitationDetailsCardProps
  extends Omit<SolicitationRecord, "id"> {
  className?: string;
}

function DetailsInfoBlock({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-[1.35rem] bg-background/80 p-4 dark:bg-white/[0.03]",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
        {label}
      </p>
      <div className="mt-2 flex items-start gap-2 text-sm font-semibold text-foreground sm:text-base">
        {icon && <span className="mt-0.5 shrink-0 text-foreground/55">{icon}</span>}
        <div className="min-w-0">{value}</div>
      </div>
    </div>
  );
}

function DetailsTextSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.6rem] border border-border-card/60 bg-background/70 p-5 dark:bg-white/[0.02]">
      <h3 className="text-lg font-black tracking-tight">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-foreground/75 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function DetailsImageSection({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  return (
    <section className="rounded-[1.6rem] border border-border-card/60 bg-background/70 p-5 dark:bg-white/[0.02]">
      <h3 className="text-lg font-black tracking-tight">{title}</h3>

      {images.length > 0 ? (
        <ProductVisualizer
          images={images.map((src, index) => ({
            src,
            alt: `${title} ${index + 1}`,
          }))}
          className="mt-4 rounded-[1.2rem] bg-transparent"
          mainImageClassName="rounded-[1.2rem]"
          thumbClassName="rounded-xl"
        />
      ) : (
        <div className="mt-4 rounded-[1.2rem] border border-dashed border-foreground/15 bg-bg-card p-8 text-sm text-foreground/60">
          Nenhuma imagem complementar foi adicionada até o momento.
        </div>
      )}
    </section>
  );
}

export default function SolicitationDetailsCard({
  protocolNumber,
  requestingUserId,
  description,
  resolutionComment,
  imageUrls,
  resolutionImageUrls,
  neighborhood,
  createdAt,
  resolvedAt,
  street,
  mapAddress,
  status,
  className,
}: SolicitationDetailsCardProps) {
  const statusConfig = solicitationStatusMap[status];

  return (
    <article
      className={clsx(
        "solicitation-details-card Container rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] sm:p-6 lg:p-8",
        className
      )}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DetailsInfoBlock label="Solicitação" value={protocolNumber} />

        <DetailsInfoBlock
          label="Status"
          value={
            <span
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:text-sm",
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
          }
        />

        <DetailsInfoBlock
          label="Data de cadastro"
          icon={<CalendarDotsIcon size={18} weight="fill" />}
          value={formatSolicitationDate(createdAt)}
        />

        <DetailsInfoBlock
          label="Requerente"
          icon={<UserCircleIcon size={18} weight="fill" />}
          value={requestingUserId}
        />

        <DetailsInfoBlock
          label="Data de resolução"
          icon={<SpinnerGapIcon size={18} weight="bold" />}
          value={formatSolicitationDate(resolvedAt)}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <DetailsTextSection title="Descrição">{description}</DetailsTextSection>
        <DetailsTextSection title="Comentário">
          <div className="flex items-start gap-3">
            <ChatCircleTextIcon
              size={20}
              weight="fill"
              className="mt-1 shrink-0 text-foreground/55"
            />
            <p>{resolutionComment}</p>
          </div>
        </DetailsTextSection>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <DetailsInfoBlock
          label="Endereço"
          icon={<MapPinLineIcon size={18} weight="fill" />}
          value={street}
          className="min-h-[7.5rem]"
        />
        <DetailsInfoBlock
          label="Bairro"
          icon={<MapPinAreaIcon size={18} weight="fill" />}
          value={neighborhood}
          className="min-h-[7.5rem]"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <section className="rounded-[1.6rem] border border-border-card/60 bg-background/70 p-5 dark:bg-white/[0.02]">
          <h3 className="text-lg font-black tracking-tight">
            Localização no mapa
          </h3>
          <GoogleMapsRender
            address={mapAddress}
            aspect="4:3"
            minHeight={300}
            borderRadius={22}
            containerClassName="mt-4"
            title={`Mapa da solicitação ${protocolNumber}`}
          />
        </section>

        <DetailsImageSection title="Imagens antes" images={imageUrls} />
        <DetailsImageSection
          title="Imagens depois"
          images={resolutionImageUrls}
        />
      </div>
    </article>
  );
}
