"use client";

import {
  CameraIcon,
  MapPinAreaIcon,
  NotePencilIcon,
  UserCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useMemo, useState, type ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  DateInput,
  FileInput,
  Section,
  SelectInput,
  TextAreaInput,
  TextInput,
  UploadedFilePreview,
} from "../../libs/react-ultimate-components/src";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";

const MAX_DESCRIPTION_LENGTH = 320;
const MAX_IMAGES = 2;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/heic",
  "image/heif",
]);
const ACCEPTED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".heic",
  ".heif",
];
const ACCEPTED_IMAGE_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif";

const solicitationTypeOptions = [
  { label: "Lote sujo", value: "lote-sujo" },
  { label: "Descarte irregular", value: "descarte-irregular" },
  { label: "Buraco em via pública", value: "buraco-via-publica" },
  { label: "Iluminação pública", value: "iluminacao-publica" },
  { label: "Situação de risco", value: "situacao-risco" },
  { label: "Outro", value: "outro" },
];

const registerSteps = [
  {
    id: 1,
    title: "Descreva sua solicitação",
    subtitle: "Defina o tipo da situação, o título e os detalhes iniciais.",
    icon: NotePencilIcon,
  },
  {
    id: 2,
    title: "Informe o endereço da situação",
    subtitle: "Registre o bairro e a rua onde a ocorrência precisa de atenção.",
    icon: MapPinAreaIcon,
  },
  {
    id: 3,
    title: "Imagens da situação",
    subtitle: "Anexe até duas imagens para complementar a análise do chamado.",
    icon: CameraIcon,
  },
];

interface RegisterImagePreview {
  name: string;
  uri: string;
  size: number;
  type: string;
}

interface RegisterSolicitationForm {
  title: string;
  type: string;
  description: string;
  neighborhood: string;
  street: string;
}

const initialFormState: RegisterSolicitationForm = {
  title: "",
  type: "",
  description: "",
  neighborhood: "",
  street: "",
};

const hasAcceptedExtension = (fileName: string) =>
  ACCEPTED_IMAGE_EXTENSIONS.some((extension) =>
    fileName.toLowerCase().endsWith(extension)
  );

const isAcceptedImageFile = (file: File) =>
  ACCEPTED_IMAGE_TYPES.has(file.type) || hasAcceptedExtension(file.name);

