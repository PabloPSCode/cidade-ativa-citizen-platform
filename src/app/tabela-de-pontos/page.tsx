import { MedalIcon } from "@phosphor-icons/react/dist/ssr";
import { Section, SimpleTable } from "../../libs/react-ultimate-components/src";
import { getServerAuthToken } from "../../lib/server-auth";
import { listCoolActions } from "../../services/cool-actions";

const tableHeadersMap = {
  title: "Título",
  category: "Categoria",
  points: "Pontos",
};

/** Converte categorias cruas (ex.: "PUBLIC_LIGHTING") em rótulos legíveis. */
const normalizeCategory = (category: string) =>
  (category ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

export default async function PointsTablePage() {
  const token = await getServerAuthToken();
  const coolActionsResult = await listCoolActions({ perPage: 100 }, token).catch(
    () => null,
  );

  const coolActions = coolActionsResult?.data ?? [];

  const rows = coolActions.map((action) => ({
    title: action.title,
    category: normalizeCategory(action.category),
    points: action.points,
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <MedalIcon size={22} weight="fill" />
            <span>Cidadão Legal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Tabela de pontos
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Cada ação legal registrada na plataforma rende pontos para o
              Ranking Cidadão Legal. Confira abaixo as ações registradas na
              plataforma.
            </p>
          </div>
        </section>

        <section>
          <SimpleTable
            data={rows}
            tableHeadersMap={tableHeadersMap}
            moneyColumns={[]}
            narrowColumns={["points"]}
            stripped
          />
        </section>
      </Section>
    </main>
  );
}
