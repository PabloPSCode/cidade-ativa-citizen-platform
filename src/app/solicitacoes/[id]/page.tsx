"use client";

import {
  BuildingsIcon,
  CheckCircleIcon,
  PenNibIcon,
  UsersThreeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { use, useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  FileInput,
  ModalsGenericModal as GenericModal,
  Section,
  UploadedFilePreview,
} from "../../../libs/react-ultimate-components/src";
import {
  getSignatureByUserId,
  listSignaturesBySolicitation,
  signSolicitation,
  type SolicitationSignatureResponseDTO,
} from "../../../services/signatures";
import {
  getSolicitationById,
  solveSolicitation,
} from "../../../services/solicitations";
import SignatureListCard from "../../components/SignatureListCard";
import SolicitationDetailsCard from "../../components/SolicitationDetailsCard";
import {
  mapSolicitationDTOToRecord,
  type SolicitationRecord,
} from "../../constants/solicitations";
import { useAuth } from "../../hooks/useAuth";
import { buildScopedHref } from "../../lib/site-paths";

interface PhotoPreview {
  name: string;
  uri: string;
  size: number;
  type: string;
}

const readFileAsDataUrl = (file: File): Promise<PhotoPreview> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        uri: String(reader.result),
        size: Math.max(1, Math.round(file.size / 1024)),
        type: file.type || "image/jpeg",
      });
    reader.onerror = () => reject(new Error("Falha ao carregar imagem."));
    reader.readAsDataURL(file);
  });

