"use client";

import {
  BuildingsIcon,
  ScalesIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../libs/react-ultimate-components/src";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated, login, logout } =
    useAuth();

  const navigationItems = [
    ...(isAuthenticated
      ? [
          {
            href: "/minhas-solicitacoes",
            label: "Minhas solicitações",
            icon: UserCircleIcon,
          },
        ]
      : []),
    {
      href: "/solicitacoes",
      label: "Solicitações gerais",
      icon: BuildingsIcon,
    },
    {
      href: "/cidadao-legal",
      label: "Cidadão legal",
      icon: ScalesIcon,
    },
  ];

  const homeHref = buildScopedHref(pathname, "/");

  const handleLogin = () => {
    login();
    router.push(buildScopedHref(pathname, "/minhas-solicitacoes"));
  };

  const handleLogout = () => {
    logout();
    router.push(homeHref);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-card bg-bg-card/95 backdrop-blur-md dark:bg-bg-card/95">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={homeHref}
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
            const href = buildScopedHref(pathname, item.href);
            const isActive = pathname === href;

            return (
              <Link
                key={item.label}
                href={href}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-sm px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-foreground/8 text-foreground"
                    : "text-foreground/85 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <Icon size={22} weight="fill" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {hasHydrated ? (
          isAuthenticated && authenticatedUser ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-3 rounded-sm bg-foreground/5 px-3 py-2 dark:bg-white/5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-lg font-medium text-white">
                  {authenticatedUser.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground/55">
                    Bem vindo(a),
                  </p>
                  <p className="truncate text-sm font-black text-foreground">
                    {authenticatedUser.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-sm px-3 py-3 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
              >
                <SignOutIcon size={20} weight="fill" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Button
              type="button"
              label="Fazer login"
              onClick={handleLogin}
              className="rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600"
            />
          )
        ) : (
          <div className="hidden h-11 w-32 rounded-sm bg-foreground/5 md:block dark:bg-white/5" />
        )}
      </div>

      <div className="border-t border-black/5 px-4 py-3 md:hidden dark:border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={buildScopedHref(pathname, item.href)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <Icon size={18} weight="fill" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {hasHydrated ? (
            isAuthenticated && authenticatedUser ? (
              <div className="flex items-center justify-between gap-3 rounded-sm bg-foreground/5 px-3 py-3 dark:bg-white/5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-lg font-medium text-white">
                    {authenticatedUser.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground/55">
                      Bem vindo(a),
                    </p>
                    <p className="truncate text-sm font-black text-foreground">
                      {authenticatedUser.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                >
                  <SignOutIcon size={20} weight="fill" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Button
                type="button"
                label="Fazer login"
                onClick={handleLogin}
                className="w-full justify-center rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600"
              />
            )
          ) : null}
        </div>
      </div>
    </header>
  );
}
