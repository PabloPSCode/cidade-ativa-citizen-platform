import { MedalIcon } from "@phosphor-icons/react/dist/ssr";
import { Section } from "../../libs/react-ultimate-components/src";
import { getServerAuthToken } from "../../lib/server-auth";
import { listDoneCoolActionsRanking } from "../../services/done-cool-actions";
import RankingCard from "../components/RankingCard";
import {
  buildCitizenLegalCitizenActionsHref,
  citizenLegalMonthLabel,
} from "../constants/citizen-legal";

export default async function CitizenLegalPage() {
  const token = await getServerAuthToken();
  const rankingResult = await listDoneCoolActionsRanking(token).catch(
    () => null,
  );
  const rankingItems = (rankingResult ?? []).slice(0, 10);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <MedalIcon size={22} weight="fill" />
            <span>Cidadão Legal - {citizenLegalMonthLabel}</span>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl mb-2">
              Ranking de boas ações para a cidade
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Boas ações merecem reconhecimento e destaque.
            </p>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Veja abaixo o ranking Cidadão Legal com os 10 cidadãos mais
              engajados neste ciclo.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {rankingItems.length > 0 ? (
            rankingItems.map((item) => (
              <RankingCard
                key={item.userId}
                position={item.rank}
                fullName={item.userName}
                points={item.totalPoints}
                actionsCount={item.actionsCount}
                actionsHref={buildCitizenLegalCitizenActionsHref(item.userId)}
              />
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">
                Nenhum cidadão no ranking ainda
              </h3>
              <p className="mt-2 text-sm text-foreground/65">
                Assim que as ações legais forem registradas, o ranking Cidadão
                Legal aparecerá aqui.
              </p>
            </div>
          )}
        </section>
      </Section>
    </main>
  );
}
