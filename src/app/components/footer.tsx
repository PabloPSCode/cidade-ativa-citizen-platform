import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { href: "/#sobre", label: "O que é a CidadeAtiva?" },
  { href: "/#como-funciona", label: "Como funciona?" },
  { href: "/#duvidas", label: "Dúvidas" },
  { href: "/#solicitacoes-gerais", label: "Solicitações" },
  { href: "/cidadao-legal", label: "Cidadão legal" },
];

const policyLinks = [
  { href: "#", label: "Política de Privacidade" },
  { href: "#", label: "Termos de Uso" },
];

const usefulPhones = [
  { label: "Bombeiros", phone: "193" },
  { label: "Polícia Militar", phone: "190" },
  { label: "Prefeitura", phone: "156" },
  { label: "SAMU", phone: "192" },
  { label: "Defesa Civil", phone: "199" },
  { label: "Guarda Municipal", phone: "153" },
];

export default function Footer() {
  return (
    <footer
      id="cidadao-legal"
      className="border-t border-border-card bg-bg-card text-foreground"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Cidade Ativa"
                width={200}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="max-w-xs text-sm leading-6 text-foreground/65">
              Uma cidade melhor depende de todos.
            </p>
          </div>

          <div className="space-y-4">
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

          <div className="space-y-4">
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

          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
              Telefones úteis
            </h2>
            <ul className="grid gap-3 text-sm text-foreground/80">
              {usefulPhones.map((item) => (
                <li key={item.label}>
                  <Link
                    href={`tel:${item.phone}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-background/60 px-4 py-3 transition hover:border-black/10 hover:bg-background dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="rounded-sm bg-foreground/5 px-3 py-1 font-medium text-foreground dark:bg-white/10">
                      {item.phone}
                    </span>
                  </Link>
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
