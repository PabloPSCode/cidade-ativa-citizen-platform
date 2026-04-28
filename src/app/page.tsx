"use client";

import {
  BuildingsIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  PaginationList,
  Section,
} from "../libs/react-ultimate-components/src";
import FilterSearchCard from "./components/FilterSearchCard";
import SolicitationCard from "./components/SolicitationCard";
import {
  buildSolicitationDetailsHref,
  mockedSolicitations,
  neighborhoodOptions,
  requestingUserOptions,
  solicitationStats,
  statusOptions,
  type SolicitationStatus,
} from "./constants/solicitations";
import { buildScopedHref } from "./lib/site-paths";

const formatCountLabel = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    SolicitationStatus | "all"
  >("all");
  const [selectedRequestingUserId, setSelectedRequestingUserId] =
    useState("all");
  const [dateOrder, setDateOrder] = useState<"recent" | "oldest">("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedNeighborhood,
    selectedStatus,
    selectedRequestingUserId,
    dateOrder,
  ]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSolicitations = mockedSolicitations
    .filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          item.title,
          item.description,
          item.neighborhood,
          item.street,
          item.requestingUserId,
          item.protocolNumber,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesNeighborhood =
        selectedNeighborhood === "all" ||
        item.neighborhood === selectedNeighborhood;

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      const matchesRequestingUser =
        selectedRequestingUserId === "all" ||
        item.requestingUserId === selectedRequestingUserId;

      return (
        matchesSearch &&
        matchesNeighborhood &&
        matchesStatus &&
        matchesRequestingUser
      );
    })
    .sort((left, right) => {
      const leftDate = new Date(left.createdAt).getTime();
      const rightDate = new Date(right.createdAt).getTime();

      return dateOrder === "recent"
        ? rightDate - leftDate
        : leftDate - rightDate;
    });

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedNeighborhood !== "all" ||
    selectedStatus !== "all" ||
    selectedRequestingUserId !== "all" ||
    dateOrder !== "recent";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedNeighborhood("all");
    setSelectedStatus("all");
    setSelectedRequestingUserId("all");
    setDateOrder("recent");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="home-page-section items-stretch gap-10 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section
          id="solicitacoes-gerais"
          className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
                <BuildingsIcon size={22} weight="fill" />
                <span>Solicitações gerais</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Painel cidadão de solicitações urbanas
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                  Consulte situações reportadas pela comunidade, filtre por
                  bairro, status e requerente, e acompanhe a data de cadastro
                  das ocorrências.
                </p>
              </div>

              <p className="text-sm font-medium text-foreground/70 sm:text-base">
                Atualmente existem{" "}
                <span className="font-bold text-foreground">
                  {solicitationStats.total} solicitações cadastradas
                </span>
                .
              </p>
            </div>

            <Button
              type="button"
              label="Cadastrar situação"
              onClick={() =>
                router.push(buildScopedHref(pathname, "/cadastrar-situacao"))
              }
              className="w-full justify-center rounded-2xl px-6 py-3 text-sm font-bold !bg-emerald-600 hover:!bg-emerald-500 sm:w-auto"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            <article className="rounded-[1.75rem] border border-border-card/70 bg-bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-foreground/5 p-3 dark:bg-white/5">
                  <ChartBarIcon size={22} weight="fill" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Total
                  </p>
                  <p className="text-2xl font-black">{solicitationStats.total}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                {formatCountLabel(
                  solicitationStats.total,
                  "registro",
                  "registros"
                )}{" "}
                da comunidade nesta listagem mockada.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-amber-500/20 bg-bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-600 dark:text-amber-300">
                  <ClockCountdownIcon size={22} weight="fill" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Pendentes
                  </p>
                  <p className="text-2xl font-black">
                    {solicitationStats.pending}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                Casos que ainda aguardam uma resposta definitiva.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-sky-500/20 bg-bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-600 dark:text-sky-300">
                  <BuildingsIcon size={22} weight="fill" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Em andamento
                  </p>
                  <p className="text-2xl font-black">
                    {solicitationStats.inProgress}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                Demandas acompanhadas pelos setores responsáveis.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-emerald-500/20 bg-bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-600 dark:text-emerald-300">
                  <CheckCircleIcon size={22} weight="fill" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Resolvidas
                  </p>
                  <p className="text-2xl font-black">
                    {solicitationStats.resolved}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                Solicitações marcadas como concluídas no fluxo atual.
              </p>
            </article>
          </div>
        </section>

        <FilterSearchCard
          search={search}
          setSearch={setSearch}
          neighborhood={selectedNeighborhood}
          neighborhoods={neighborhoodOptions}
          onNeighborhoodChange={setSelectedNeighborhood}
          status={selectedStatus}
          statuses={statusOptions}
          onStatusChange={(value) =>
            setSelectedStatus(value as SolicitationStatus | "all")
          }
          requestingUserId={selectedRequestingUserId}
          requestingUsers={requestingUserOptions}
          onRequestingUserIdChange={setSelectedRequestingUserId}
          dateOrder={dateOrder}
          onDateOrderChange={setDateOrder}
          onResetFilters={handleResetFilters}
        />

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                Listagem de solicitações
              </h2>
              <p className="text-sm text-foreground/65">
                {hasActiveFilters
                  ? `Exibindo ${filteredSolicitations.length} de ${solicitationStats.total} resultados encontrados.`
                  : `Exibindo ${filteredSolicitations.length} resultados mais recentes.`}
              </p>
            </div>
          </div>

          {filteredSolicitations.length > 0 ? (
            <PaginationList
              page={page}
              itemsPerPage={5}
              pagesToShow={4}
              onPageChange={setPage}
              containerClassName="w-full"
              listClassName="gap-5"
              navigationClassName="rounded-[1.75rem] border border-border-card/70 bg-bg-card px-4 py-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)] sm:px-5"
              previousButtonLabel="Anterior"
              nextButtonLabel="Próximo"
              previousButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              nextButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              pageNumberClassName="rounded-full text-sm font-semibold"
              activePageNumberClassName="border border-foreground/15 bg-foreground text-background"
              inactivePageNumberClassName="border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5"
              showItemsPerPageSelect={false}
              showFirstLastButtons={false}
            >
              {filteredSolicitations.map((solicitation) => (
                <SolicitationCard
                  key={solicitation.id}
                  title={solicitation.title}
                  requestingUserId={solicitation.requestingUserId}
                  description={solicitation.description}
                  imageUrls={solicitation.imageUrls}
                  neighborhood={solicitation.neighborhood}
                  createdAt={solicitation.createdAt}
                  street={solicitation.street}
                  status={solicitation.status}
                  detailsHref={buildSolicitationDetailsHref(solicitation.id)}
                />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhum resultado encontrado</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Ajuste a busca ou limpe os filtros para visualizar as
                solicitações mockadas novamente.
              </p>
              <Button
                type="button"
                label="Limpar filtros"
                onClick={handleResetFilters}
                className="mx-auto mt-6 rounded-2xl px-5 py-3 text-sm font-semibold !bg-emerald-600 hover:!bg-emerald-500"
              />
            </div>
          )}
        </section>
      </Section>
    </main>
  );
}
