"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { getSiteRoutePrefix } from "../lib/site-paths";

interface AppChromeProps {
  children: ReactNode;
  /**
   * Header, Breadcrumb e Footer são recebidos como elementos já criados pelo
   * layout (Server Component). Não podem ser importados/renderizados direto
   * aqui porque o Footer é um Server Component assíncrono — e um Client
   * Component não pode renderizar um componente async.
   */
  header: ReactNode;
  breadcrumb: ReactNode;
  footer: ReactNode;
}

/**
 * Renderiza o "chrome" global (Header, Breadcrumb e Footer) ao redor das
 * páginas. Na rota inicial, esse chrome só aparece para usuários autenticados:
 * visitantes não logados veem uma tela limpa apenas com o login do Google.
 * Demais rotas (públicas) mantêm o chrome normalmente.
 */
export default function AppChrome({
  children,
  header,
  breadcrumb,
  footer,
}: AppChromeProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const prefix = getSiteRoutePrefix(pathname);
  const cleanPath =
    pathname.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
  const isHomeRoute = cleanPath === (prefix || "/");

  // Na home, escondemos o chrome até confirmar que o usuário está autenticado
  // (antes da hidratação `isAuthenticated` é falso, evitando flicker do header).
  const hideChrome = isHomeRoute && !isAuthenticated;

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {breadcrumb}
      {children}
      {footer}
    </>
  );
}
