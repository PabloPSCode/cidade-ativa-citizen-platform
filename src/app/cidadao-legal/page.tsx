import { ScalesIcon } from "@phosphor-icons/react/dist/ssr";
import { Section } from "../../libs/react-ultimate-components/src";
import RankingCard from "../components/RankingCard";
import {
  citizenLegalMonthLabel,
  citizenLegalRanking,
} from "../constants/citizen-legal";

export default function CitizenLegalPage() {
  const rankingItems = citizenLegalRanking.slice(0, 10);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
            <ScalesIcon size={22} weight="fill" />
            <span>Cidadão Legal - {citizenLegalMonthLabel}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Ranking de boas ações para a cidade
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Boas ações merecem reconhecimento e destaque. Veja abaixo o
              ranking Cidadão Legal com os 10 cidadãos mais engajados neste
              ciclo.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {rankingItems.map((item) => (
            <RankingCard
              key={item.id}
              position={item.position}
              fullName={item.fullName}
              points={item.points}
              createdAt={item.createdAt}
            />
          ))}
        </section>
      </Section>
    </main>
  );
}
