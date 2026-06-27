"use client";

import Image from "next/image";

import {
  BuildingsIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  PaginationList,
  Section,
} from "../libs/react-ultimate-components/src";
import { listSolicitations } from "../services/solicitations";
import FilterSearchCard from "./components/FilterSearchCard";
import GoogleSignInScreen from "./components/GoogleSignInScreen";
import SolicitationCard from "./components/SolicitationCard";
import {
  buildSolicitationDetailsHref,
  isSolicitationOpen,
  mapSolicitationDTOToRecord,
  MAX_OPEN_SOLICITATIONS,
  publicStatusOptions,
  type SolicitationRecord,
  type SolicitationStatus,
} from "./constants/solicitations";
import { useAuth } from "./hooks/useAuth";
import { useNeighborhoods } from "./hooks/useNeighborhoods";
import { buildScopedHref } from "./lib/site-paths";

const formatCountLabel = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, isAuthenticated, hasHydrated } = useAuth();
  const { neighborhoods: neighborhoodOptions } = useNeighborhoods();
  const [solicitations, setSolicitations] = useState<SolicitationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    // A home é restrita: só buscamos as solicitações para usuários logados.
    if (!isAuthenticated) return;

    let cancelled = false;

    async function fetchSolicitations() {
      setIsLoading(true);
      try {
        const result = await listSolicitations({ page: 1, perPage: 100 });
        if (!cancelled) {
          setSolicitations(result.data.map(mapSolicitationDTOToRecord));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSolicitations();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedNeighborhood,
    selectedStatus,
    selectedRequestingUserId,
    dateOrder,
  ]);

  // Solicitations awaiting approval are private to their owner, so the public
  // listing, stats and filters are derived from the visible subset only.
  const visibleSolicitations = solicitations.filter(
    (item) => item.status !== "waiting_approval",
  );

  // The open-solicitations limit considers every unresolved solicitation owned
  // by the user, including those still awaiting approval.
  const myOpenSolicitationsCount = authenticatedUser
    ? solicitations.filter(
        (item) =>
          item.requestingUserId === authenticatedUser.userId &&
          isSolicitationOpen(item.status),
      ).length
    : 0;
  const hasReachedOpenLimit =
    myOpenSolicitationsCount >= MAX_OPEN_SOLICITATIONS;

  const requestingUserOptions = Array.from(
    new Map(
      visibleSolicitations.map((item) => [
        item.requestingUserId,
        { id: item.requestingUserId, name: item.requestingUserName },
      ]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const solicitationStats = {
    total: visibleSolicitations.length,
    pending: visibleSolicitations.filter(
      (item) => item.status === "not_resolved",
    ).length,
    inProgress: visibleSolicitations.filter(
      (item) => item.status === "in_progress",
    ).length,
    resolved: visibleSolicitations.filter((item) => item.status === "resolved")
      .length,
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSolicitations = visibleSolicitations
    .filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          item.title,
          item.description,
          item.neighborhood,
          item.street,
          item.requestingUserName,
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

  const handleIndicatorFilterClick = (status: SolicitationStatus | "all") => {
    setSelectedStatus(status);

    window.requestAnimationFrame(() => {
      document
        .getElementById("solicitacoes-listagem")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const solicitationIndicatorCards = [
    {
      label: "Total",
      count: solicitationStats.total,
      description: `${formatCountLabel(
        solicitationStats.total,
        "registro",
        "registros",
      )} da comunidade nesta listagem.`,
      status: "all" as const,
      icon: ChartBarIcon,
      iconClassName: "text-foreground/75",
    },
    {
      label: "Pendentes",
      count: solicitationStats.pending,
      description: "Casos que ainda aguardam uma resposta definitiva.",
      status: "not_resolved" as const,
      icon: ClockCountdownIcon,
      iconClassName: "text-alert-700 dark:text-alert-100",
    },
    {
      label: "Em andamento",
      count: solicitationStats.inProgress,
      description: "Demandas acompanhadas pelos setores responsáveis.",
      status: "in_progress" as const,
      icon: BuildingsIcon,
      iconClassName: "text-info-700 dark:text-info-100",
    },
    {
      label: "Resolvidas",
      count: solicitationStats.resolved,
      description: "Solicitações marcadas como concluídas no fluxo atual.",
      status: "resolved" as const,
      icon: CheckCircleIcon,
      iconClassName: "text-success-700 dark:text-success-100",
    },
  ];

  // Aguarda a hidratação do estado de autenticação antes de decidir o que exibir.
  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Loading"
            width={100}
            height={100}
            className="h-12 w-auto"
          />
          <p className="text-sm text-foreground/65">Carregando...</p>
        </div>
      </main>
    );
  }

  // Home restrita: visitantes não autenticados veem apenas o login do Google.
  if (!isAuthenticated) {
    return <GoogleSignInScreen />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="home-page-section items-stretch gap-10 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section
          id="solicitacoes-gerais"
          className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                <BuildingsIcon size={22} weight="fill" />
                <span>Solicitações gerais</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Painel de solicitações gerais
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                  Consulte situações reportadas pela comunidade, filtre por
                  bairro, status e acompanhe a data de cadastro das ocorrências.
                </p>
              </div>

              {!isLoading && (
                <p className="text-sm font-medium text-foreground/70 sm:text-base">
                  Atualmente existem{" "}
                  <span className="font-bold text-foreground">
                    {solicitationStats.total} solicitações cadastradas
                  </span>
                  .
                </p>
              )}
            </div>

            {isAuthenticated && (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                <Button
                  type="button"
                  label="Cadastrar solicitação"
                  disabled={hasReachedOpenLimit}
                  onClick={() =>
                    router.push(
                      buildScopedHref(pathname, "/cadastrar-situacao"),
                    )
                  }
                  className="w-full justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600 disabled:cursor-not-allowed disabled:!bg-primary-500/50 sm:w-auto"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {solicitationIndicatorCards.map((card) => {
              const Icon = card.icon;
              const isActive = selectedStatus === card.status;

              return (
                <button
                  key={card.status}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleIndicatorFilterClick(card.status)}
                  className={clsx(
                    "flex h-full flex-col items-stretch rounded-sm border border-border-card bg-bg-card p-5 text-left shadow-sm transition hover:border-foreground/25 hover:bg-foreground/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
                    isActive && "border-primary-500/45 bg-primary-500/5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "rounded-sm bg-foreground/5 p-3 dark:bg-white/5",
                        card.iconClassName,
                      )}
                    >
                      <Icon size={22} weight="fill" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                        {card.label}
                      </p>
                      <p className="text-2xl font-black">
                        {isLoading ? "—" : card.count}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-foreground/65">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <FilterSearchCard
          search={search}
          setSearch={setSearch}
          neighborhood={selectedNeighborhood}
          neighborhoods={neighborhoodOptions}
          onNeighborhoodChange={setSelectedNeighborhood}
          status={selectedStatus}
          statuses={publicStatusOptions}
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

        <section id="solicitacoes-listagem" className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                Listagem de solicitações
              </h2>
              <p className="text-sm text-foreground/65">
                {isLoading
                  ? "Carregando solicitações..."
                  : hasActiveFilters
                    ? `Exibindo ${filteredSolicitations.length} de ${solicitationStats.total} resultados encontrados.`
                    : `Exibindo ${filteredSolicitations.length} resultados mais recentes.`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
              <p className="text-sm text-foreground/65">
                Carregando solicitações da comunidade...
              </p>
            </div>
          ) : filteredSolicitations.length > 0 ? (
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
              pageNumberClassName="rounded-sm text-sm font-medium"
              activePageNumberClassName="border border-foreground/15 bg-foreground !text-background"
              inactivePageNumberClassName="border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5"
              showItemsPerPageSelect={false}
              showFirstLastButtons={false}
            >
              {filteredSolicitations.map((solicitation) => (
                <SolicitationCard
                  key={solicitation.id}
                  title={solicitation.title}
                  protocolNumber={solicitation.protocolNumber}
                  requestingUserId={solicitation.requestingUserId}
                  requestingUserName={solicitation.requestingUserName}
                  description={solicitation.description}
                  imageUrls={solicitation.imageUrls}
                  neighborhood={solicitation.neighborhood}
                  createdAt={solicitation.createdAt}
                  street={solicitation.street}
                  status={solicitation.status}
                  isCollective={solicitation.isCollective}
                  detailsHref={buildSolicitationDetailsHref(solicitation.id)}
                />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhum resultado encontrado</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Ajuste a busca ou limpe os filtros para visualizar as
                solicitações novamente.
              </p>
              <Button
                type="button"
                label="Limpar filtros"
                onClick={handleResetFilters}
                className="mx-auto mt-6 rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600"
              />
            </div>
          )}
        </section>
      </Section>
    </main>
  );
}
