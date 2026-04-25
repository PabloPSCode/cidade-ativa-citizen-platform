"use client";

import {
  BuildingsIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  Button,
  PaginationList,
  Section,
} from "../libs/react-ultimate-components/src";
import FilterSearchCard from "./components/FilterSearchCard";
import SolicitationCard, {
  type SolicitationCardProps,
  type SolicitationStatus,
  solicitationStatusMap,
} from "./components/SolicitationCard";

interface MockedSolicitation extends SolicitationCardProps {
  id: string;
}

const requesterNames = [
  "Jose Antonio da Silva",
  "Maria Clara Souza",
  "Andre Luiz Pereira",
  "Helena Aparecida Rocha",
  "Roberto Nunes Costa",
  "Paula Cristina Martins",
];

const baseSolicitations: Array<
  Omit<MockedSolicitation, "id" | "createdAt" | "requestingUserId" | "status">
> = [
  {
    description:
      "Lote vazio tomado por mato alto, descarte irregular e focos de agua parada bloqueando a passagem de pedestres e ciclistas.",
    neighborhood: "Nova Esperanca",
    street: "Rua das Acacias, 142",
    imageUrls: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    description:
      "Bueiro sem tampa em frente a escola municipal, com risco constante para criancas, motociclistas e moradores da rua.",
    neighborhood: "Jardim Primavera",
    street: "Avenida Central, 820",
    imageUrls: [
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    description:
      "Iluminacao publica apagada em tres postes consecutivos, deixando o trecho escuro e inseguro durante a noite.",
    neighborhood: "Vila Aurora",
    street: "Rua Francisco Melo, 51",
    imageUrls: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    description:
      "Calcada quebrada e inclinada na area da UBS, dificultando o acesso de cadeirantes e idosos ao atendimento.",
    neighborhood: "Centro",
    street: "Praca da Matriz, 12",
    imageUrls: [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    description:
      "Acumulo frequente de lixo organico em esquina residencial, atraindo insetos, mau cheiro e animais.",
    neighborhood: "Parque dos Girassois",
    street: "Rua das Rosas, 204",
    imageUrls: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    description:
      "Sinalizacao horizontal quase apagada em cruzamento muito movimentado, com varios relatos de quase acidentes.",
    neighborhood: "Residencial do Lago",
    street: "Rua do Comercio, 331",
    imageUrls: [
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

const solicitationStatuses: SolicitationStatus[] = [
  "not_resolved",
  "in_progress",
  "resolved",
];

const mockedSolicitations: MockedSolicitation[] = Array.from(
  { length: 18 },
  (_, index) => {
    const seed = baseSolicitations[index % baseSolicitations.length];
    const month = index % 4;
    const day = 3 + index;

    return {
      id: `sol-${index + 1}`,
      requestingUserId: requesterNames[index % requesterNames.length],
      createdAt: new Date(2026, month, day).toISOString(),
      status: solicitationStatuses[index % solicitationStatuses.length],
      ...seed,
    };
  }
);

const neighborhoodOptions = Array.from(
  new Set(mockedSolicitations.map((item) => item.neighborhood))
).sort((left, right) => left.localeCompare(right));

const requestingUserOptions = Array.from(
  new Set(mockedSolicitations.map((item) => item.requestingUserId))
).sort((left, right) => left.localeCompare(right));

const statusOptions = solicitationStatuses.map((status) => ({
  value: status,
  label: solicitationStatusMap[status].label,
}));

const stats = {
  total: mockedSolicitations.length,
  pending: mockedSolicitations.filter(
    (item) => item.status === "not_resolved"
  ).length,
  inProgress: mockedSolicitations.filter(
    (item) => item.status === "in_progress"
  ).length,
  resolved: mockedSolicitations.filter((item) => item.status === "resolved")
    .length,
};

const formatCountLabel = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

export default function Home() {
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
          item.description,
          item.neighborhood,
          item.street,
          item.requestingUserId,
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
                <span>Solicitacoes gerais</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Painel cidadao de solicitacoes urbanas
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                  Consulte situacoes reportadas pela comunidade, filtre por
                  bairro, status e requerente, e acompanhe a data de cadastro
                  das ocorrencias.
                </p>
              </div>

              <p className="text-sm font-medium text-foreground/70 sm:text-base">
                Atualmente existem{" "}
                <span className="font-bold text-foreground">
                  {stats.total} solicitacoes cadastradas
                </span>
                .
              </p>
            </div>

            <Button
              type="button"
              label="Cadastrar situacao"
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
                  <p className="text-2xl font-black">{stats.total}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                {formatCountLabel(stats.total, "registro", "registros")} da
                comunidade nesta listagem mockada.
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
                  <p className="text-2xl font-black">{stats.pending}</p>
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
                  <p className="text-2xl font-black">{stats.inProgress}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                Demandas acompanhadas pelos setores responsaveis.
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
                  <p className="text-2xl font-black">{stats.resolved}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/65">
                Solicitacoes marcadas como concluidas no fluxo atual.
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
                Listagem de solicitacoes
              </h2>
              <p className="text-sm text-foreground/65">
                {hasActiveFilters
                  ? `Exibindo ${filteredSolicitations.length} de ${stats.total} resultados encontrados.`
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
              nextButtonLabel="Proximo"
              previousButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              nextButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              pageNumberClassName="rounded-full text-sm font-semibold"
              activePageNumberClassName="border border-foreground/15 bg-foreground text-background"
              inactivePageNumberClassName="border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5"
              showItemsPerPageSelect={false}
              showFirstLastButtons={false}
            >
              {filteredSolicitations.map((solicitation) => (
                <SolicitationCard key={solicitation.id} {...solicitation} />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhum resultado encontrado</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Ajuste a busca ou limpe os filtros para visualizar as
                solicitacoes mockadas novamente.
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
