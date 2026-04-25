"use client";

import { BuildingsIcon, ScalesIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../libs/react-ultimate-components/src";

const navigationItems = [
  {
    href: "/#solicitacoes-gerais",
    label: "Solicitacoes gerais",
    icon: BuildingsIcon,
  },
  {
    href: "/#cidadao-legal",
    label: "Cidadao legal",
    icon: ScalesIcon,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Cidade Ativa"
        >
          <Image
            src="/logo.png"
            alt="Cidade Ativa"
            width={200}
            height={56}
            priority
            className="h-11 w-auto object-contain sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-foreground/85 transition hover:bg-foreground/5 hover:text-foreground"
              >
                <Icon size={22} weight="fill" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Button
          type="button"
          label="Fazer login"
          className="rounded-2xl px-5 py-3 text-sm font-bold !bg-lime-400 !text-zinc-950 hover:!bg-lime-300"
        />
      </div>

      <nav className="border-t border-black/5 px-4 py-3 md:hidden dark:border-white/10">
        <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground/5 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <Icon size={18} weight="fill" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
