import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { href: "/#sobre", label: "O que e a CidadeAtiva?" },
  { href: "/#como-funciona", label: "Como funciona?" },
  { href: "/#duvidas", label: "Duvidas" },
  { href: "/#solicitacoes-gerais", label: "Solicitacoes" },
  { href: "/#cidadao-legal", label: "Cidadao legal" },
];

const policyLinks = [
  { href: "#", label: "Politica de Privacidade" },
  { href: "#", label: "Termos de Uso" },
];

export default function Footer() {
  return (
    <footer
      id="cidadao-legal"
      className="border-t border-black/5 bg-white text-foreground dark:border-white/10 dark:bg-[#0f0f10]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_1fr]">
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
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
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
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Termos e politicas
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
        </div>

        <div className="border-t border-slate-200 pt-6 text-sm text-foreground/65 dark:border-white/10">
          <p>2026, Desenvolvido por PLS Sistemas</p>
        </div>
      </div>
    </footer>
  );
}
