"use client";

import {
  CameraIcon,
  MapPinAreaIcon,
  NotePencilIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  Button,
  FileInput,
  Section,
  SelectInput,
  TextAreaInput,
  TextInput,
  UploadedFilePreview,
} from "../../libs/react-ultimate-components/src";
import {
  listCoolActions,
  type CoolActionResponseDTO,
} from "../../services/cool-actions";
import { createDoneCoolAction } from "../../services/done-cool-actions";
import { normalizeCategory } from "../constants/done-cool-actions";
import { useAuth } from "../hooks/useAuth";
import { useNeighborhoods } from "../hooks/useNeighborhoods";
import { buildScopedHref } from "../lib/site-paths";

const MAX_DESCRIPTION_LENGTH = 320;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif";

const registerSteps = [
  {
    id: 1,
    title: "Detalhes da ação",
    subtitle: "Selecione a ação legal realizada e descreva o que foi feito.",
    icon: NotePencilIcon,
  },
  {
    id: 2,
    title: "Informe a localização",
    subtitle: "Registre o bairro e o endereço onde a ação foi realizada.",
    icon: MapPinAreaIcon,
  },
  {
    id: 3,
    title: "Foto e confirmação",
    subtitle: "Anexe uma foto da ação e confirme os dados.",
    icon: CameraIcon,
  },
];

interface ActionPhotoPreview {
  name: string;
  uri: string;
  size: number;
  type: string;
}

const createImagePreviewFromFile = (file: File) =>
  new Promise<ActionPhotoPreview>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        name: file.name,
        uri: String(reader.result),
        size: Math.max(1, Math.round(file.size / 1024)),
        type: file.type || "image/jpeg",
      });
    };

    reader.onerror = () => reject(new Error("Falha ao carregar a imagem."));
    reader.readAsDataURL(file);
  });

