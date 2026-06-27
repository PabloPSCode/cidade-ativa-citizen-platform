"use client";

import { MedalIcon } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PaginationList,
  Section,
} from "../../../libs/react-ultimate-components/src";
import {
  listCoolActions,
  type CoolActionResponseDTO,
} from "../../../services/cool-actions";
import { listDoneCoolActions } from "../../../services/done-cool-actions";
import { getUserById } from "../../../services/users";
import DoneCoolActionCard from "../../components/DoneCoolActionCard";
import {
  mapDoneCoolActionToRecord,
  type DoneCoolActionRecord,
} from "../../constants/done-cool-actions";

export default function CitizenLegalActionsPage() {
  const params = useParams();
  const paramCitizenId = Array.isArray(params?.citizenId)
    ? params.citizenId[params.citizenId.length - 1]
    : params?.citizenId;
  const citizenId = paramCitizenId ?? "";

  const [citizenName, setCitizenName] = useState("");
  const [records, setRecords] = useState<DoneCoolActionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [citizenId]);

  useEffect(() => {
    if (!citizenId) return;

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setNotFound(false);

      try {
        const [user, doneResult, coolActionsResult] = await Promise.all([
          getUserById(citizenId).catch(() => null),
          listDoneCoolActions({ userId: citizenId, perPage: 100 }),
          listCoolActions({ perPage: 100 }),
        ]);

        if (cancelled) return;

        if (!user) {
          setNotFound(true);
          return;
        }

        const coolActionsById = new Map<string, CoolActionResponseDTO>(
          coolActionsResult.data.map((item) => [item.id, item])
        );

        setCitizenName(user.name);
        setRecords(
          doneResult.data.map((item) =>
            mapDoneCoolActionToRecord(item, coolActionsById)
          )
        );
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [citizenId]);

  if (!isLoading && notFound) {
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
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <MedalIcon size={22} weight="fill" />
            <span>Ações do Cidadão Legal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {citizenName ? `Ações de ${citizenName}` : "Ações do cidadão"}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Veja as ações legais registradas por este participante do ranking
              Cidadão Legal.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                {isLoading
                  ? "Carregando ações..."
                  : `${records.length} ações cadastradas`}
              </h2>
              <p className="text-sm text-foreground/65">
                Cada cartão exibe os detalhes completos da ação realizada.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
              <p className="text-sm text-foreground/65">Carregando ações...</p>
            </div>
          ) : records.length > 0 ? (
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
              {records.map((record) => (
                <DoneCoolActionCard
                  key={record.id}
                  coolActionTitle={record.coolActionTitle}
                  category={record.category}
                  points={record.points}
                  description={record.description}
                  neighborhood={record.neighborhood}
                  street={record.street}
                  actionPhotoURL={record.actionPhotoURL}
                  createdAt={record.createdAt}
                />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhuma ação cadastrada</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Este cidadão ainda não possui ações legais registradas.
              </p>
            </div>
          )}
        </section>
      </Section>
    </main>
  );
}
