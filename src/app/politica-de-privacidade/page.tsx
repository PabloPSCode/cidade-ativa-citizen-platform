import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Section } from "../../libs/react-ultimate-components/src";

export const metadata = {
  title: "Política de Privacidade | CidadeAtiva",
  description:
    "Saiba como a CidadeAtiva coleta, utiliza, compartilha e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
};

const LAST_UPDATED = "17 de junho de 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
            <ShieldCheckIcon size={22} weight="fill" />
            <span>Política de Privacidade</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Política de Privacidade
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
              Esta Política de Privacidade explica como a CidadeAtiva coleta,
              utiliza, armazena, compartilha e protege os seus dados pessoais,
              em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de
              Dados Pessoais – LGPD) e com o Marco Civil da Internet (Lei nº
              12.965/2014).
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
              Última atualização: {LAST_UPDATED}
            </p>
          </div>
        </section>

        <article className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:p-7">
          <Clause title="1. Quem somos e a quem se aplica esta Política">
            <p>
              A CidadeAtiva é uma plataforma cívica que permite aos cidadãos
              cadastrar, acompanhar e ajudar a resolver situações da sua cidade,
              além de participar do programa de reconhecimento Cidadão Legal.
            </p>
            <p>
              Esta Política se aplica a todos os usuários da plataforma, sejam
              eles visitantes que apenas consultam as solicitações públicas ou
              usuários cadastrados que utilizam os recursos completos. O
              tratamento dos dados é realizado pelo órgão público responsável
              pela operação da plataforma na sua cidade, na qualidade de{" "}
              <strong>controlador</strong>, com apoio técnico do operador
              responsável pelo desenvolvimento e manutenção do serviço.
            </p>
          </Clause>

          <Clause title="2. Definições importantes">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Dado pessoal:</strong> informação relacionada a pessoa
                natural identificada ou identificável.
              </li>
              <li>
                <strong>Titular:</strong> a pessoa natural a quem se referem os
                dados pessoais tratados.
              </li>
              <li>
                <strong>Tratamento:</strong> toda operação realizada com dados
                pessoais, como coleta, uso, armazenamento, compartilhamento e
                eliminação.
              </li>
              <li>
                <strong>Controlador:</strong> a quem competem as decisões sobre
                o tratamento dos dados pessoais.
              </li>
              <li>
                <strong>Operador:</strong> quem realiza o tratamento em nome do
                controlador.
              </li>
              <li>
                <strong>Encarregado (DPO):</strong> pessoa indicada para atuar
                como canal de comunicação entre o controlador, os titulares e a
                Autoridade Nacional de Proteção de Dados (ANPD).
              </li>
            </ul>
          </Clause>

          <Clause title="3. Quais dados coletamos">
            <p>Coletamos apenas os dados necessários ao funcionamento da plataforma:</p>
            <p className="font-semibold text-foreground">3.1. Dados de cadastro</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Nome completo;</li>
              <li>Endereço de e-mail;</li>
              <li>
                Senha de acesso (armazenada de forma criptografada, nunca em
                texto puro);
              </li>
              <li>Endereço, bairro, cidade e UF (quando informados).</li>
            </ul>

            <p className="font-semibold text-foreground">
              3.2. Dados de autenticação com o Google
            </p>
            <p>
              Caso você opte por entrar com a sua Conta Google, recebemos do
              provedor de identidade (Firebase Authentication, do Google) o seu
              nome, endereço de e-mail e foto de perfil, utilizados apenas para
              criar e autenticar a sua conta.
            </p>

            <p className="font-semibold text-foreground">
              3.3. Dados das solicitações e ações
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Título, descrição, bairro e endereço das solicitações que você
                cadastra;
              </li>
              <li>
                Fotos enviadas para comprovar a situação e a sua resolução —
                atenção: imagens podem conter dados pessoais de terceiros (como
                rostos ou placas de veículos);
              </li>
              <li>
                Dados das ações do Cidadão Legal (tipo da ação, descrição,
                bairro, endereço e foto da ação realizada);
              </li>
              <li>Histórico de pontuação e posição no Ranking Cidadão Legal.</li>
            </ul>

            <p className="font-semibold text-foreground">
              3.4. Dados técnicos e de navegação
            </p>
            <p>
              Para manter você conectado, armazenamos no seu navegador (em
              <em> local storage</em>) um token de autenticação e os dados
              básicos do seu perfil. Também podemos registrar dados técnicos de
              acesso e logs, conforme exigido pelo Marco Civil da Internet.
            </p>
          </Clause>

          <Clause title="4. Para que utilizamos os seus dados (finalidades)">
            <ul className="list-disc space-y-2 pl-5">
              <li>Criar, autenticar e administrar a sua conta;</li>
              <li>
                Permitir o cadastro, a consulta e o acompanhamento de
                solicitações;
              </li>
              <li>
                Viabilizar a participação no programa Cidadão Legal e o cálculo
                da pontuação e do ranking;
              </li>
              <li>
                Dar publicidade e transparência às demandas da cidade e ao seu
                andamento;
              </li>
              <li>Garantir a segurança, prevenir fraudes e abusos;</li>
              <li>
                Cumprir obrigações legais, regulatórias e requisições de
                autoridades.
              </li>
            </ul>
          </Clause>

          <Clause title="5. Bases legais para o tratamento">
            <p>
              Tratamos os seus dados com fundamento nas hipóteses do art. 7º da
              LGPD, especialmente:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Execução de contrato</strong> e procedimentos
                preliminares, para fornecer os recursos da plataforma a você;
              </li>
              <li>
                <strong>Cumprimento de obrigação legal ou regulatória</strong>{" "}
                pelo controlador;
              </li>
              <li>
                <strong>Execução de políticas públicas</strong> e do interesse
                público, no atendimento às demandas da cidade;
              </li>
              <li>
                <strong>Legítimo interesse</strong>, para segurança e melhoria
                do serviço, sempre respeitando os seus direitos;
              </li>
              <li>
                <strong>Consentimento</strong>, quando aplicável e solicitado de
                forma específica e destacada.
              </li>
            </ul>
          </Clause>

          <Clause title="6. Conteúdo público e transparência">
            <p>
              Por sua natureza cívica, as solicitações cadastradas, suas fotos,
              o bairro e o andamento, bem como o nome do cidadão e a posição no
              Ranking Cidadão Legal, podem ser exibidos publicamente na
              plataforma, inclusive a usuários não cadastrados. Ao publicar
              conteúdo, evite incluir dados sensíveis ou informações pessoais de
              terceiros que não sejam estritamente necessárias.
            </p>
          </Clause>

          <Clause title="7. Compartilhamento de dados">
            <p>Podemos compartilhar dados pessoais com:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                O órgão público (prefeitura) responsável pelo atendimento das
                solicitações;
              </li>
              <li>
                Prestadores de serviços de tecnologia que atuam como operadores
                (como provedores de hospedagem e o Google/Firebase para
                autenticação);
              </li>
              <li>
                Autoridades públicas, quando houver requisição legal ou ordem
                judicial.
              </li>
            </ul>
            <p>Não vendemos os seus dados pessoais.</p>
          </Clause>

          <Clause title="8. Transferência internacional de dados">
            <p>
              Alguns prestadores, como o Google/Firebase, podem armazenar ou
              processar dados em servidores localizados fora do Brasil. Nesses
              casos, adotamos salvaguardas para assegurar que a transferência
              ocorra em conformidade com a LGPD.
            </p>
          </Clause>

          <Clause title="9. Armazenamento local e cookies">
            <p>
              Utilizamos o armazenamento local do navegador (
              <em>local storage</em>) para manter a sua sessão ativa e melhorar
              a sua experiência. Você pode limpar esses dados a qualquer momento
              nas configurações do seu navegador; ao fazê-lo, será necessário
              autenticar-se novamente.
            </p>
          </Clause>

          <Clause title="10. Segurança e retenção dos dados">
            <p>
              Adotamos medidas técnicas e administrativas para proteger os seus
              dados contra acessos não autorizados e situações de destruição,
              perda ou alteração. As senhas são armazenadas de forma
              criptografada e o acesso à plataforma é protegido por token de
              autenticação.
            </p>
            <p>
              Mantemos os dados pelo tempo necessário às finalidades descritas
              nesta Política ou para o cumprimento de obrigações legais. Quando
              você solicita a exclusão de um registro, adotamos a técnica de
              exclusão lógica (<em>soft delete</em>), de modo que o conteúdo
              deixa de ser exibido, podendo ser mantido por prazo adicional para
              fins de segurança, auditoria e cumprimento legal.
            </p>
          </Clause>

          <Clause title="11. Direitos do titular">
            <p>
              Nos termos do art. 18 da LGPD, você pode, a qualquer momento,
              requerer:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>
                Anonimização, bloqueio ou eliminação de dados desnecessários ou
                tratados em desconformidade com a lei;
              </li>
              <li>Portabilidade dos dados, observados os segredos legais;</li>
              <li>
                Eliminação dos dados tratados com base no seu consentimento;
              </li>
              <li>
                Informação sobre o compartilhamento dos seus dados;
              </li>
              <li>
                Revogação do consentimento e informação sobre as consequências
                da negativa.
              </li>
            </ul>
            <p>
              Para exercer esses direitos, utilize os canais indicados na seção
              de contato abaixo.
            </p>
          </Clause>

          <Clause title="12. Dados de crianças e adolescentes">
            <p>
              A plataforma destina-se a maiores de 18 anos. O tratamento de
              dados de crianças e adolescentes, quando ocorrer, observará o seu
              melhor interesse, nos termos do art. 14 da LGPD, exigindo o
              consentimento específico de pelo menos um dos pais ou do
              responsável legal.
            </p>
          </Clause>

          <Clause title="13. Alterações desta Política">
            <p>
              Esta Política pode ser atualizada a qualquer momento para refletir
              melhorias na plataforma ou mudanças legais. A data da última
              atualização é indicada no topo deste documento. Recomendamos a sua
              revisão periódica.
            </p>
          </Clause>

          <Clause title="14. Encarregado (DPO) e contato">
            <p>
              Para exercer os seus direitos, esclarecer dúvidas ou apresentar
              solicitações relacionadas aos seus dados pessoais, entre em
              contato com o Encarregado pelo Tratamento de Dados Pessoais pelo
              e-mail{" "}
              <a
                href="mailto:contato@plssistemas.com.br"
                className="font-medium text-primary-600 transition hover:text-primary-700"
              >
                contato@plssistemas.com.br
              </a>
              .
            </p>
            <p>
              Você também pode apresentar reclamações à Autoridade Nacional de
              Proteção de Dados (ANPD). Para conhecer outras informações sobre a
              plataforma, consulte a página de{" "}
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
