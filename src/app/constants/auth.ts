export interface AuthenticatedUser {
  userId: string;
  name: string;
  email: string;
  token: string;
}

export const AUTH_STORAGE_KEY = "cidade-ativa-auth";

export const mockAuthenticatedUser: AuthenticatedUser = {
  userId: "citizen-user-1",
  name: "Pablo Silva",
  email: "pablo.silva@cidadeativa.com.br",
  token: "mock-token-cidade-ativa-2026",
};
