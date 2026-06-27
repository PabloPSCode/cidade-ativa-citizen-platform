"use client";

import Image from "next/image";
import { useState } from "react";
import { GoogleButton } from "../../libs/react-ultimate-components/src";
import { useAuth } from "../hooks/useAuth";
import GoogleRegistrationModal from "./GoogleRegistrationModal";

interface PendingGoogleUser {
  email: string;
  name: string;
  photoUrl?: string;
}

/**
 * Tela cheia de autenticação exibida quando o usuário não está logado.
 * Reaproveita o fluxo de login do Google (`useAuth().loginWithGoogle`) e,
 * quando a conta ainda não é cadastrada, abre o modal de cadastro.
 */
export default function GoogleSignInScreen() {
  const { loginWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] =
    useState<PendingGoogleUser | null>(null);

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

  return (
    <>
      <main className="flex min-h-screen flex-col text-foreground md:grid md:grid-cols-2">
        {/* Metade da imagem — ocupa uma coluna inteira na vertical */}
        <div className="relative w-full min-h-[50vh] h-full">
          <Image
            src="/hero_section.png"
            alt="Cidade Ativa"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Metade do formulário */}
        <div className="flex flex-col items-center justify-center bg-background px-4 py-10 sm:px-8">
          <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 text-center">
            <Image
              src="/logo_text.png"
              alt="Cidade Ativa"
              width={220}
              height={62}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />

            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Entre para continuar
              </h1>
              <p className="text-sm leading-6 text-foreground/70 sm:text-base">
                Acesse com sua conta Google para visualizar as solicitações da
                comunidade e acompanhar as demandas do seu município.
              </p>
            </div>

            <GoogleButton
              label="Entrar com o Google"
              loading={isGoogleLoading}
              variant="primary"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="flex w-full justify-center rounded-sm px-5 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
            />
          </div>

          <p className="mt-8 text-sm text-foreground/65">
            Desenvolvido por{" "}
            <a
              href="https://www.plssistemas.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition hover:text-primary-600"
            >
              PLS Sistemas
            </a>
          </p>
        </div>
      </main>

      {pendingGoogleUser && (
        <GoogleRegistrationModal
          open={Boolean(pendingGoogleUser)}
          onClose={() => setPendingGoogleUser(null)}
          email={pendingGoogleUser.email}
          name={pendingGoogleUser.name}
          photoUrl={pendingGoogleUser.photoUrl}
        />
      )}
    </>
  );
}
