"use client";

import { IdentificationCardIcon } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { Section } from "../../../../../libs/react-ultimate-components/src";
import SolicitationDetailsCard from "../../../../components/SolicitationDetailsCard";
import {
  buildCitizenLegalActionStatusLabel,
  getCitizenLegalActionByIds,
} from "../../../../constants/citizen-legal";

export default function CitizenLegalActionDetailsPage() {
  const params = useParams();
  const paramCitizenId = Array.isArray(params?.citizenId)
    ? params.citizenId[params.citizenId.length - 1]
    : params?.citizenId;
  const paramActionId = Array.isArray(params?.actionId)
    ? params.actionId[params.actionId.length - 1]
    : params?.actionId;
  const citizenId = paramCitizenId ?? "";
  const actionId = paramActionId ?? "";
  const action = getCitizenLegalActionByIds(citizenId, actionId);

  if (!action) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">Ação não encontrada</h1>
            <p className="mt-2 text-sm text-foreground/65">
              Não foi possível localizar os detalhes da ação selecionada.
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
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <IdentificationCardIcon size={22} weight="fill" />
            <span>Detalhes da ação cidadã</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Ação {action.protocolNumber}
            </h1>
            <p className="text-sm leading-6 text-foreground/70 sm:text-base">
              Exibindo os detalhes da ação vinculada a {action.citizenName}.
            </p>
          </div>
        </section>

        <SolicitationDetailsCard
          {...action}
          entityLabel="Ação cidadã"
          statusLabel={buildCitizenLegalActionStatusLabel(action.status)}
          requestingUserLabel="Cidadão"
          resolutionCommentLabel="Impacto gerado"
          resolvedAtLabel="Data de conclusão"
          mapSectionTitle="Localização da ação"
          mapTitlePrefix="Mapa da ação"
          beforeImagesLabel="Registros da ação"
          afterImagesLabel="Resultados da mobilização"
        />
      </Section>
    </main>
  );
}
