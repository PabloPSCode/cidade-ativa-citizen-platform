import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AUTH_COOKIE_NAME } from '../app/constants/auth';

export interface ApiResponse<T = unknown> {
  RES: T | null;
  MSG: { message: string; error?: string } | null;
  SUCCESS: boolean;
  TIMESTAMP: string;
  PATH: string;
  STATUS: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

let authToken: string | null = null;

export function setAuthToken(token: string): void {
  authToken = token;
}

export function clearAuthToken(): void {
  authToken = null;
}

/**
 * Cabeçalho de autorização para uso explícito (ex.: Server Components que leem
 * o token do cookie e precisam injetá-lo por requisição, já que o `authToken`
 * em memória é client-side e compartilhado entre requisições no servidor).
 */
export function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Lê o token do cookie no client como fallback (independe do React/effects). */
function readTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const isDev = process.env.NODE_ENV === 'development';

// No servidor (Server Components), fala direto com o backend pela URL interna
// `API_URL`, que NÃO é exposta ao browser. No client, as requisições passam
// pelo proxy de mesma origem `/api/backend/*` (ver `rewrites` no next.config.js),
// de modo que a URL real do backend nunca chega ao bundle do navegador.
const baseURL =
  typeof window === 'undefined'
    ? process.env.API_URL ?? 'http://localhost:3337'
    : '/api/backend';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Não sobrescreve um Authorization já definido explicitamente (server-side,
  // token por requisição vindo do cookie). No client, usa o token em memória
  // e, como fallback, o cookie — garantindo o escopo de cidade mesmo antes de
  // o efeito do `useAuth` rodar (ex.: logo após um refresh).
  if (!config.headers.Authorization) {
    const token = authToken ?? readTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (isDev) {
    console.log(`[${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
  }

  return config;
});

api.interceptors.response.use(
  (response): any => {
    if (isDev) {
      console.log('[RESPONSE SUCCESS]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    const data: ApiResponse = response.data;
    if (!data) return null;
    if ('RES' in data) return data.RES;
    if ('data' in data && 'meta' in data) return data;
    if ('data' in data) return (data as unknown as { data: unknown }).data;
    return data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (isDev) {
      if (error.response) {
        console.log('[RESPONSE ERROR]', {
          status: error.response.status,
          url: error.config?.url,
          data: error.response.data,
        });
      } else if (error.request) {
        console.log('[REQUEST ERROR] No response received', {
          url: error.config?.url,
          message: error.message,
        });
      } else {
        console.log('[REQUEST SETUP ERROR]', error.message);
      }
    }

    const message =
      error.response?.data?.MSG?.message ??
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  },
);

export default api;
