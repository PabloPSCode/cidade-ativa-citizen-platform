export interface AuthenticatedUser {
  userId: string;
  name: string;
  email: string;
  token: string;
  photoUrl?: string;
}

export const AUTH_STORAGE_KEY = "cidade-ativa-auth";

/**
 * Cookie que espelha o token de autenticação. Diferente do localStorage, o
 * cookie é enviado em todas as requisições — inclusive nas renderizadas no
 * servidor (Server Components) — permitindo resolver o tenant (cidade) do
 * usuário autenticado também no SSR.
 */
export const AUTH_COOKIE_NAME = "cidade-ativa-token";

/** Validade do cookie de auth, alinhada à expiração do JWT (7 dias). */
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
