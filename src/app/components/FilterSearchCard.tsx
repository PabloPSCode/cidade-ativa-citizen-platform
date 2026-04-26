"use client";

import {
  ArrowsDownUpIcon,
  FunnelSimpleIcon,
  MapPinIcon,
  SpinnerGapIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import { SearchInput } from "../../libs/react-ultimate-components/src";
import type { SolicitationStatus } from "../constants/solicitations";

export interface FilterSearchCardProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  neighborhood: string;
  neighborhoods: string[];
  onNeighborhoodChange: (value: string) => void;
  status: SolicitationStatus | "all";
  statuses: Array<{
    value: SolicitationStatus;
    label: string;
  }>;
  onStatusChange: (value: SolicitationStatus | "all") => void;
  requestingUserId: string;
  requestingUsers: string[];
  onRequestingUserIdChange: (value: string) => void;
  dateOrder: "recent" | "oldest";
  onDateOrderChange: (value: "recent" | "oldest") => void;
  onResetFilters: () => void;
  className?: string;
}

const selectClassName =
  "h-12 w-full rounded-[1.2rem] border border-border-card/60 bg-background/80 px-4 text-sm font-semibold text-foreground outline-none transition focus:border-foreground/30 dark:bg-white/[0.03]";

export default function FilterSearchCard({
  search,
  setSearch,
  neighborhood,
  neighborhoods,
  onNeighborhoodChange,
  status,
  statuses,
  onStatusChange,
  requestingUserId,
  requestingUsers,
  onRequestingUserIdChange,
  dateOrder,
  onDateOrderChange,
  onResetFilters,
  className,
}: FilterSearchCardProps) {
  return (
    <section
      className={clsx(
        "filter-search-card Container flex flex-col gap-4",
        className
      )}
    >
      <SearchInput
        search={search}
        setSearch={setSearch}
        variant="citizen"
        placeholder="Pesquise por uma situação ou bairro"
      />

      <div className="rounded-[1.85rem] border border-border-card/70 bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-foreground sm:text-base">
            <span className="rounded-2xl bg-background/80 p-3 dark:bg-white/[0.03]">
              <FunnelSimpleIcon size={18} weight="fill" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span>Filtro</span>
              <span className="text-foreground/35">-</span>
              <span className="text-foreground/65">Ordenar por:</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-sm font-semibold text-foreground/60 transition hover:text-foreground"
          >
            Limpar filtros
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <MapPinIcon size={14} weight="fill" />
              Bairro
            </span>
            <select
              value={neighborhood}
              onChange={(event) => onNeighborhoodChange(event.target.value)}
              className={selectClassName}
            >
              <option value="all">Todos os bairros</option>
              {neighborhoods.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <SpinnerGapIcon size={14} weight="bold" />
              Status
            </span>
            <select
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as SolicitationStatus | "all")
              }
              className={selectClassName}
            >
              <option value="all">Todos os status</option>
              {statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <UserCircleIcon size={14} weight="fill" />
              Requerente
            </span>
            <select
              value={requestingUserId}
              onChange={(event) => onRequestingUserIdChange(event.target.value)}
              className={selectClassName}
            >
              <option value="all">Todos os requerentes</option>
              {requestingUsers.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <ArrowsDownUpIcon size={14} weight="bold" />
              Data da solicitação
            </span>
            <select
              value={dateOrder}
              onChange={(event) =>
                onDateOrderChange(event.target.value as "recent" | "oldest")
              }
              className={selectClassName}
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
