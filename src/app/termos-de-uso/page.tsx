import { FileTextIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Section } from "../../libs/react-ultimate-components/src";

export const metadata = {
  title: "Termos de Uso | CidadeAtiva",
  description:
    "Conheça os Termos de Uso da CidadeAtiva: regras de cadastro, conduta, conteúdo do usuário, programa Cidadão Legal e responsabilidades ao utilizar a plataforma.",
};

const LAST_UPDATED = "17 de junho de 2026";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <FileTextIcon size={22} weight="fill" />
            <span>Termos de Uso</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Termos de Uso
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Estes Termos de Uso regulam o acesso e a utilização da plataforma
              CidadeAtiva. Ao criar uma conta ou utilizar a plataforma, você
              declara ter lido, compreendido e aceito integralmente estas
              condições.
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
              Última atualização: {LAST_UPDATED}
            </p>
          </div>
        </section>

        <article className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:p-7">
          <Clause title="1. Aceitação dos Termos">
            <p>
              Ao acessar ou utilizar a CidadeAtiva, você concorda com estes
              Termos de Uso e com a nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="font-medium text-primary-600 transition hover:text-primary-700"
              >
                Política de Privacidade
              </Link>
              . Caso não concorde com qualquer condição, você não deve utilizar
              a plataforma.
            </p>
            <p>
              Visitantes podem consultar livremente as solicitações públicas. Os
              recursos de cadastro, edição e participação no programa Cidadão
              Legal exigem a criação de uma conta.
            </p>
          </Clause>

          <Clause title="2. Definições">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Plataforma:</strong> o serviço CidadeAtiva, acessível
                via web.
              </li>
              <li>
                <strong>Usuário:</strong> qualquer pessoa que acessa ou utiliza
                a plataforma, com ou sem cadastro.
              </li>
              <li>
                <strong>Conteúdo do usuário:</strong> textos, descrições, fotos
                e demais informações enviadas pelo usuário, como solicitações e
                ações.
              </li>
              <li>
                <strong>Solicitação:</strong> registro de uma situação da cidade
                cadastrado na plataforma.
              </li>
              <li>
                <strong>Cidadão Legal:</strong> programa de reconhecimento que
                atribui pontos às ações realizadas pelos cidadãos.
              </li>
            </ul>
          </Clause>

          <Clause title="3. Descrição do serviço">
            <p>
              A CidadeAtiva é uma plataforma cívica que permite aos cidadãos
              cadastrar e acompanhar situações da cidade, anexar fotos que
              comprovem a situação e a sua resolução, consultar publicamente as
              demandas e participar do programa Cidadão Legal, que reconhece as
              boas ações por meio de pontuação e ranking.
            </p>
            <p>
              A plataforma é uma ferramenta de colaboração e transparência e não
              substitui os canais oficiais de emergência. Em situações de
              urgência, procure os serviços públicos competentes.
            </p>
          </Clause>

          <Clause title="4. Cadastro e conta">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                O cadastro pode ser realizado por meio da sua Conta Google,
                seguido do preenchimento dos dados solicitados;
              </li>
              <li>
                Você se compromete a fornecer informações verdadeiras, exatas e
                atualizadas;
              </li>
              <li>
                A conta é pessoal e intransferível. Você é responsável por
                manter a confidencialidade das suas credenciais e por todas as
                atividades realizadas na sua conta;
              </li>
              <li>
                A plataforma destina-se a maiores de 18 anos ou a menores
                devidamente representados ou assistidos por seus responsáveis
                legais;
              </li>
              <li>
                Notifique-nos imediatamente em caso de uso não autorizado da sua
                conta.
              </li>
            </ul>
          </Clause>

          <Clause title="5. Regras de conduta">
            <p>Ao utilizar a plataforma, você concorda em não:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Publicar conteúdo falso, enganoso, difamatório, ofensivo, ilegal
                ou que viole direitos de terceiros;
              </li>
              <li>
                Cadastrar solicitações ou ações fraudulentas ou em duplicidade
                para obter vantagem indevida no Cidadão Legal;
              </li>
              <li>
                Publicar dados pessoais ou sensíveis de terceiros sem
                fundamento legal ou necessidade;
              </li>
              <li>
                Enviar conteúdo que contenha discurso de ódio, violência,
                pornografia ou que explore crianças e adolescentes;
              </li>
              <li>
                Tentar comprometer a segurança, a integridade ou a
                disponibilidade da plataforma, ou acessar dados de forma não
                autorizada;
              </li>
              <li>
                Utilizar a plataforma para finalidades comerciais não
                autorizadas, spam ou automações abusivas.
              </li>
            </ul>
          </Clause>

          <Clause title="6. Conteúdo do usuário">
            <p>
              Você é o único responsável pelo conteúdo que cadastra e declara
              possuir os direitos necessários para publicá-lo, inclusive sobre
              as imagens enviadas. Lembre-se de que solicitações, fotos, bairro,
              andamento e a identificação do autor podem ser exibidos
              publicamente, inclusive a usuários não cadastrados.
            </p>
            <p>
              Ao publicar conteúdo, você concede à plataforma uma licença não
              exclusiva e gratuita para hospedar, exibir e divulgar esse
              conteúdo na CidadeAtiva, com a finalidade de operar o serviço e dar
              transparência às demandas da cidade.
            </p>
            <p>
              Evite incluir dados pessoais de terceiros (como rostos ou placas de
              veículos) que não sejam estritamente necessários ao registro da
              situação.
            </p>
          </Clause>

          <Clause title="7. Programa Cidadão Legal">
            <p>
              O programa Cidadão Legal atribui pontos às ações registradas,
              conforme valores definidos pelo órgão público responsável, gerando
              um ranking público dos cidadãos mais engajados.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                A pontuação e a posição no ranking são públicas e baseadas nos
                registros válidos;
              </li>
              <li>
                Eventuais premiações dependem das regras definidas pelo órgão
                público e não constituem obrigação da plataforma;
              </li>
              <li>
                Ações fraudulentas ou em desacordo com estes Termos podem ser
                desconsideradas, e os pontos correspondentes, revertidos.
              </li>
            </ul>
          </Clause>

          <Clause title="8. Moderação e remoção de conteúdo">
            <p>
              Podemos analisar, recusar, ocultar ou remover conteúdo que viole
              estes Termos ou a legislação aplicável, a qualquer tempo. Quando um
              registro é excluído, é adotada a técnica de exclusão lógica
              (<em>soft delete</em>): o conteúdo deixa de ser exibido, mas pode
              ser mantido por prazo adicional para fins de segurança, auditoria e
              cumprimento de obrigações legais.
            </p>
            <p>
              Você pode editar ou solicitar a remoção do conteúdo que cadastrou
              por meio das áreas correspondentes da plataforma.
            </p>
          </Clause>

          <Clause title="9. Propriedade intelectual">
            <p>
              A marca, o logotipo, a identidade visual, o software e os demais
              elementos da CidadeAtiva são protegidos por direitos de propriedade
              intelectual e não podem ser utilizados, copiados ou reproduzidos
              sem autorização prévia. A licença concedida sobre o conteúdo do
              usuário (item 6) não transfere a sua titularidade.
            </p>
          </Clause>

          <Clause title="10. Disponibilidade e isenção de garantias">
            <p>
              Empenhamo-nos para manter a plataforma disponível e funcional, mas
              ela é fornecida “no estado em que se encontra”, podendo passar por
              interrupções, manutenções ou indisponibilidades temporárias. Não
              garantimos que o serviço estará livre de erros ou de falhas.
            </p>
          </Clause>

          <Clause title="11. Limitação de responsabilidade">
            <p>
              Na máxima extensão permitida pela legislação, a CidadeAtiva e o
              órgão público responsável não respondem por danos decorrentes do
              uso indevido da plataforma, da veracidade do conteúdo publicado
              pelos usuários ou de indisponibilidades alheias ao seu controle. A
              responsabilidade pelo conteúdo é de quem o publicou.
            </p>
          </Clause>

          <Clause title="12. Privacidade e proteção de dados">
            <p>
              O tratamento dos seus dados pessoais é regido pela nossa{" "}
              <Link
                href="/politica-de-privacidade"
                className="font-medium text-primary-600 transition hover:text-primary-700"
              >
                Política de Privacidade
              </Link>
              , elaborada em conformidade com a Lei nº 13.709/2018 (LGPD) e com o
              Marco Civil da Internet (Lei nº 12.965/2014).
            </p>
          </Clause>

          <Clause title="13. Suspensão e encerramento de conta">
            <p>
              Podemos suspender ou encerrar o seu acesso, no todo ou em parte,
              caso seja identificada violação destes Termos, da legislação ou
              risco à segurança da plataforma e de seus usuários. Você também
              pode solicitar o encerramento da sua conta a qualquer momento.
            </p>
          </Clause>

          <Clause title="14. Alterações dos Termos">
            <p>
              Estes Termos podem ser atualizados a qualquer momento para refletir
              melhorias na plataforma ou mudanças legais. A data da última
              atualização é indicada no topo deste documento. O uso continuado
              após alterações implica concordância com as novas condições.
            </p>
          </Clause>

          <Clause title="15. Legislação aplicável e foro">
            <p>
              Estes Termos são regidos pela legislação brasileira, em especial
              pelo Código de Defesa do Consumidor, pelo Marco Civil da Internet e
              pela LGPD. Fica eleito o foro da comarca do domicílio do usuário
              para dirimir eventuais controvérsias, quando aplicável.
            </p>
          </Clause>

          <Clause title="16. Contato">
            <p>
              Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail{" "}
              <a
                href="mailto:contato@plssistemas.com.br"
                className="font-medium text-primary-600 transition hover:text-primary-700"
              >
                contato@plssistemas.com.br
              </a>
              . Para outras informações, consulte a página de{" "}
              <Link
                href="/duvidas"
                className="font-medium text-primary-600 transition hover:text-primary-700"
              >
                Dúvidas
              </Link>
              .
            </p>
          </Clause>
        </article>
      </Section>
    </main>
  );
}

function Clause({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-black tracking-tight sm:text-xl">{title}</h2>
      <div className="space-y-3 text-sm leading-6 text-foreground/75 sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  );
}
