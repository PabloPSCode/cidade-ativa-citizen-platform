"use client";

import {
  ArrowsDownUpIcon,
  FunnelSimpleIcon,
  MapPinIcon,
  SpinnerGapIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import {
  SearchInput,
  SelectInput,
} from "../../libs/react-ultimate-components/src";
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
  requestingUsers: Array<{ id: string; name: string }>;
  onRequestingUserIdChange: (value: string) => void;
  dateOrder: "recent" | "oldest";
  onDateOrderChange: (value: "recent" | "oldest") => void;
  onResetFilters: () => void;
  showRequestingUserFilter?: boolean;
  className?: string;
}

const labelClassName =
  "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45";

const SEARCH_SCROLL_DELAY_MS = 2000;
const SEARCH_RESULTS_SECTION_ID = "solicitacoes-listagem";

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
  showRequestingUserFilter = true,
  className,
}: FilterSearchCardProps) {
  useEffect(() => {
    if (search.trim().length === 0) return;

    const timeoutId = window.setTimeout(() => {
      document
        .getElementById(SEARCH_RESULTS_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, SEARCH_SCROLL_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const neighborhoodOptions = [
    { label: "Todos os bairros", value: "all" },
    ...neighborhoods.map((option) => ({ label: option, value: option })),
  ];
  const statusOptions = [
    { label: "Todos os status", value: "all" },
    ...statuses.map((option) => ({ label: option.label, value: option.value })),
  ];
  const requestingUserOptions = [
    { label: "Todos os requerentes", value: "all" },
    ...requestingUsers.map((option) => ({
      label: option.name,
      value: option.id,
    })),
  ];
  const dateOrderOptions = [
    { label: "Mais recentes", value: "recent" },
    { label: "Mais antigas", value: "oldest" },
  ];

  const findOption = (
    items: Array<{ label: string; value: string }>,
    value: string
  ) => items.find((option) => option.value === value) ?? null;

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
          <SelectInput
            label={
              <>
                <MapPinIcon size={14} weight="fill" />
                Bairro
              </>
            }
            labelClassName={labelClassName}
            options={neighborhoodOptions}
            value={findOption(neighborhoodOptions, neighborhood)}
            onSelectOption={(option) =>
              onNeighborhoodChange(String(option?.value ?? "all"))
            }
            placeholder="Todos os bairros"
            containerClassName="w-full"
          />

          <SelectInput
            label={
              <>
                <SpinnerGapIcon size={14} weight="bold" />
                Status
              </>
            }
            labelClassName={labelClassName}
            options={statusOptions}
            value={findOption(statusOptions, status)}
            onSelectOption={(option) =>
              onStatusChange(
                (option?.value ?? "all") as SolicitationStatus | "all"
              )
            }
            placeholder="Todos os status"
            isSearchable={false}
            containerClassName="w-full"
          />

          {showRequestingUserFilter && (
            <SelectInput
              label={
                <>
                  <UserCircleIcon size={14} weight="fill" />
                  Requerente
                </>
              }
              labelClassName={labelClassName}
              options={requestingUserOptions}
              value={findOption(requestingUserOptions, requestingUserId)}
              onSelectOption={(option) =>
                onRequestingUserIdChange(String(option?.value ?? "all"))
              }
              placeholder="Todos os requerentes"
              containerClassName="w-full"
            />
          )}

          <SelectInput
            label={
              <>
                <ArrowsDownUpIcon size={14} weight="bold" />
                Data da solicitação
              </>
            }
            labelClassName={labelClassName}
            options={dateOrderOptions}
            value={findOption(dateOrderOptions, dateOrder)}
            onSelectOption={(option) =>
              onDateOrderChange((option?.value ?? "recent") as "recent" | "oldest")
            }
            placeholder="Ordenar por data"
            isSearchable={false}
            containerClassName="w-full"
          />
        </div>
      </div>
    </section>
  );
}
