"use client";

import {
  ArrowRightIcon,
  CalendarDotsIcon,
  ClipboardTextIcon,
  EnvelopeSimpleIcon,
  PenNibIcon,
  TrashIcon,
  UserCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  CanvasSignature,
  ModalsGenericModal as GenericModal,
  Section,
} from "../../libs/react-ultimate-components/src";
import {
  createSignature,
  deleteSignature,
  getSignatureByUserId,
  type SignatureResponseDTO,
} from "../../services/signatures";
import { listSolicitations } from "../../services/solicitations";
import {
  deleteUser,
  getUserById,
  type UserResponseDTO,
} from "../../services/users";
import { isSolicitationOpen } from "../constants/solicitations";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
};

export default function ProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated, logout } = useAuth();

  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [openSolicitationsCount, setOpenSolicitationsCount] = useState(0);
  const [signature, setSignature] = useState<SignatureResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showRegisterSignature, setShowRegisterSignature] = useState(false);
  const [showDeleteSignature, setShowDeleteSignature] = useState(false);
  const [showRemoveAccount, setShowRemoveAccount] = useState(false);

  const [signaturePreview, setSignaturePreview] = useState("");

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(buildScopedHref(pathname, "/"));
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!authenticatedUser) return;

    let cancelled = false;
    const userId = authenticatedUser.userId;

    async function load() {
      setIsLoading(true);
      const [userResult, solicitationsResult, signatureResult] =
        await Promise.all([
          getUserById(userId).catch(() => null),
          listSolicitations({ userId, page: 1, perPage: 100 }).catch(() => null),
          // O back-end responde 404 quando o usuário ainda não tem assinatura.
          getSignatureByUserId(userId).catch(() => null),
        ]);

      if (cancelled) return;
      setUser(userResult);
      setOpenSolicitationsCount(
        (solicitationsResult?.data ?? []).filter((item) =>
          isSolicitationOpen(item.status)
        ).length
      );
      setSignature(signatureResult);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authenticatedUser]);

  const {
    isLoading: isSavingSignature,
    error: signatureError,
    run: handleConfirmRegisterSignature,
    setError: setSignatureError,
  } = useAsyncAction(
    async () => {
      if (!authenticatedUser || !signaturePreview) return;
      const created = await createSignature({
        imageUrl: signaturePreview,
        userName: authenticatedUser.name,
        userId: authenticatedUser.userId,
      });
      setSignature(created);
      setSignaturePreview("");
      setShowRegisterSignature(false);
    },
    { fallbackErrorMessage: "Erro ao registrar a assinatura. Tente novamente." }
  );

  const handleOpenRegisterSignature = () => {
    setSignaturePreview("");
    setSignatureError(null);
    setShowRegisterSignature(true);
  };

  const { isLoading: isDeletingSignature, run: handleConfirmDeleteSignature } =
    useAsyncAction(async () => {
      if (!signature) return;
      await deleteSignature(signature.id);
      setSignature(null);
      setShowDeleteSignature(false);
    });

  const { isLoading: isRemovingAccount, run: handleConfirmRemoveAccount } =
    useAsyncAction(async () => {
      if (!authenticatedUser) return;
      await deleteUser(authenticatedUser.userId);
      logout();
      router.replace(buildScopedHref(pathname, "/"));
    });

  if (!hasHydrated || (isAuthenticated && isLoading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-foreground/65">Carregando perfil...</p>
      </main>
    );
  }

  if (!isAuthenticated || !authenticatedUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-foreground/65">Redirecionando...</p>
      </main>
    );
  }

  const displayName = user?.name ?? authenticatedUser.name;
  const displayEmail = user?.email ?? authenticatedUser.email;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        {/* Cabeçalho */}
        <section className="flex flex-col gap-5 rounded-[2rem] border border-border-card/70 bg-white/75 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:flex-row sm:items-center sm:p-7">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-500 text-2xl font-black text-white">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {displayName}
            </h1>
            <p className="text-sm text-foreground/65 sm:text-base">
              {displayEmail}
            </p>
          </div>
        </section>

        {/* Dados pessoais */}
        <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-black tracking-tight sm:text-xl">
            Dados pessoais
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <InfoBlock
              label="Nome"
              icon={<UserCircleIcon size={18} weight="fill" />}
              value={displayName}
            />
            <InfoBlock
              label="E-mail"
              icon={<EnvelopeSimpleIcon size={18} weight="fill" />}
              value={displayEmail}
            />
            <InfoBlock
              label="Data de cadastro"
              icon={<CalendarDotsIcon size={18} weight="fill" />}
              value={formatDate(user?.createdAt)}
            />
          </div>
        </section>

        {/* Solicitações */}
        <section className="flex flex-col gap-4 rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="rounded-[1.35rem] bg-foreground/5 p-3 text-foreground/70 dark:bg-white/5">
              <ClipboardTextIcon size={24} weight="fill" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight sm:text-xl">
                Minhas solicitações
              </h2>
              <p className="text-sm text-foreground/65">
                Você possui{" "}
                <span className="font-bold text-foreground">
                  {openSolicitationsCount}
                </span>{" "}
                {openSolicitationsCount === 1
                  ? "solicitação em aberto"
                  : "solicitações em aberto"}
                .
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(buildScopedHref(pathname, "/minhas-solicitacoes"))
            }
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
          >
            Ver minhas solicitações
            <ArrowRightIcon size={18} weight="bold" />
          </button>
        </section>

        {/* Assinatura */}
        <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <div className="rounded-[1.35rem] bg-foreground/5 p-3 text-foreground/70 dark:bg-white/5">
              <PenNibIcon size={24} weight="fill" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight sm:text-xl">
                Assinatura
              </h2>
              <p className="text-sm text-foreground/65">
                Sua assinatura é usada para apoiar ações coletivas na plataforma.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {signature ? (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signature.imageUrl}
                  alt={`Assinatura de ${displayName}`}
                  className="h-28 w-auto max-w-full rounded-[1.25rem] border border-border-card/70 bg-white object-contain p-3"
                />
                <button
                  type="button"
                  onClick={() => setShowDeleteSignature(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-destructive-500/25 bg-destructive-500/10 px-5 py-3 text-sm font-medium text-destructive-600 transition hover:bg-destructive-500/15 dark:text-destructive-300"
                >
                  <TrashIcon size={18} weight="fill" />
                  Excluir assinatura
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-[1.5rem] border border-dashed border-border-card bg-background/70 p-5 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/65">
                  Você ainda não cadastrou uma assinatura.
                </p>
                <button
                  type="button"
                  onClick={handleOpenRegisterSignature}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
                >
                  <PenNibIcon size={18} weight="fill" />
                  Cadastrar assinatura
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Zona de risco */}
        <section className="flex flex-col gap-4 rounded-[2rem] border border-destructive-500/30 bg-destructive-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-tight text-destructive-600 sm:text-xl dark:text-destructive-300">
              Remover conta
            </h2>
            <p className="max-w-2xl text-sm text-foreground/65">
              Esta ação é permanente e remove definitivamente sua conta e os
              dados associados a ela.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowRemoveAccount(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-destructive-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-destructive-600"
          >
            <TrashIcon size={18} weight="fill" />
            Remover conta
          </button>
        </section>
      </Section>

      {/* Modal: cadastrar assinatura */}
      <GenericModal
        open={showRegisterSignature}
        onClose={() => setShowRegisterSignature(false)}
        title="Cadastrar assinatura"
        description="Desenhe sua assinatura no quadro abaixo para apoiar ações coletivas."
        size="md"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Cancelar"
        confirmButtonLabel={
          isSavingSignature ? "Cadastrando..." : "Cadastrar assinatura"
        }
        confirmButtonDisabled={isSavingSignature || !signaturePreview}
        onConfirm={handleConfirmRegisterSignature}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-primary-500 px-5 py-3 font-medium text-white hover:bg-primary-600 disabled:opacity-50"
      >
        <div className="flex flex-col gap-4">
          <CanvasSignature
            label="Desenhe sua assinatura abaixo"
            helperText='Após desenhar, clique em "Salvar assinatura" para confirmar o traço e depois em "Cadastrar assinatura".'
            height={200}
            onSave={(dataURL) => {
              setSignaturePreview(dataURL);
              setSignatureError(null);
            }}
            onClear={() => setSignaturePreview("")}
          />

          {signaturePreview ? (
            <p className="rounded-sm border border-success-500/25 bg-success-500/10 px-4 py-3 text-sm text-success-700 dark:text-success-200">
              Assinatura capturada. Clique em &quot;Cadastrar assinatura&quot;
              para salvar.
            </p>
          ) : null}

          {signatureError ? (
            <p className="rounded-sm border border-destructive-500/20 bg-destructive-500/10 px-4 py-3 text-sm text-destructive-500">
              {signatureError}
            </p>
          ) : null}
        </div>
      </GenericModal>

      {/* Modal: excluir assinatura */}
      <GenericModal
        open={showDeleteSignature}
        onClose={() => setShowDeleteSignature(false)}
        title="Excluir assinatura"
        description="Essa ação remove permanentemente a sua assinatura cadastrada."
        size="sm"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Voltar"
        confirmButtonLabel={
          isDeletingSignature ? "Removendo..." : "Excluir assinatura"
        }
        confirmButtonDisabled={isDeletingSignature}
        onConfirm={handleConfirmDeleteSignature}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-destructive-500 px-5 py-3 font-medium text-white hover:bg-destructive-600"
      >
        <div className="flex items-start gap-3 rounded-sm border border-destructive-500/20 bg-destructive-500/10 p-4 text-sm text-foreground/80">
          <WarningCircleIcon
            size={22}
            weight="fill"
            className="mt-0.5 shrink-0 text-destructive-500"
          />
          <p>
            Tem certeza que deseja excluir sua assinatura? Você poderá cadastrar
            uma nova depois, mas não será possível recuperar a atual.
          </p>
        </div>
      </GenericModal>

      {/* Modal: remover conta */}
      <GenericModal
        open={showRemoveAccount}
        onClose={() => setShowRemoveAccount(false)}
        title="Remover conta"
        description="Essa ação é permanente e não pode ser desfeita."
        size="sm"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Voltar"
        confirmButtonLabel={isRemovingAccount ? "Removendo..." : "Remover conta"}
        confirmButtonDisabled={isRemovingAccount}
        onConfirm={handleConfirmRemoveAccount}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-destructive-500 px-5 py-3 font-medium text-white hover:bg-destructive-600"
      >
        <div className="flex items-start gap-3 rounded-sm border border-destructive-500/20 bg-destructive-500/10 p-4 text-sm text-foreground/80">
          <WarningCircleIcon
            size={22}
            weight="fill"
            className="mt-0.5 shrink-0 text-destructive-500"
          />
          <p>
            Ao remover sua conta, todos os seus dados serão excluídos
            permanentemente e você será desconectado. Deseja realmente continuar?
          </p>
        </div>
      </GenericModal>
    </main>
  );
}

interface InfoBlockProps {
  label: string;
  value: string;
  icon: ReactNode;
}

function InfoBlock({ label, value, icon }: InfoBlockProps) {
  return (
    <div className="rounded-[1.35rem] bg-background/80 p-4 dark:bg-white/[0.03]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
        <span className="shrink-0 text-foreground/55">{icon}</span>
        <span className="min-w-0 truncate">{value}</span>
      </div>
    </div>
  );
}
