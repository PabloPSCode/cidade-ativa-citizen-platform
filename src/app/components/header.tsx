"use client";

import {
  ChartBarIcon,
  CityIcon,
  MedalIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  GoogleButton,
  ModalsGenericModal as GenericModal,
  TopMenu,
} from "../../libs/react-ultimate-components/src";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";
import GoogleRegistrationModal from "./GoogleRegistrationModal";

interface PendingGoogleUser {
  email: string;
  name: string;
  photoUrl?: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated, loginWithGoogle, logout } =
    useAuth();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<PendingGoogleUser | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const homeHref = buildScopedHref(pathname, "/");

  const menuItems = [
    {
      label: "Solicitações",
      href: "#solicitacoes",
      icon: <CityIcon size={18} />,
      subItems: [
        {
          label: "Solicitações gerais",
          href: buildScopedHref(pathname, "/solicitacoes"),
        },
        ...(isAuthenticated
          ? [
              {
                label: "Minhas solicitações",
                href: buildScopedHref(pathname, "/minhas-solicitacoes"),
              },
            ]
          : []),
      ],
    },
    {
      label: "Cidadão Legal",
      href: "#cidadao-legal",
      icon: <MedalIcon size={18} />,
      subItems: [
        {
          label: "Ranking",
          href: buildScopedHref(pathname, "/cidadao-legal"),
        },
        {
          label: "Tabela de pontos",
          href: buildScopedHref(pathname, "/tabela-de-pontos"),
        },
        ...(isAuthenticated
          ? [
              {
                label: "Minhas ações",
                href: buildScopedHref(pathname, "/minhas-acoes"),
              },
            ]
          : []),
      ],
    },
    {
      label: "Enquetes",
      href: buildScopedHref(pathname, "/enquetes"),
      icon: <ChartBarIcon size={18} />,
    },
  ];

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.status === "registration_required") {
        setPendingGoogleUser({
          email: result.email,
          name: result.name,
          photoUrl: result.photoUrl,
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push(homeHref);
    setShowLogoutConfirm(false);
  };

  const handleCloseRegistrationModal = () => {
    setPendingGoogleUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-card bg-white">
        {/* Top bar — logo + auth area on all sizes, desktop nav in the middle */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-3"
            aria-label="Cidade Ativa"
          >
            <Image
              src="/logo_text.png"
              alt="Cidade Ativa"
              width={200}
              height={56}
              priority
              className="h-11 w-auto object-contain sm:h-12"
            />
          </Link>

          <TopMenu menuItems={menuItems} className="w-auto bg-transparent" />


          {hasHydrated ? (
            isAuthenticated && authenticatedUser ? (
              <div className="flex items-center">
                <div className="flex items-center gap-2 rounded-sm bg-foreground/5 px-2 py-1.5 dark:bg-white/5 md:gap-3 md:px-3 md:py-2">
                  {authenticatedUser.photoUrl ? (
                    <Image
                      src={authenticatedUser.photoUrl}
                      alt={authenticatedUser.name}
                      width={40}
                      height={40}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 shrink-0 rounded-full object-cover md:h-10 md:w-10"
                    />
                  ) : (
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white md:h-10 md:w-10 md:text-base">
                      {authenticatedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-sm px-2 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                >
                  <SignOutIcon size={20} weight="fill" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            ) : (
              <GoogleButton
                label="Entrar com o Google"
                loading={isGoogleLoading}
                variant="primary"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex rounded-sm px-3 py-2 text-sm font-medium text-white bg-primary-500 md:px-5 md:py-2.5"
              />
            )
          ) : (
            <div className="h-9 w-9 rounded-sm bg-foreground/5 dark:bg-white/5 md:h-11 md:w-32" />
          )}
        </div>

        {/* Mobile nav — column layout */}
        <div className="border-t border-black/5 px-4 py-3 md:hidden dark:border-white/10">
          <TopMenu
            menuItems={menuItems}
            wrapperClassName="flex"
            className="w-full bg-transparent px-0 py-0"
          />
        </div>
      </header>

      {pendingGoogleUser && (
        <GoogleRegistrationModal
          open={Boolean(pendingGoogleUser)}
          onClose={handleCloseRegistrationModal}
          email={pendingGoogleUser.email}
          name={pendingGoogleUser.name}
          photoUrl={pendingGoogleUser.photoUrl}
        />
      )}

      <GenericModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Sair da plataforma"
        description="Deseja realmente sair da plataforma?"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Cancelar"
        confirmButtonLabel="Sair"
        onConfirm={handleLogout}
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-destructive-500 px-5 py-3 font-medium text-white hover:bg-destructive-600"
      />
    </>
  );
}