const createImagePreviewFromFile = (file: File) =>
  new Promise<RegisterImagePreview>((resolve, reject) => {
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

export default function RegisterSolicitationPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<RegisterSolicitationForm>(initialFormState);
  const [occurrenceDate, setOccurrenceDate] = useState(new Date());
  const [images, setImages] = useState<RegisterImagePreview[]>([]);
  const [uploadKey, setUploadKey] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const currentStepData = registerSteps[currentStep - 1];
  const currentTypeOption =
    solicitationTypeOptions.find((option) => option.value === form.type) ??
    null;
  const firstName = useMemo(() => {
    if (!hasHydrated || !authenticatedUser) {
      return "cidadão";
    }

    return authenticatedUser.name.split(" ")[0] ?? "cidadão";
  }, [authenticatedUser, hasHydrated]);
  const backHref = buildScopedHref(
    pathname,
    isAuthenticated ? "/minhas-solicitacoes" : "/"
  );

  const isStepOneValid =
    form.title.trim().length > 0 &&
    form.type.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.description.length <= MAX_DESCRIPTION_LENGTH;
  const isStepTwoValid =
    form.neighborhood.trim().length > 0 && form.street.trim().length > 0;
  const isStepThreeValid = images.length > 0;

  const handleChangeField = (
    field: keyof RegisterSolicitationForm,
    value: string
  ) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

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

  const handleUploadImages = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    const remainingSlots = MAX_IMAGES - images.length;

    if (files.length === 0 || remainingSlots <= 0) {
      setUploadKey((current) => current + 1);
      return;
    }

    const feedback: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      if (validFiles.length >= remainingSlots) {
        return;
      }

      if (!isAcceptedImageFile(file)) {
        feedback.push(
          `"${file.name}" não é um formato aceito. Use JPG, JPEG, PNG, WEBP, GIF, BMP, HEIC ou HEIF.`
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        feedback.push(`"${file.name}" excede o limite de 5 MB por imagem.`);
        return;
      }

      validFiles.push(file);
    });

    if (files.length > remainingSlots) {
      feedback.unshift(
        `Você pode manter no máximo ${MAX_IMAGES} fotos nesta solicitação.`
      );
    }

    setUploadError(feedback[0] ?? "");

    if (validFiles.length === 0) {
      setUploadKey((current) => current + 1);
      return;
    }

    setIsUploadingImages(true);

    try {
      const uploadedImages = await Promise.all(
        validFiles.map((file) => createImagePreviewFromFile(file))
      );

      setImages((currentImages) => [...currentImages, ...uploadedImages]);
    } finally {
      setIsUploadingImages(false);
      setUploadKey((current) => current + 1);
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex)
    );
    setUploadError("");
  };

  const handlePublish = () => {
    if (!isStepThreeValid) {
      setUploadError("Selecione pelo menos uma imagem para publicar.");
      return;
    }

    router.push(backHref);
  };

  const StepIcon = currentStepData.icon;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="rounded-[2rem] border border-border-card/70 bg-white/75 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-foreground/5 dark:bg-white/5">
              <UserCircleIcon size={44} weight="fill" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/45">
                Cadastro de solicitação
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Olá, {firstName}
              </h1>
            </div>
          </div>
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
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextInput
                  id="register-solicitation-title"
                  label="Título da solicitação"
                  value={form.title}
                  onChange={(event) =>
                    handleChangeField("title", event.target.value)
                  }
                  placeholder="Ex.: Buraco em frente à escola"
                  containerClassName="lg:col-span-2"
                />

                <SelectInput
                  label="Tipo de solicitação"
                  options={solicitationTypeOptions}
                  value={currentTypeOption}
                  onSelectOption={(selectedOption) =>
                    handleChangeField("type", String(selectedOption?.value ?? ""))
                  }
                  placeholder="Selecione o tipo de situação"
                  helperText="Escolha a categoria que mais se aproxima da ocorrência."
                  isSearchable={false}
                  containerClassName="w-full"
                />

                <DateInput
                  id="register-solicitation-occurrence-date"
                  label="Data da ocorrência"
                  date={occurrenceDate}
                  setDate={setOccurrenceDate}
                  helperText="Informe quando você percebeu ou registrou a situação."
                  className="w-full bg-transparent text-foreground"
                  containerClassName="w-full"
                />

                <div className="lg:col-span-2">
                  <TextAreaInput
                    id="register-solicitation-description"
                    label="Descrição"
                    value={form.description}
                    onChange={(event) =>
                      handleChangeField("description", event.target.value)
                    }
                    placeholder="Descreva a situação, o impacto para a cidade e detalhes que ajudem na análise."
                    maxTextLength={MAX_DESCRIPTION_LENGTH}
                    currentTextLength={form.description.length}
                    containerClassName="w-full"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-6">
              <div className="rounded-[1.6rem] border border-border-card/70 bg-background/80 p-4 dark:bg-white/[0.03] sm:p-5">
                <p className="text-sm leading-6 text-foreground/70">
                  Informe o ponto principal da ocorrência para facilitar o
                  encaminhamento da equipe responsável.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextInput
                  id="register-solicitation-neighborhood"
                  label="Bairro"
                  value={form.neighborhood}
                  onChange={(event) =>
                    handleChangeField("neighborhood", event.target.value)
                  }
                  placeholder="Ex.: Nova Esperança"
                  containerClassName="w-full"
                />

                <TextInput
                  id="register-solicitation-street"
                  label="Rua"
                  value={form.street}
                  onChange={(event) =>
                    handleChangeField("street", event.target.value)
                  }
                  placeholder="Ex.: Rua das Acácias, 320"
                  containerClassName="w-full"
                />
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black">
                  Selecione pelo menos uma imagem
                </h3>
                <p className="text-sm text-foreground/65">
                  Aceitamos arquivos de até 5 MB em JPG, JPEG, PNG, WEBP, GIF,
                  BMP, HEIC ou HEIF. Você pode anexar até {MAX_IMAGES} fotos.
                </p>
              </div>

              <FileInput
                key={`register-upload-${uploadKey}`}
                label="Imagens da situação"
                instructionText={`Selecione até ${MAX_IMAGES} imagens para complementar a solicitação.`}
                buttonTitle="Selecionar imagem"
                accept={ACCEPTED_IMAGE_ACCEPT}
                multiple
                disabled={images.length >= MAX_IMAGES || isUploadingImages}
                onUpload={handleUploadImages}
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

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <UploadedFilePreview
                      key={`${image.uri}-${index}`}
                      label={`Imagem ${index + 1}`}
                      file={image}
                      onCancel={() => handleRemoveImage(index)}
                      containerClassName="rounded-[1.4rem] border-border-card/70 bg-bg-card"
                      mediaClassName="rounded-[1rem]"
                    />
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-border-card/70 bg-background/75 p-5 text-sm text-foreground/60 dark:bg-white/[0.03] lg:col-span-2">
                    Nenhuma imagem selecionada até o momento.
                  </div>
                )}
              </div>
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
                label={isUploadingImages ? "Processando..." : "Publicar"}
                onClick={handlePublish}
                disabled={!isStepThreeValid || isUploadingImages}
                className="w-full justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600 disabled:cursor-not-allowed disabled:!bg-primary-500/60"
              />
            )}
          </div>
        </section>
      </Section>
    </main>
  );
}
