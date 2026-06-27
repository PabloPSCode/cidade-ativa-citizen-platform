"use client";

import { MedalIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Button,
  FileInput,
  ModalsGenericModal as GenericModal,
  PaginationList,
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
import {
  deleteDoneCoolAction,
  listDoneCoolActions,
  updateDoneCoolAction,
} from "../../services/done-cool-actions";
import DoneCoolActionCard from "../components/DoneCoolActionCard";
import {
  mapDoneCoolActionToRecord,
  normalizeCategory,
  type DoneCoolActionRecord,
} from "../constants/done-cool-actions";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";

const ITEMS_PER_PAGE = 5;
const MAX_DESCRIPTION_LENGTH = 320;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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

export default function MyCoolActionsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated } = useAuth();

  const [records, setRecords] = useState<DoneCoolActionRecord[]>([]);
  const [coolActions, setCoolActions] = useState<CoolActionResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editTarget, setEditTarget] = useState<DoneCoolActionRecord | null>(
    null
  );
  const [editCoolActionId, setEditCoolActionId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNeighborhood, setEditNeighborhood] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editPhoto, setEditPhoto] = useState<ActionPhotoPreview | null>(null);
  const [editUploadKey, setEditUploadKey] = useState(0);
  const [editUploadError, setEditUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DoneCoolActionRecord | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(buildScopedHref(pathname, "/"));
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!authenticatedUser) return;

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [doneResult, coolActionsResult] = await Promise.all([
          listDoneCoolActions({
            userId: authenticatedUser!.userId,
            perPage: 100,
          }),
          listCoolActions({ perPage: 100 }),
        ]);

        if (cancelled) return;

        const coolActionsById = new Map<string, CoolActionResponseDTO>(
          coolActionsResult.data.map((item) => [item.id, item])
        );

        setCoolActions(coolActionsResult.data);
        setRecords(
          doneResult.data.map((item) =>
            mapDoneCoolActionToRecord(item, coolActionsById)
          )
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [authenticatedUser]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        if (normalizedSearch.length === 0) return true;
        return [
          record.coolActionTitle,
          record.category,
          record.description,
          record.neighborhood,
          record.street,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      }),
    [records, normalizedSearch]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const coolActionOptions = coolActions.map((coolAction) => ({
    label: `${coolAction.title} (${coolAction.points} pts)`,
    value: coolAction.id,
  }));

  const selectedEditOption =
    coolActionOptions.find((option) => option.value === editCoolActionId) ??
    null;

  const handleOpenEditModal = (record: DoneCoolActionRecord) => {
    setEditTarget(record);
    setEditCoolActionId(record.coolActionId);
    setEditDescription(record.description);
    setEditNeighborhood(record.neighborhood);
    setEditStreet(record.street);
    setEditPhoto(
      record.actionPhotoURL
        ? {
            name: "foto-da-acao.jpg",
            uri: record.actionPhotoURL,
            size: 180,
            type: "image/jpeg",
          }
        : null
    );
    setEditUploadError("");
    setEditUploadKey((current) => current + 1);
  };

  const handleCloseEditModal = () => {
    setEditTarget(null);
    setEditCoolActionId("");
    setEditDescription("");
    setEditNeighborhood("");
    setEditStreet("");
    setEditPhoto(null);
    setEditUploadError("");
  };

  const handleEditPhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(event.target.files ?? [])[0];

    if (!file) {
      setEditUploadKey((current) => current + 1);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setEditUploadError(`"${file.name}" excede o limite de 5 MB.`);
      setEditUploadKey((current) => current + 1);
      return;
    }

    setEditUploadError("");
    try {
      const uploaded = await createImagePreviewFromFile(file);
      setEditPhoto(uploaded);
    } finally {
      setEditUploadKey((current) => current + 1);
    }
  };

  const isEditFormValid =
    editCoolActionId.trim().length > 0 &&
    editDescription.trim().length > 0 &&
    editNeighborhood.trim().length > 0 &&
    editStreet.trim().length > 0 &&
    Boolean(editPhoto?.uri);

  const hasEditChanges =
    Boolean(editTarget) &&
    (editCoolActionId !== editTarget?.coolActionId ||
      editDescription.trim() !== editTarget?.description ||
      editNeighborhood.trim() !== editTarget?.neighborhood ||
      editStreet.trim() !== editTarget?.street ||
      editPhoto?.uri !== editTarget?.actionPhotoURL);

  const handleSave = async () => {
    if (!editTarget || !isEditFormValid || !editPhoto) return;

    setIsSaving(true);
    try {
      await updateDoneCoolAction(editTarget.id, {
        coolActionId: editCoolActionId,
        description: editDescription.trim(),
        neighborhood: editNeighborhood.trim(),
        street: editStreet.trim(),
        actionPhotoURL: editPhoto.uri,
      });

      const coolAction = coolActions.find(
        (item) => item.id === editCoolActionId
      );

      setRecords((current) =>
        current.map((record) =>
          record.id === editTarget.id
            ? {
                ...record,
                coolActionId: editCoolActionId,
                description: editDescription.trim(),
                neighborhood: editNeighborhood.trim(),
                street: editStreet.trim(),
                actionPhotoURL: editPhoto.uri,
                coolActionTitle: coolAction?.title ?? record.coolActionTitle,
                category: coolAction
                  ? normalizeCategory(coolAction.category)
                  : record.category,
                points: coolAction?.points ?? record.points,
              }
            : record
        )
      );
      handleCloseEditModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      // Soft delete: o endpoint marca o registro como removido no back-end;
      // aqui apenas o retiramos da listagem visível.
      await deleteDoneCoolAction(deleteTarget.id);
      setRecords((current) =>
        current.filter((record) => record.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">Carregando autenticação</h1>
            <p className="mt-2 text-sm text-foreground/65">
              Aguarde enquanto validamos sua sessão local.
            </p>
          </section>
        </Section>
      </main>
    );
  }

  if (!isAuthenticated || !authenticatedUser) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Section
          size="middle"
          sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
        >
          <section className="rounded-[2rem] border border-border-card/70 bg-bg-card p-8 text-center shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)]">
            <h1 className="text-2xl font-black">Redirecionando</h1>
            <p className="mt-2 text-sm text-foreground/65">
              Esta área está disponível apenas para usuários autenticados.
            </p>
          </section>
        </Section>
      </main>
    );
  }

  const hasActiveSearch = search.trim().length > 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
                <MedalIcon size={22} weight="fill" />
                <span>Minhas ações</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Minhas ações legais
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                  Acompanhe as ações legais registradas por você, edite o tipo
                  da ação ou remova registros que não fazem mais sentido.
                </p>
              </div>

              {!isLoading && (
                <p className="text-sm font-medium text-foreground/70 sm:text-base">
                  Você possui{" "}
                  <span className="font-bold text-foreground">
                    {records.length} ações registradas
                  </span>
                  .
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
              <Button
                type="button"
                label="Registrar nova ação"
                onClick={() =>
                  router.push(buildScopedHref(pathname, "/cadastrar-acao"))
                }
                className="w-full justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600 sm:w-auto"
              />
            </div>
          </div>

          <TextInput
            id="cool-actions-search"
            label="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Busque por ação, categoria ou solicitação"
            containerClassName="w-full"
          />
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Listagem das minhas ações
            </h2>
            <p className="text-sm text-foreground/65">
              {isLoading
                ? "Carregando suas ações..."
                : hasActiveSearch
                ? `Exibindo ${filteredRecords.length} de ${records.length} ações registradas.`
                : `Exibindo ${filteredRecords.length} ações registradas.`}
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
              <p className="text-sm text-foreground/65">
                Carregando suas ações...
              </p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <PaginationList
              page={page}
              itemsPerPage={ITEMS_PER_PAGE}
              pagesToShow={4}
              onPageChange={setPage}
              containerClassName="w-full"
              listClassName="gap-5"
              navigationClassName="rounded-[1.75rem] border border-border-card/70 bg-bg-card px-4 py-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)] sm:px-5"
              previousButtonLabel="Anterior"
              nextButtonLabel="Próximo"
              previousButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              nextButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              pageNumberClassName="rounded-sm text-sm font-medium"
              activePageNumberClassName="border border-foreground/15 bg-foreground !text-background"
              inactivePageNumberClassName="border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5"
              showItemsPerPageSelect={false}
              showFirstLastButtons={false}
            >
              {filteredRecords.map((record) => (
                <DoneCoolActionCard
                  key={record.id}
                  coolActionTitle={record.coolActionTitle}
                  category={record.category}
                  points={record.points}
                  description={record.description}
                  neighborhood={record.neighborhood}
                  street={record.street}
                  actionPhotoURL={record.actionPhotoURL}
                  createdAt={record.createdAt}
                  onEdit={() => handleOpenEditModal(record)}
                  onDelete={() => setDeleteTarget(record)}
                />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhuma ação encontrada</h3>
              <p className="mt-2 text-sm text-foreground/65">
                {hasActiveSearch
                  ? "Ajuste sua busca para voltar a visualizar os registros."
                  : "Registre sua primeira ação legal para começar a pontuar."}
              </p>
              <Button
                type="button"
                label="Registrar nova ação"
                onClick={() =>
                  router.push(buildScopedHref(pathname, "/cadastrar-acao"))
                }
                className="mx-auto mt-6 rounded-sm px-5 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600"
              />
            </div>
          )}
        </section>
      </Section>

      <GenericModal
        open={Boolean(editTarget)}
        onClose={handleCloseEditModal}
        title="Editar ação legal"
        description="Atualize os dados da ação legal registrada."
        size="lg"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Cancelar"
        confirmButtonLabel={isSaving ? "Salvando..." : "Salvar alterações"}
        confirmButtonDisabled={isSaving || !isEditFormValid || !hasEditChanges}
        onConfirm={handleSave}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-primary-500 px-5 py-3 font-medium text-white hover:bg-primary-600"
      >
        {editTarget ? (
          <div className="space-y-4">
            <SelectInput
              label="Ação legal"
              options={coolActionOptions}
              value={selectedEditOption}
              onSelectOption={(option) =>
                setEditCoolActionId(String(option?.value ?? ""))
              }
              placeholder="Selecione a ação legal"
              helperText="Escolha o tipo de ação legal realizada."
              isSearchable
              containerClassName="w-full"
            />

            <TextAreaInput
              id="edit-cool-action-description"
              label="Descrição"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              maxTextLength={MAX_DESCRIPTION_LENGTH}
              currentTextLength={editDescription.length}
              placeholder="Descreva a ação legal realizada"
              containerClassName="w-full"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                id="edit-cool-action-neighborhood"
                label="Bairro"
                value={editNeighborhood}
                onChange={(event) => setEditNeighborhood(event.target.value)}
                placeholder="Informe o bairro"
                containerClassName="w-full"
              />

              <TextInput
                id="edit-cool-action-street"
                label="Endereço"
                value={editStreet}
                onChange={(event) => setEditStreet(event.target.value)}
                placeholder="Informe o endereço"
                containerClassName="w-full"
              />
            </div>

            <div className="space-y-3">
              <FileInput
                key={`edit-cool-action-upload-${editUploadKey}`}
                label="Foto da ação"
                instructionText="Substitua a foto da ação, se necessário."
                buttonTitle="Selecionar imagem"
                accept="image/*"
                onUpload={handleEditPhotoUpload}
                containerClassName="w-full"
                buttonClassName="rounded-2xl"
              />

              {editUploadError ? (
                <div className="flex items-start gap-3 rounded-sm border border-alert-500/25 bg-alert-500/10 p-4 text-sm text-foreground/80">
                  <WarningCircleIcon
                    size={20}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-alert-500"
                  />
                  <p>{editUploadError}</p>
                </div>
              ) : null}

              {editPhoto ? (
                <UploadedFilePreview
                  label="Foto da ação"
                  file={editPhoto}
                  onCancel={() => setEditPhoto(null)}
                  containerClassName="rounded-[1.25rem] border-border-card/60 bg-bg-card"
                  mediaClassName="rounded-[1rem]"
                />
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-border-card/60 bg-bg-card p-4 text-sm text-foreground/60">
                  Nenhuma foto selecionada.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </GenericModal>

      <GenericModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar remoção"
        description="A ação será removida da sua listagem."
        size="sm"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Voltar"
        confirmButtonLabel={isDeleting ? "Removendo..." : "Remover ação"}
        confirmButtonDisabled={isDeleting}
        onConfirm={handleConfirmDelete}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-sm bg-destructive-500 px-5 py-3 font-medium text-white hover:bg-destructive-600"
      >
        {deleteTarget ? (
          <div className="flex items-start gap-3 rounded-sm border border-destructive-500/20 bg-destructive-500/10 p-4 text-sm text-foreground/80">
            <WarningCircleIcon
              size={22}
              weight="fill"
              className="mt-0.5 shrink-0 text-destructive-500"
            />
            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                Deseja remover{" "}
                <span className="text-destructive-500">
                  {deleteTarget.coolActionTitle}
                </span>
                ?
              </p>
              <p>
                O registro deixará de aparecer na sua lista de ações legais.
              </p>
            </div>
          </div>
        ) : null}
      </GenericModal>
    </main>
  );
}
