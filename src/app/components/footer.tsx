import Image from "next/image";
import Link from "next/link";
import { getServerAuthToken } from "../../lib/server-auth";
import { listPublicPhones } from "../../services/public-phones";

const navigationLinks = [
  { href: "/#solicitacoes-gerais", label: "Solicitações" },
  { href: "/cidadao-legal", label: "Cidadão legal" },
  { href: "/enquetes", label: "Enquetes" },
  { href: "/duvidas", label: "Dúvidas" },
];

const policyLinks = [
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
];

export default async function Footer() {
  // Escopo de cidade do usuário autenticado vem do token no cookie (SSR).
  const token = await getServerAuthToken();
  const phonesResult = await listPublicPhones({ perPage: 50 }, token).catch(
    () => null,
  );
  const phones = phonesResult?.data ?? [];

  return (
    <footer
      id="cidadao-legal"
      className="border-t border-border-card bg-bg-card text-foreground"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <Link href="/" aria-label="CidadeAtiva">
              <Image
                src="/logo_text.png"
                alt="CidadeAtiva"
                width={160}
                height={44}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-foreground/60 text-sm max-w-[22ch] text-center sm:text-left">
              Uma cidade melhor depende de todos.
            </p>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
              Navegue
            </h2>
            <ul className="space-y-3 text-sm text-foreground/75">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
              Termos e políticas
            </h2>
            <ul className="space-y-3 text-sm text-foreground/75">
              {policyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
              Telefones úteis
            </h2>
            <ul className="grid gap-2 text-sm text-foreground/75">
              {phones.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-center gap-4 sm:justify-between"
                >
                  <span>{item.institutionName}</span>
                  <span className="font-medium text-foreground">
                    {item.phone}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-card pt-6 text-sm text-foreground/65">
          <p>
            2026, Desenvolvido por{" "}
            <a
              href="https://www.plssistemas.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition hover:text-primary-600"
            >
              PLS Sistemas
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
