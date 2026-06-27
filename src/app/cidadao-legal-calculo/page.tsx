import { CalculatorIcon } from "@phosphor-icons/react/dist/ssr";
import { Section } from "../../libs/react-ultimate-components/src";
import { getServerAuthToken } from "../../lib/server-auth";
import { listSolicitationTypes } from "../../services/solicitation-types";

export default async function CitizenLegalCalculationPage() {
  const token = await getServerAuthToken();
  const typesResult = await listSolicitationTypes({ perPage: 100 }, token).catch(
    () => null,
  );
  const types = typesResult?.data ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <CalculatorIcon size={22} weight="fill" />
            <span>Cálculo da pontuação</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Como é calculada a pontuação
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              A cada situação resolvida na plataforma o cidadão recebe pontos de
              acordo com o tipo de ação. Os valores são definidos pela prefeitura
              e somados ao longo do ciclo, formando o Ranking Cidadão Legal.
              Confira abaixo a tabela com a pontuação de cada tipo de ação.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-border-card/70 bg-white/70 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80">
          {types.length === 0 ? (
            <p className="p-6 text-sm text-foreground/70">
              Nenhum tipo de ação cadastrado no momento.
            </p>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border-card/70 text-foreground/60">
                  <th className="px-6 py-4 font-medium uppercase tracking-[0.12em]">
                    Tipo de ação
                  </th>
                  <th className="px-6 py-4 text-right font-medium uppercase tracking-[0.12em]">
                    Pontos
                  </th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr
                    key={type.id}
                    className="border-b border-border-card/40 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-foreground/85">
                      {type.description}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">
                      {type.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </Section>
    </main>
  );
}
