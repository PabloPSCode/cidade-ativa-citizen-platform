// `next/headers` já é server-only: importá-lo em um Client Component gera erro
// de build, então ele próprio garante que este módulo só rode no servidor.
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "../app/constants/auth";

/**
 * Lê o token de autenticação do cookie da requisição atual (Server Components /
 * rotas). É a forma de o SSR conhecer o tenant (cidade) do usuário autenticado,
 * já que o token fica no localStorage/cookie do cliente e não no servidor.
 *
 * Retorna `undefined` quando não há sessão — nesse caso o back-end aplica a
 * cidade padrão.
 */
export async function getServerAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}
