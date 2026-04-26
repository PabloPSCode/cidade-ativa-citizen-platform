import { IdentificationCardIcon } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { Section } from "../../../libs/react-ultimate-components/src";
import SolicitationDetailsCard from "../../components/SolicitationDetailsCard";
import { getSolicitationById } from "../../constants/solicitations";

export default async function SolicitationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const solicitation = getSolicitationById(id);

  if (!solicitation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
            <IdentificationCardIcon size={22} weight="fill" />
            <span>Detalhes da solicitação</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Solicitação {solicitation.protocolNumber}
            </h1>
            <p className="text-sm leading-6 text-foreground/70 sm:text-base">
              Exibindo detalhes da solicitação {solicitation.protocolNumber}.
            </p>
          </div>
        </section>

        <SolicitationDetailsCard {...solicitation} />
      </Section>
    </main>
  );
}
