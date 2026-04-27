"use client";

import { UserCircleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  PaginationList,
  Section,
} from "../../libs/react-ultimate-components/src";
import FilterSearchCard from "../components/FilterSearchCard";
import SolicitationCard from "../components/SolicitationCard";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";
import {
  buildSolicitationDetailsHref,
  getSolicitationsByRequestingUserId,
  type SolicitationRecord,
  solicitationStatusMap,
  type SolicitationStatus,
} from "../constants/solicitations";

export default function MySolicitationsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated } = useAuth();
  const [mySolicitations, setMySolicitations] = useState<SolicitationRecord[]>(
    []
  );
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
    if (hasHydrated && !isAuthenticated) {
      router.replace(buildScopedHref(pathname, "/"));
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (authenticatedUser) {
      setMySolicitations(
        getSolicitationsByRequestingUserId(authenticatedUser.name)
      );
    }
  }, [authenticatedUser]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedNeighborhood,
    selectedStatus,
    selectedRequestingUserId,
    dateOrder,
  ]);

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">Carregando autenticação</h1>
            <p className="mt-2 text-sm text-foreground/65">
              Aguarde enquanto validamos sua sessão local.
            </p>
          </section>
        </Section>
      </main>
    );
  }

  if (!isAuthenticated || !authenticatedUser) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">Redirecionando</h1>
            <p className="mt-2 text-sm text-foreground/65">
              Esta área está disponível apenas para usuários autenticados.
            </p>
          </section>
        </Section>
      </main>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSolicitations = mySolicitations
    .filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
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

  const neighborhoodOptions = Array.from(
    new Set(mySolicitations.map((item) => item.neighborhood))
  ).sort((left, right) => left.localeCompare(right));

  const requestingUserOptions = [authenticatedUser.name];

  const statusOptions = (
    Object.keys(solicitationStatusMap) as SolicitationStatus[]
  ).map((status) => ({
    value: status,
    label: solicitationStatusMap[status].label,
  }));

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

  const handleDeleteSolicitation = (solicitationId: string) => {
    setMySolicitations((currentItems) =>
      currentItems.filter((item) => item.id !== solicitationId)
    );
  };

  const handleEditSolicitation = (solicitationId: string) => {
    router.push(
      buildScopedHref(
        pathname,
        `${buildSolicitationDetailsHref(solicitationId)}?modo=edicao`
      )
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
                <UserCircleIcon size={22} weight="fill" />
                <span>Minhas solicitações</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Minhas solicitações
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                  Gerencie as solicitações cadastradas por você, acompanhe o
                  status atual e acesse rapidamente as ações disponíveis para
                  cada registro.
                </p>
              </div>

              <p className="text-sm font-medium text-foreground/70 sm:text-base">
                Você possui{" "}
                <span className="font-bold text-foreground">
                  {mySolicitations.length} solicitações cadastradas
                </span>
                .
              </p>
            </div>

            <Button
              type="button"
              label="Cadastrar situação"
              className="w-full justify-center rounded-2xl px-6 py-3 text-sm font-bold !bg-emerald-600 hover:!bg-emerald-500 sm:w-auto"
            />
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
                Listagem das minhas solicitações
              </h2>
              <p className="text-sm text-foreground/65">
                {hasActiveFilters
                  ? `Exibindo ${filteredSolicitations.length} de ${mySolicitations.length} resultados encontrados.`
                  : `Exibindo ${filteredSolicitations.length} resultados cadastrados por ${authenticatedUser.name}.`}
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
                  requestingUserId={solicitation.requestingUserId}
                  description={solicitation.description}
                  imageUrls={solicitation.imageUrls}
                  neighborhood={solicitation.neighborhood}
                  createdAt={solicitation.createdAt}
                  street={solicitation.street}
                  status={solicitation.status}
                  detailsHref={buildScopedHref(
                    pathname,
                    buildSolicitationDetailsHref(solicitation.id)
                  )}
                  onEdit={() => handleEditSolicitation(solicitation.id)}
                  onDelete={() => handleDeleteSolicitation(solicitation.id)}
                />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhuma solicitação encontrada</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Ajuste sua busca ou limpe os filtros para voltar a visualizar
                os registros cadastrados.
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
