"use client";

import { signInWithPopup } from 'firebase/auth';
import { useEffect } from "react";
import { auth, googleProvider } from '../../lib/firebase';
import { authenticate, authenticateWithGoogle } from "../../services/auth";
import { clearAuthToken, setAuthToken } from "../../services/http";
import { getUserByEmail } from "../../services/users";
import { AUTH_COOKIE_MAX_AGE_SECONDS, AUTH_COOKIE_NAME } from "../constants/auth";
import { useAuthStore } from "../stores/useAuthStore";

/**
 * Espelha o token no cookie para que requisições renderizadas no servidor
 * (Server Components) também resolvam o tenant (cidade) do usuário. Não é
 * httpOnly de propósito: o login acontece no cliente (Firebase) e o token já
 * vive no localStorage.
 */
function writeAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${AUTH_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function eraseAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export type LoginWithGoogleResult =
  | { status: 'authenticated' }
  | { status: 'registration_required'; email: string; name: string; photoUrl?: string }
  | { status: 'cancelled' };

const GOOGLE_POPUP_WIDTH = 480;
const GOOGLE_POPUP_HEIGHT = 640;

/**
 * Executa o `signInWithPopup` forçando o Google a abrir em uma janela pequena
 * e centralizada (em vez de uma nova aba). O Firebase chama `window.open`
 * internamente, então sobrescrevemos temporariamente para injetar as
 * dimensões da janela, preservando a URL e o target usados pelo Firebase.
 */
async function signInWithGooglePopup() {
  if (typeof window === 'undefined') {
    return signInWithPopup(auth, googleProvider);
  }

  const originalOpen = window.open.bind(window);

  const screenLeft = window.screenLeft ?? window.screenX ?? 0;
  const screenTop = window.screenTop ?? window.screenY ?? 0;
  const viewportWidth = window.outerWidth || window.innerWidth || GOOGLE_POPUP_WIDTH;
  const viewportHeight = window.outerHeight || window.innerHeight || GOOGLE_POPUP_HEIGHT;
  const left = Math.max(0, Math.round(screenLeft + (viewportWidth - GOOGLE_POPUP_WIDTH) / 2));
  const top = Math.max(0, Math.round(screenTop + (viewportHeight - GOOGLE_POPUP_HEIGHT) / 2));

  const sizedFeatures = [
    'popup=yes',
    `width=${GOOGLE_POPUP_WIDTH}`,
    `height=${GOOGLE_POPUP_HEIGHT}`,
    `left=${left}`,
    `top=${top}`,
    'toolbar=no',
    'menubar=no',
    'location=no',
    'status=no',
    'scrollbars=yes',
    'resizable=yes',
  ].join(',');

  window.open = ((url?: string | URL, target?: string) =>
    originalOpen(url ?? '', target, sizedFeatures)) as typeof window.open;

  try {
    return await signInWithPopup(auth, googleProvider);
  } finally {
    window.open = originalOpen;
  }
}

export function useAuth() {
  const authenticatedUser = useAuthStore((state) => state.authenticatedUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (authenticatedUser?.token) {
      setAuthToken(authenticatedUser.token);
      // Sincroniza o cookie a partir do estado persistido (login e refresh),
      // garantindo que o SSR enxergue o token na próxima navegação.
      writeAuthCookie(authenticatedUser.token);
    } else {
      clearAuthToken();
      eraseAuthCookie();
    }
  }, [authenticatedUser]);

  async function loginWithCredentials(email: string, password: string) {
    const { token } = await authenticate({ email, password });
    setAuthToken(token);
    const user = await getUserByEmail(email);
    login({
      userId: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  }

  async function loginWithGoogle(): Promise<LoginWithGoogleResult> {
    let email: string;
    let name: string;
    let photoUrl: string | undefined;

    try {
      const result = await signInWithGooglePopup();
      email = result.user.email ?? '';
      name = result.user.displayName ?? '';
      photoUrl = result.user.photoURL ?? undefined;
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { status: 'cancelled' };
      }
      throw error;
    }

    // Try to authenticate — succeeds only if this email is already registered
    try {
      const { token } = await authenticateWithGoogle(email);
      setAuthToken(token);
      const user = await getUserByEmail(email);
      login({
        userId: user.id,
        name: user.name,
        email: user.email,
        token,
        photoUrl,
      });
      return { status: 'authenticated' };
    } catch {
      return { status: 'registration_required', email, name, photoUrl };
    }
  }

  return {
    authenticatedUser,
    hasHydrated,
    isAuthenticated: Boolean(authenticatedUser),
    loginWithCredentials,
    loginWithGoogle,
    logout,
  };
}