export default function SolicitationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const { authenticatedUser, isAuthenticated, hasHydrated } = useAuth();
  const [solicitation, setSolicitation] = useState<SolicitationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const [signatures, setSignatures] = useState<
    SolicitationSignatureResponseDTO[]
  >([]);
  const [hasRegisteredSignature, setHasRegisteredSignature] = useState(false);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [registerFirstModalOpen, setRegisterFirstModalOpen] = useState(false);
  const [signaturesModalOpen, setSignaturesModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const [solveModalOpen, setSolveModalOpen] = useState(false);
  const [solvedPhotos, setSolvedPhotos] = useState<PhotoPreview[]>([]);
  const [solvedCommentary, setSolvedCommentary] = useState("");
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  const commentaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    let cancelled = false;

    async function fetchSolicitation() {
      setIsLoading(true);
      try {
        const dto = await getSolicitationById(id);
        if (!cancelled) setSolicitation(mapSolicitationDTOToRecord(dto));
      } catch {
        if (!cancelled) setNotFoundError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSolicitation();
    return () => { cancelled = true; };
  }, [id, hasHydrated, isAuthenticated]);

  // Carrega as assinaturas da solicitação e se o usuário atual já tem assinatura
  // registrada (para decidir o fluxo do botão "Concordar e assinar").
  useEffect(() => {
    if (!hasHydrated) return;

    let cancelled = false;

    async function loadSignatures() {
      const list = await listSignaturesBySolicitation(id).catch(() => []);
      if (!cancelled) setSignatures(list);
    }

    async function loadRegisteredSignature() {
      if (!authenticatedUser) {
        setHasRegisteredSignature(false);
        return;
      }
      // O back-end responde 404 quando o usuário ainda não tem assinatura.
      const registered = await getSignatureByUserId(
        authenticatedUser.userId
      ).catch(() => null);
      if (!cancelled) setHasRegisteredSignature(Boolean(registered));
    }

    loadSignatures();
    loadRegisteredSignature();
    return () => {
      cancelled = true;
    };
  }, [id, hasHydrated, authenticatedUser]);

  if (!hasHydrated || isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <p className="text-sm text-foreground/65">
              Carregando detalhes da solicitação...
            </p>
          </section>
        </Section>
      </main>
    );
  }

  if (notFoundError || !solicitation) {
    notFound();
  }

  const isOwner =
    isAuthenticated &&
    authenticatedUser?.userId === solicitation.requestingUserId;

  const canMarkSolved =
    isOwner &&
    (solicitation.status === "not_resolved" ||
      solicitation.status === "in_progress");

  // Só é possível assinar uma solicitação de outro usuário (não o próprio autor).
  const canSign = isAuthenticated && !isOwner;
  const alreadySigned = authenticatedUser
    ? signatures.some(
        (signature) => signature.userId === authenticatedUser.userId
      )
    : false;

  const handleClickSign = () => {
    setSignError(null);
    if (!hasRegisteredSignature) {
      setRegisterFirstModalOpen(true);
      return;
    }
    setSignModalOpen(true);
  };

  const handleConfirmSign = async () => {
    if (!authenticatedUser) return;
    setIsSigning(true);
    setSignError(null);
    try {
      const created = await signSolicitation({
        userId: authenticatedUser.userId,
        solicitationId: id,
      });
      setSignatures((current) => [...current, created]);
      setSignModalOpen(false);
    } catch (error: unknown) {
      setSignError(
        error instanceof Error
          ? error.message
          : "Erro ao assinar a solicitação. Tente novamente."
      );
    } finally {
      setIsSigning(false);
    }
  };

  const handleOpenSolveModal = () => {
    setSolvedPhotos([]);
    setSolvedCommentary("");
    setSolveError(null);
    setUploadKey((k) => k + 1);
    setSolveModalOpen(true);
  };

  const handleCloseSolveModal = () => {
    setSolveModalOpen(false);
  };

  const handleUploadPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setIsUploadingPhotos(true);
    try {
      const previews = await Promise.all(files.map(readFileAsDataUrl));
      setSolvedPhotos((prev) => [...prev, ...previews]);
    } finally {
      setIsUploadingPhotos(false);
      setUploadKey((k) => k + 1);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSolvedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmSolve = async () => {
    if (solvedPhotos.length === 0) return;
    setSolveError(null);
    setIsSolving(true);
    try {
      const commentary = solvedCommentary.trim();
      const dto = await solveSolicitation(id, {
        solvedImageUrls: solvedPhotos.map((p) => p.uri),
        ...(commentary ? { solvedCommentary: commentary } : {}),
      });
      setSolicitation(mapSolicitationDTOToRecord(dto));
      setSolveModalOpen(false);
    } catch (error: unknown) {
      setSolveError(
        error instanceof Error
          ? error.message
          : "Erro ao marcar como resolvida. Tente novamente."
      );
    } finally {
      setIsSolving(false);
    }
  };

  const canConfirmSolve = solvedPhotos.length > 0 && !isUploadingPhotos && !isSolving;

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="flex flex-col gap-3 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                  <BuildingsIcon size={22} weight="fill" />
                  <span>Detalhes da solicitação</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Solicitação {solicitation.protocolNumber}
                </h1>
                <p className="text-sm leading-6 text-foreground/70 sm:text-base">
                  Exibindo detalhes da solicitação {solicitation.protocolNumber}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSignaturesModalOpen(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-foreground/15 bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-foreground/5"
                >
                  <UsersThreeIcon size={18} weight="fill" />
                  Ver assinaturas ({signatures.length})
                </button>

                {canSign &&
                  (alreadySigned ? (
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-success-500/30 bg-success-500/10 px-5 py-3 text-sm font-medium text-success-700 dark:text-success-200">
                      <CheckCircleIcon size={18} weight="fill" />
                      Você já assinou
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClickSign}
                      className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
                    >
                      <PenNibIcon size={18} weight="fill" />
                      Concordar e assinar
                    </button>
                  ))}

                {canMarkSolved && (
                  <button
                    type="button"
                    onClick={handleOpenSolveModal}
                    className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-success-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-success-600"
                  >
                    <CheckCircleIcon size={18} weight="fill" />
                    Marcar como resolvida
                  </button>
                )}
              </div>
            </div>
          </section>

          <SolicitationDetailsCard {...solicitation} />
        </Section>
      </main>

      <GenericModal
        open={solveModalOpen}
        onClose={handleCloseSolveModal}
        title="Marcar como resolvida"
        description="Adicione ao menos uma imagem comprovando a resolução. O comentário é opcional."
        size="lg"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Cancelar"
        confirmButtonLabel={isSolving ? "Salvando..." : "Confirmar resolução"}
        confirmButtonDisabled={!canConfirmSolve}
        onConfirm={handleConfirmSolve}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-success-500 px-5 py-3 font-medium text-white hover:bg-success-600 disabled:opacity-50"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <FileInput
              key={`solve-upload-${uploadKey}`}
              label="Imagens da resolução *"
              instructionText="Anexe ao menos uma foto que comprove a resolução."
              buttonTitle="Selecionar imagens"
              accept="image/*"
              multiple
              disabled={isUploadingPhotos}
              onUpload={handleUploadPhotos}
              containerClassName="w-full"
              buttonClassName="rounded-2xl"
            />

            {solvedPhotos.length > 0 && (
              <div className="grid gap-3">
                {solvedPhotos.map((photo, index) => (
                  <UploadedFilePreview
                    key={`${photo.uri}-${index}`}
                    label={`Imagem ${index + 1}`}
                    file={photo}
                    onCancel={() => handleRemovePhoto(index)}
                    containerClassName="rounded-[1.25rem] border-border-card/60 bg-bg-card"
                    mediaClassName="rounded-[1rem]"
                  />
                ))}
              </div>
            )}

            {solvedPhotos.length === 0 && (
              <p className="text-xs text-destructive-500">
                Ao menos uma imagem é obrigatória para confirmar a resolução.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="solve-commentary"
              className="text-sm font-medium text-foreground/80"
            >
              Comentário de resolução{" "}
              <span className="text-foreground/40">(opcional)</span>
            </label>
            <textarea
              id="solve-commentary"
              ref={commentaryRef}
              value={solvedCommentary}
              onChange={(e) => setSolvedCommentary(e.target.value)}
              placeholder="Descreva como a situação foi resolvida..."
              rows={3}
              className="w-full resize-none rounded-sm border border-border-card bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
            />
          </div>

          {solveError && (
            <p className="rounded-sm border border-destructive-500/20 bg-destructive-500/10 px-4 py-3 text-sm text-destructive-500">
              {solveError}
            </p>
          )}
        </div>
      </GenericModal>

      {/* Modal: confirmar assinatura */}
      <GenericModal
        open={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        title="Concordar e assinar"
        description="Ao assinar, você apoia publicamente esta solicitação com a sua assinatura registrada."
        size="sm"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Cancelar"
        confirmButtonLabel={isSigning ? "Assinando..." : "Concordar e assinar"}
        confirmButtonDisabled={isSigning}
        onConfirm={handleConfirmSign}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-primary-500 px-5 py-3 font-medium text-white hover:bg-primary-600 disabled:opacity-50"
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-foreground/75">
            Confirma que deseja assinar a solicitação{" "}
            {solicitation.protocolNumber}? Sua assinatura ficará visível para a
            comunidade.
          </p>
          {signError && (
            <p className="rounded-sm border border-destructive-500/20 bg-destructive-500/10 px-4 py-3 text-sm text-destructive-500">
              {signError}
            </p>
          )}
        </div>
      </GenericModal>

      {/* Modal: precisa registrar assinatura primeiro */}
      <GenericModal
        open={registerFirstModalOpen}
        onClose={() => setRegisterFirstModalOpen(false)}
        title="Assinatura necessária"
        description="Você precisa de uma assinatura registrada para assinar uma solicitação."
        size="sm"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton={false}
        cancelButtonLabel="Entendi"
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
      >
        <div className="flex items-start gap-3 rounded-sm border border-alert-500/20 bg-alert-500/10 p-4 text-sm text-foreground/80">
          <WarningCircleIcon
            size={22}
            weight="fill"
            className="mt-0.5 shrink-0 text-alert-600"
          />
          <p>
            Cadastre uma assinatura no seu perfil clicando em{" "}
            <Link
              href={buildScopedHref(pathname, "/perfil")}
              onClick={() => setRegisterFirstModalOpen(false)}
              className="font-semibold text-primary-600 underline underline-offset-2 hover:text-primary-700 dark:text-primary-300"
            >
              {authenticatedUser?.name ?? "seu nome"}
            </Link>{" "}
            no topo da página. Depois volte aqui para assinar esta solicitação.
          </p>
        </div>
      </GenericModal>

      {/* Modal: assinaturas da solicitação */}
      <GenericModal
        open={signaturesModalOpen}
        onClose={() => setSignaturesModalOpen(false)}
        title="Assinaturas da solicitação"
        description="Pessoas que concordaram e assinaram esta solicitação."
        size="md"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton={false}
        cancelButtonLabel="Fechar"
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
      >
        {signatures.length > 0 ? (
          <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto">
            {signatures.map((signature) => (
              <SignatureListCard
                key={signature.id}
                userName={signature.userName}
                signatureImageUrl={signature.imageUrl}
                signedAt={signature.createdAt}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-sm border border-border-card/70 bg-background/70 px-4 py-6 text-center text-sm text-foreground/65 dark:bg-white/[0.02]">
            Esta solicitação ainda não possui assinaturas.
          </p>
        )}
      </GenericModal>
    </>
  );
}
