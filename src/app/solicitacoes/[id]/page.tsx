"use client";

import { BuildingsIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { notFound } from "next/navigation";
import { use, useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  FileInput,
  ModalsGenericModal as GenericModal,
  Section,
  UploadedFilePreview,
} from "../../../libs/react-ultimate-components/src";
import {
  getSolicitationById,
  solveSolicitation,
} from "../../../services/solicitations";
import SolicitationDetailsCard from "../../components/SolicitationDetailsCard";
import {
  mapSolicitationDTOToRecord,
  type SolicitationRecord,
} from "../../constants/solicitations";
import { useAuth } from "../../hooks/useAuth";

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
  const { authenticatedUser, isAuthenticated, hasHydrated } = useAuth();
  const [solicitation, setSolicitation] = useState<SolicitationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

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

              {canMarkSolved && (
                <button
                  type="button"
                  onClick={handleOpenSolveModal}
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-sm bg-success-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-success-600"
                >
                  <CheckCircleIcon size={18} weight="fill" />
                  Marcar como resolvida
                </button>
              )}
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
    </>
  );
}