export default function RegisterCoolActionPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated } = useAuth();
  const { options: neighborhoodOptions } = useNeighborhoods();

  const [coolActions, setCoolActions] = useState<CoolActionResponseDTO[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [coolActionId, setCoolActionId] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");
  const [photo, setPhoto] = useState<ActionPhotoPreview | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(buildScopedHref(pathname, "/"));
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!authenticatedUser) return;

    let cancelled = false;

    listCoolActions({ perPage: 100 }).then((result) => {
      if (!cancelled) setCoolActions(result.data);
    });

    return () => {
      cancelled = true;
    };
  }, [authenticatedUser]);

  const coolActionOptions = coolActions.map((coolAction) => ({
    label: `${coolAction.title} (${coolAction.points} pts)`,
    value: coolAction.id,
  }));

  const selectedCoolAction =
    coolActions.find((item) => item.id === coolActionId) ?? null;
  const selectedCoolActionOption =
    coolActionOptions.find((option) => option.value === coolActionId) ?? null;
  const selectedNeighborhoodOption =
    neighborhoodOptions.find((option) => option.value === neighborhood) ?? null;

  const currentStepData = registerSteps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  const isStepOneValid =
    coolActionId.trim().length > 0 &&
    description.trim().length > 0 &&
    description.length <= MAX_DESCRIPTION_LENGTH;
  const isStepTwoValid =
    neighborhood.trim().length > 0 && street.trim().length > 0;
  const isStepThreeValid = photo !== null;

  const backHref = buildScopedHref(
    pathname,
    isAuthenticated ? "/minhas-acoes" : "/"
  );

  const handleBack = () => {
    if (currentStep === 1) {
      router.push(backHref);
      return;
    }
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const handleNext = () => {
    if (currentStep === 1 && !isStepOneValid) return;
    if (currentStep === 2 && !isStepTwoValid) return;
    setCurrentStep((step) => Math.min(registerSteps.length, step + 1));
  };

  const handleUploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(event.target.files ?? [])[0];

    if (!file) {
      setUploadKey((current) => current + 1);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`"${file.name}" excede o limite de 5 MB.`);
      setUploadKey((current) => current + 1);
      return;
    }

    setUploadError("");
    setIsUploadingPhoto(true);

    try {
      const uploaded = await createImagePreviewFromFile(file);
      setPhoto(uploaded);
    } finally {
      setIsUploadingPhoto(false);
      setUploadKey((current) => current + 1);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setUploadError("");
  };

  const handleSubmit = async () => {
    if (!authenticatedUser || !isStepOneValid || !isStepTwoValid || !photo) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createDoneCoolAction({
        userId: authenticatedUser.userId,
        coolActionId,
        description: description.trim(),
        neighborhood: neighborhood.trim(),
        street: street.trim(),
        actionPhotoURL: photo.uri,
      });
      router.push(backHref);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Erro ao registrar ação. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">
              {hasHydrated ? "Redirecionando" : "Carregando autenticação"}
            </h1>
            <p className="mt-2 text-sm text-foreground/65">
              {hasHydrated
                ? "Esta área está disponível apenas para usuários autenticados."
                : "Aguarde enquanto validamos sua sessão local."}
            </p>
          </section>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="rounded-[2rem] border border-border-card/70 bg-white/75 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Registro de ação legal
          </p>
        </section>

        <section className="rounded-[2rem] border border-border-card/70 bg-white/75 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem] bg-foreground/5 dark:bg-white/5">
                <StepIcon size={28} weight="fill" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">
                  {currentStepData.title}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-foreground/65 sm:text-base">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center rounded-sm bg-foreground/5 px-5 py-3 text-sm font-medium text-foreground dark:bg-white/5">
              Passo {currentStep} de {registerSteps.length}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {registerSteps.map((step) => (
              <div
                key={step.id}
                className={[
                  "rounded-[1.4rem] border px-4 py-3 transition",
                  step.id === currentStep
                    ? "border-primary-500/40 bg-primary-500/10 text-foreground"
                    : step.id < currentStep
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : "border-border-card/70 bg-background/80 text-foreground/60 dark:bg-white/[0.03]",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Etapa {step.id}
                </p>
                <p className="mt-2 text-sm font-bold sm:text-base">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/85 sm:p-7">
          {currentStep === 1 ? (
            <div className="space-y-6">
              <SelectInput
                label="Ação legal"
                options={coolActionOptions}
                value={selectedCoolActionOption}
                onSelectOption={(option) =>
                  setCoolActionId(String(option?.value ?? ""))
                }
                placeholder={
                  coolActions.length === 0
                    ? "Carregando ações..."
                    : "Selecione a ação legal realizada"
                }
                helperText="Cada ação legal vale uma quantidade de pontos definida pela prefeitura."
                isSearchable
                containerClassName="w-full"
              />

              {selectedCoolAction ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                      Categoria
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                      {normalizeCategory(selectedCoolAction.category)}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                      Pontuação
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                      {selectedCoolAction.points} pontos
                    </p>
                  </div>
                </div>
              ) : null}

              <TextAreaInput
                id="register-cool-action-description"
                label="Descrição"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva a ação legal realizada e o impacto para a cidade."
                maxTextLength={MAX_DESCRIPTION_LENGTH}
                currentTextLength={description.length}
                containerClassName="w-full"
              />
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-6">
              <div className="rounded-[1.6rem] border border-border-card/70 bg-background/80 p-4 dark:bg-white/[0.03] sm:p-5">
                <p className="text-sm leading-6 text-foreground/70">
                  Informe o bairro e o endereço onde a ação legal foi realizada.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SelectInput
                  label="Bairro"
                  options={neighborhoodOptions}
                  value={selectedNeighborhoodOption}
                  onSelectOption={(option) =>
                    setNeighborhood(String(option?.value ?? ""))
                  }
                  placeholder={
                    neighborhoodOptions.length === 0
                      ? "Carregando bairros..."
                      : "Selecione o bairro"
                  }
                  isSearchable
                  containerClassName="w-full"
                />

                <TextInput
                  id="register-cool-action-street"
                  label="Endereço"
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                  placeholder="Ex.: Rua das Acácias, 320"
                  containerClassName="w-full"
                />
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black">Foto da ação</h3>
                <p className="text-sm text-foreground/65">
                  Anexe uma foto que comprove a ação realizada. Aceitamos
                  arquivos de até 5 MB.
                </p>
              </div>

              <FileInput
                key={`register-cool-action-upload-${uploadKey}`}
                label="Foto da ação"
                instructionText="Selecione uma imagem para comprovar a ação."
                buttonTitle="Selecionar imagem"
                accept={ACCEPTED_IMAGE_ACCEPT}
                disabled={photo !== null || isUploadingPhoto}
                onUpload={handleUploadPhoto}
                containerClassName="w-full"
                buttonClassName="rounded-2xl"
              />

              {uploadError ? (
                <div className="flex items-start gap-3 rounded-sm border border-alert-500/25 bg-alert-500/10 p-4 text-sm text-foreground/80">
                  <WarningCircleIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-alert-500"
                  />
                  <p>{uploadError}</p>
                </div>
              ) : null}

              {photo ? (
                <UploadedFilePreview
                  label="Foto da ação"
                  file={photo}
                  onCancel={handleRemovePhoto}
                  containerClassName="rounded-[1.4rem] border-border-card/70 bg-bg-card p-0 text-foreground dark:bg-white/[0.03]"
                  mediaClassName="rounded-[1rem] w-full max-h-20vh object-cover"
                />
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-border-card/70 bg-background/75 p-5 text-sm text-foreground/60 dark:bg-white/[0.03]">
                  Nenhuma imagem selecionada até o momento.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Ação legal
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                    {selectedCoolAction?.title ?? "—"}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Localização
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
                    {neighborhood || "—"}
                    {street ? `, ${street}` : ""}
                  </p>
                </div>
              </div>

              {submitError ? (
                <div className="flex items-start gap-3 rounded-sm border border-destructive-500/25 bg-destructive-500/10 p-4 text-sm text-foreground/80">
                  <WarningCircleIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-destructive-500"
                  />
                  <p>{submitError}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              label="Voltar"
              onClick={handleBack}
              className="w-full justify-center rounded-2xl border border-foreground/15 bg-background px-6 py-3 text-sm font-bold !text-foreground hover:bg-foreground/5"
            />

            {currentStep < registerSteps.length ? (
              <Button
                type="button"
                label="Continuar"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStepOneValid) ||
                  (currentStep === 2 && !isStepTwoValid)
                }
                className="w-full justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600 disabled:cursor-not-allowed disabled:!bg-primary-500/60"
              />
            ) : (
              <Button
                type="button"
                label={
                  isSubmitting || isUploadingPhoto
                    ? "Processando..."
                    : "Registrar ação"
                }
                onClick={handleSubmit}
                disabled={
                  !isStepThreeValid || isUploadingPhoto || isSubmitting
                }
                className="w-full justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600 disabled:cursor-not-allowed disabled:!bg-primary-500/60"
              />
            )}
          </div>
        </section>
      </Section>
    </main>
  );
}
