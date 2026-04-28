"use client";

import { ScalesIcon } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PaginationList,
  Section,
} from "../../../libs/react-ultimate-components/src";
import SolicitationCard from "../../components/SolicitationCard";
import {
  buildCitizenLegalActionDetailsHref,
  buildCitizenLegalActionStatusLabel,
  getCitizenActionsByCitizenId,
  getCitizenById,
} from "../../constants/citizen-legal";

export default function CitizenLegalActionsPage() {
  const params = useParams();
  const paramCitizenId = Array.isArray(params?.citizenId)
    ? params.citizenId[params.citizenId.length - 1]
    : params?.citizenId;
  const citizenId = paramCitizenId ?? "";
  const citizen = getCitizenById(citizenId);
  const actions = getCitizenActionsByCitizenId(citizenId);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [citizenId]);

  if (!citizen) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">Cidadão não encontrado</h1>
            <p className="mt-2 text-sm text-foreground/65">
              Não foi possível localizar o cidadão selecionado no ranking atual.
            </p>
          </section>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
            <ScalesIcon size={22} weight="fill" />
            <span>Ações do Cidadão Legal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Ações de {citizen.fullName}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Veja as ações cidadãs mockadas vinculadas a este participante do
              ranking. A listagem abaixo usa o mesmo padrão visual das
              solicitações e está paginada para navegação mais confortável.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                {actions.length} ações cadastradas
              </h2>
              <p className="text-sm text-foreground/65">
                Selecione uma ação para abrir os detalhes completos.
              </p>
            </div>
          </div>

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
            {actions.map((action) => (
              <SolicitationCard
                key={action.id}
                title={action.title}
                requestingUserId={action.requestingUserId}
                description={action.description}
                imageUrls={action.imageUrls}
                neighborhood={action.neighborhood}
                createdAt={action.createdAt}
                street={action.street}
                status={action.status}
                titleLabel="Ação cidadã"
                requestingUserLabel="Cidadão"
                statusLabel={buildCitizenLegalActionStatusLabel(action.status)}
                detailsButtonLabel="Ver ação"
                detailsHref={buildCitizenLegalActionDetailsHref(
                  citizen.id,
                  action.id
                )}
              />
            ))}
          </PaginationList>
        </section>
      </Section>
    </main>
  );
}
