import Link from "next/link";
import { QuestionIcon } from "@phosphor-icons/react/dist/ssr";
import { Section } from "../../libs/react-ultimate-components/src";
import CollapsibleFaq, { FaqItem } from "../components/CollapsibleFaq";

const faqItems: FaqItem[] = [
  {
    question: "A CidadeAtiva é gratuita para os cidadãos?",
    answer:
      "Sim. Qualquer cidadão pode criar uma conta, cadastrar solicitações e acompanhar o andamento das situações da sua cidade sem nenhum custo.",
  },
  {
    question: "Como faço para criar uma conta?",
    answer:
      "É rápido: basta entrar com a sua Conta Google e completar um breve cadastro com seus dados. A partir daí você já pode cadastrar e acompanhar solicitações.",
  },
  {
    question: "Como faço para cadastrar uma solicitação?",
    answer:
      'Acesse a plataforma, clique em "Nova solicitação" e informe um título, uma descrição e ao menos uma foto que comprove a situação. Em poucos passos sua solicitação fica disponível para consulta pública.',
  },
  {
    question: "Posso editar ou excluir uma solicitação que cadastrei?",
    answer:
      "Sim. Em \"Minhas solicitações\" você encontra todas as situações que cadastrou e pode editar as informações ou removê-las a qualquer momento.",
  },
  {
    question: "O que significam os status das solicitações?",
    answer:
      '"Não resolvido" indica que a situação ainda não foi tratada, "Em andamento" mostra que já existe uma ação em curso e "Resolvido" sinaliza que o problema foi solucionado e comprovado por foto.',
  },
  {
    question: "Como acompanho o andamento de uma situação?",
    answer:
      "Todas as solicitações são públicas. Você pode pesquisar e filtrar pelas situações da sua cidade e acompanhar a evolução do status de cada uma diretamente na plataforma, sem precisar de conta.",
  },
  {
    question: "Quem resolve as situações cadastradas?",
    answer:
      "A própria prefeitura ou qualquer cidadão pode colaborar para a resolução. Basta anexar uma foto que comprove que a situação foi resolvida e marcá-la como concluída.",
  },
  {
    question: "Como funcionam os pontos do Ranking Cidadão Legal?",
    answer:
      "A cada ação resolvida a plataforma computa pontos de acordo com os valores atribuídos pela prefeitura. Os cidadãos com mais pontos sobem no ranking e podem ser premiados.",
  },
  {
    question: "Como é calculada a pontuação do cidadão legal?",
    answer: (
      <>
        O cálculo é baseado em uma tabela de ações.{" "}
        <Link
          href="/cidadao-legal-calculo"
          className="font-medium text-primary-600 transition hover:text-primary-700"
        >
          Clique aqui para saber mais
        </Link>
        .
      </>
    ),
  },
  {
    question: "Minhas informações ficam públicas?",
    answer:
      "O acompanhamento das solicitações é público para garantir transparência, mas seus dados pessoais são tratados conforme a nossa Política de Privacidade.",
  },
];

export default function DoubtsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <QuestionIcon size={22} weight="fill" />
            <span>Dúvidas frequentes</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Perguntas frequentes
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Reunimos abaixo as principais dúvidas sobre a CidadeAtiva. Clique
              em uma pergunta para ver a resposta.
            </p>
          </div>
        </section>

        <CollapsibleFaq items={faqItems} />
      </Section>
    </main>
  );
}
