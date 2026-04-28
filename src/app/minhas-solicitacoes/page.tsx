"use client";

import { UserCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useEffect, useState, type ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  DateInput,
  FileInput,
  ModalsGenericModal as GenericModal,
  PaginationList,
  Section,
  TextAreaInput,
  TextInput,
  UploadedFilePreview,
} from "../../libs/react-ultimate-components/src";
import FilterSearchCard from "../components/FilterSearchCard";
import SolicitationCard from "../components/SolicitationCard";
import {
  buildSolicitationDetailsHref,
  getSolicitationsByRequestingUserId,
  type SolicitationRecord,
  solicitationStatusMap,
  type SolicitationStatus,
} from "../constants/solicitations";
import { useAuth } from "../hooks/useAuth";
import { buildScopedHref } from "../lib/site-paths";

const MAX_PHOTOS_PER_SECTION = 2;
const MAX_DESCRIPTION_LENGTH = 320;

interface EditablePhotoPreview {
  name: string;
  uri: string;
  size: number;
  type: string;
}

interface EditableSolicitationDraft {
  id: string;
  title: string;
  description: string;
  neighborhood: string;
  street: string;
  createdAt: string;
  imageUrls: EditablePhotoPreview[];
  resolutionImageUrls: EditablePhotoPreview[];
}

const createEditablePhotoFromUrl = (
  uri: string,
  prefix: string,
  index: number
): EditablePhotoPreview => ({
  name: `${prefix}-${index + 1}.jpg`,
  uri,
  size: 180,
  type: "image/jpeg",
});

const createDraftFromSolicitation = (
  solicitation: SolicitationRecord
): EditableSolicitationDraft => ({
  id: solicitation.id,
  title: solicitation.title,
  description: solicitation.description,
  neighborhood: solicitation.neighborhood,
  street: solicitation.street,
  createdAt: solicitation.createdAt,
  imageUrls: solicitation.imageUrls
    .slice(0, MAX_PHOTOS_PER_SECTION)
    .map((uri, index) => createEditablePhotoFromUrl(uri, "antes", index)),
  resolutionImageUrls: solicitation.resolutionImageUrls
    .slice(0, MAX_PHOTOS_PER_SECTION)
    .map((uri, index) => createEditablePhotoFromUrl(uri, "depois", index)),
});

const createPhotoPreviewFromFile = (file: File) =>
  new Promise<EditablePhotoPreview>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        name: file.name,
        uri: String(reader.result),
        size: Math.max(1, Math.round(file.size / 1024)),
        type: file.type || "image/jpeg",
      });
    };

    reader.onerror = () => reject(new Error("Falha ao carregar imagem."));
    reader.readAsDataURL(file);
  });

export default function MySolicitationsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticatedUser, hasHydrated, isAuthenticated } = useAuth();
  const [mySolicitations, setMySolicitations] = useState<SolicitationRecord[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    SolicitationStatus | "all"
  >("all");
  const [selectedRequestingUserId, setSelectedRequestingUserId] =
    useState("all");
  const [dateOrder, setDateOrder] = useState<"recent" | "oldest">("recent");
  const [page, setPage] = useState(1);
  const [editDraft, setEditDraft] = useState<EditableSolicitationDraft | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<SolicitationRecord | null>(
    null
  );
  const [createdAtDate, setCreatedAtDate] = useState(new Date());
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [beforeUploadKey, setBeforeUploadKey] = useState(0);
  const [afterUploadKey, setAfterUploadKey] = useState(0);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(buildScopedHref(pathname, "/"));
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  useEffect(() => {
    if (authenticatedUser) {
      setMySolicitations(
        getSolicitationsByRequestingUserId(authenticatedUser.name).map(
          (item) => ({
            ...item,
            imageUrls: item.imageUrls.slice(0, MAX_PHOTOS_PER_SECTION),
            resolutionImageUrls: item.resolutionImageUrls.slice(
              0,
              MAX_PHOTOS_PER_SECTION
            ),
          })
        )
      );
    }
  }, [authenticatedUser]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedNeighborhood,
    selectedStatus,
    selectedRequestingUserId,
    dateOrder,
  ]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSolicitations = mySolicitations
    .filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          item.title,
          item.description,
          item.neighborhood,
          item.street,
          item.requestingUserId,
          item.protocolNumber,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesNeighborhood =
        selectedNeighborhood === "all" ||
        item.neighborhood === selectedNeighborhood;

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      const matchesRequestingUser =
        selectedRequestingUserId === "all" ||
        item.requestingUserId === selectedRequestingUserId;

      return (
        matchesSearch &&
        matchesNeighborhood &&
        matchesStatus &&
        matchesRequestingUser
      );
    })
    .sort((left, right) => {
      const leftDate = new Date(left.createdAt).getTime();
      const rightDate = new Date(right.createdAt).getTime();

      return dateOrder === "recent"
        ? rightDate - leftDate
        : leftDate - rightDate;
    });

  const totalPages = Math.max(1, Math.ceil(filteredSolicitations.length / 5));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

  const neighborhoodOptions = Array.from(
    new Set(mySolicitations.map((item) => item.neighborhood))
  ).sort((left, right) => left.localeCompare(right));

  const requestingUserOptions = [authenticatedUser.name];

  const statusOptions = (
    Object.keys(solicitationStatusMap) as SolicitationStatus[]
  ).map((status) => ({
    value: status,
    label: solicitationStatusMap[status].label,
  }));

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedNeighborhood !== "all" ||
    selectedStatus !== "all" ||
    selectedRequestingUserId !== "all" ||
    dateOrder !== "recent";

  const isEditFormInvalid =
    !editDraft ||
    editDraft.title.trim().length === 0 ||
    editDraft.description.trim().length === 0 ||
    editDraft.neighborhood.trim().length === 0 ||
    editDraft.street.trim().length === 0;

  const handleResetFilters = () => {
    setSearch("");
    setSelectedNeighborhood("all");
    setSelectedStatus("all");
    setSelectedRequestingUserId("all");
    setDateOrder("recent");
  };

  const handleOpenEditModal = (solicitation: SolicitationRecord) => {
    setEditDraft(createDraftFromSolicitation(solicitation));
    setCreatedAtDate(new Date(solicitation.createdAt));
    setBeforeUploadKey((current) => current + 1);
    setAfterUploadKey((current) => current + 1);
  };

  const handleCloseEditModal = () => {
    setEditDraft(null);
    setIsUploadingPhotos(false);
  };

  const handleOpenDeleteModal = (solicitation: SolicitationRecord) => {
    setDeleteTarget(solicitation);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
  };

  const handleChangeDraftField = (
    field: keyof Omit<
      EditableSolicitationDraft,
      "id" | "createdAt" | "imageUrls" | "resolutionImageUrls"
    >,
    value: string
  ) => {
    setEditDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, [field]: value } : currentDraft
    );
  };

  const handleUploadPhotos = async (
    field: "imageUrls" | "resolutionImageUrls",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!editDraft) return;

    const files = Array.from(event.target.files ?? []);
    const remainingSlots =
      MAX_PHOTOS_PER_SECTION - editDraft[field].length;

    if (files.length === 0 || remainingSlots <= 0) {
      return;
    }

    setIsUploadingPhotos(true);

    try {
      const uploadedPhotos = await Promise.all(
        files.slice(0, remainingSlots).map((file) => createPhotoPreviewFromFile(file))
      );

      setEditDraft((currentDraft) =>
        currentDraft
          ? {
              ...currentDraft,
              [field]: [...currentDraft[field], ...uploadedPhotos],
            }
          : currentDraft
      );
    } finally {
      setIsUploadingPhotos(false);
      if (field === "imageUrls") {
        setBeforeUploadKey((current) => current + 1);
      } else {
        setAfterUploadKey((current) => current + 1);
      }
    }
  };

  const handleRemovePhoto = (
    field: "imageUrls" | "resolutionImageUrls",
    indexToRemove: number
  ) => {
    setEditDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            [field]: currentDraft[field].filter(
              (_, photoIndex) => photoIndex !== indexToRemove
            ),
          }
        : currentDraft
    );
  };

  const handleSaveSolicitation = () => {
    if (!editDraft) return;

    setMySolicitations((currentItems) =>
      currentItems.map((item) =>
        item.id === editDraft.id
          ? {
              ...item,
              title: editDraft.title.trim(),
              description: editDraft.description.trim(),
              neighborhood: editDraft.neighborhood.trim(),
              street: editDraft.street.trim(),
              imageUrls: editDraft.imageUrls.map((photo) => photo.uri),
              resolutionImageUrls: editDraft.resolutionImageUrls.map(
                (photo) => photo.uri
              ),
            }
          : item
      )
    );

    handleCloseEditModal();
  };

  const handleConfirmDeleteSolicitation = () => {
    if (!deleteTarget) return;

    setMySolicitations((currentItems) =>
      currentItems.filter((item) => item.id !== deleteTarget.id)
    );
    handleCloseDeleteModal();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-white/70 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground/80 shadow-sm">
                <UserCircleIcon size={22} weight="fill" />
                <span>Minhas solicitações</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Minhas solicitações
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                  Gerencie as solicitações cadastradas por você, acompanhe o
                  status atual e acesse rapidamente as ações disponíveis para
                  cada registro.
                </p>
              </div>

              <p className="text-sm font-medium text-foreground/70 sm:text-base">
                Você possui{" "}
                <span className="font-bold text-foreground">
                  {mySolicitations.length} solicitações cadastradas
                </span>
                .
              </p>
            </div>

            <Button
              type="button"
              label="Cadastrar situação"
              className="w-full justify-center rounded-2xl px-6 py-3 text-sm font-bold !bg-emerald-600 hover:!bg-emerald-500 sm:w-auto"
            />
          </div>
        </section>

        <FilterSearchCard
          search={search}
          setSearch={setSearch}
          neighborhood={selectedNeighborhood}
          neighborhoods={neighborhoodOptions}
          onNeighborhoodChange={setSelectedNeighborhood}
          status={selectedStatus}
          statuses={statusOptions}
          onStatusChange={(value) =>
            setSelectedStatus(value as SolicitationStatus | "all")
          }
          requestingUserId={selectedRequestingUserId}
          requestingUsers={requestingUserOptions}
          onRequestingUserIdChange={setSelectedRequestingUserId}
          dateOrder={dateOrder}
          onDateOrderChange={setDateOrder}
          onResetFilters={handleResetFilters}
        />

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                Listagem das minhas solicitações
              </h2>
              <p className="text-sm text-foreground/65">
                {hasActiveFilters
                  ? `Exibindo ${filteredSolicitations.length} de ${mySolicitations.length} resultados encontrados.`
                  : `Exibindo ${filteredSolicitations.length} resultados cadastrados por ${authenticatedUser.name}.`}
              </p>
            </div>
          </div>

          {filteredSolicitations.length > 0 ? (
            <PaginationList
              page={page}
              itemsPerPage={5}
              pagesToShow={4}
              onPageChange={setPage}
              containerClassName="w-full"
              listClassName="gap-5"
              navigationClassName="rounded-[1.75rem] border border-border-card/70 bg-bg-card px-4 py-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)] sm:px-5"
              previousButtonLabel="Anterior"
              nextButtonLabel="Próximo"
              previousButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              nextButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              pageNumberClassName="rounded-full text-sm font-semibold"
              activePageNumberClassName="border border-foreground/15 bg-foreground text-background"
              inactivePageNumberClassName="border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5"
              showItemsPerPageSelect={false}
              showFirstLastButtons={false}
            >
              {filteredSolicitations.map((solicitation) => (
                <SolicitationCard
                  key={solicitation.id}
                  title={solicitation.title}
                  requestingUserId={solicitation.requestingUserId}
                  description={solicitation.description}
                  imageUrls={solicitation.imageUrls}
                  neighborhood={solicitation.neighborhood}
                  createdAt={solicitation.createdAt}
                  street={solicitation.street}
                  status={solicitation.status}
                  detailsHref={buildScopedHref(
                    pathname,
                    buildSolicitationDetailsHref(solicitation.id)
                  )}
                  onEdit={() => handleOpenEditModal(solicitation)}
                  onDelete={() => handleOpenDeleteModal(solicitation)}
                />
              ))}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhuma solicitação encontrada</h3>
              <p className="mt-2 text-sm text-foreground/65">
                Ajuste sua busca ou limpe os filtros para voltar a visualizar
                os registros cadastrados.
              </p>
              <Button
                type="button"
                label="Limpar filtros"
                onClick={handleResetFilters}
                className="mx-auto mt-6 rounded-2xl px-5 py-3 text-sm font-semibold !bg-emerald-600 hover:!bg-emerald-500"
              />
            </div>
          )}
        </section>
      </Section>

      <GenericModal
        open={Boolean(editDraft)}
        onClose={handleCloseEditModal}
        title="Editar solicitação"
        description="Atualize os dados permitidos da solicitação e ajuste as fotos antes e depois conforme necessário."
        size="xl"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Cancelar"
        confirmButtonLabel={isUploadingPhotos ? "Processando..." : "Salvar alterações"}
        confirmButtonDisabled={isEditFormInvalid || isUploadingPhotos}
        onConfirm={handleSaveSolicitation}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-500"
      >
        {editDraft ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput
              id="edit-solicitation-title"
              label="Título"
              value={editDraft.title}
              onChange={(event) =>
                handleChangeDraftField("title", event.target.value)
              }
              placeholder="Digite um título objetivo"
              containerClassName="w-full"
            />

            <DateInput
              id="edit-solicitation-created-at"
              label="Data de cadastro"
              date={createdAtDate}
              setDate={setCreatedAtDate}
              disabled
              className="w-full bg-transparent text-foreground"
              containerClassName="w-full"
            />

            <TextInput
              id="edit-solicitation-neighborhood"
              label="Bairro"
              value={editDraft.neighborhood}
              onChange={(event) =>
                handleChangeDraftField("neighborhood", event.target.value)
              }
              placeholder="Informe o bairro"
              containerClassName="w-full"
            />

            <TextInput
              id="edit-solicitation-street"
              label="Rua"
              value={editDraft.street}
              onChange={(event) =>
                handleChangeDraftField("street", event.target.value)
              }
              placeholder="Informe a rua"
              containerClassName="w-full"
            />

            <div className="md:col-span-2">
              <TextAreaInput
                id="edit-solicitation-description"
                label="Descrição"
                value={editDraft.description}
                onChange={(event) =>
                  handleChangeDraftField("description", event.target.value)
                }
                maxTextLength={MAX_DESCRIPTION_LENGTH}
                currentTextLength={editDraft.description.length}
                placeholder="Descreva a solicitação com mais detalhes"
                containerClassName="w-full"
              />
            </div>

            <section className="space-y-3 rounded-[1.5rem] border border-border-card/60 bg-background/70 p-4 dark:bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground/60">
                  Fotos antes
                </h3>
                <p className="mt-1 text-sm text-foreground/65">
                  Adicione ou remova até 2 fotos do cenário inicial.
                </p>
              </div>

              <FileInput
                key={`before-upload-${beforeUploadKey}`}
                label="Adicionar fotos antes"
                instructionText={`Você pode manter até ${MAX_PHOTOS_PER_SECTION} fotos nesta seção.`}
                buttonTitle="Selecionar imagens"
                accept="image/*"
                multiple
                disabled={editDraft.imageUrls.length >= MAX_PHOTOS_PER_SECTION}
                onUpload={(event) => handleUploadPhotos("imageUrls", event)}
                containerClassName="w-full"
                buttonClassName="rounded-2xl"
              />

              <div className="grid gap-3">
                {editDraft.imageUrls.length > 0 ? (
                  editDraft.imageUrls.map((photo, index) => (
                    <UploadedFilePreview
                      key={`${photo.uri}-${index}`}
                      label={`Foto antes ${index + 1}`}
                      file={photo}
                      onCancel={() => handleRemovePhoto("imageUrls", index)}
                      containerClassName="rounded-[1.25rem] border-border-card/60 bg-bg-card"
                      mediaClassName="rounded-[1rem]"
                    />
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-border-card/60 bg-bg-card p-4 text-sm text-foreground/60">
                    Nenhuma foto de antes selecionada.
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3 rounded-[1.5rem] border border-border-card/60 bg-background/70 p-4 dark:bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground/60">
                  Fotos depois
                </h3>
                <p className="mt-1 text-sm text-foreground/65">
                  Adicione ou remova até 2 fotos do resultado da solicitação.
                </p>
              </div>

              <FileInput
                key={`after-upload-${afterUploadKey}`}
                label="Adicionar fotos depois"
                instructionText={`Você pode manter até ${MAX_PHOTOS_PER_SECTION} fotos nesta seção.`}
                buttonTitle="Selecionar imagens"
                accept="image/*"
                multiple
                disabled={
                  editDraft.resolutionImageUrls.length >= MAX_PHOTOS_PER_SECTION
                }
                onUpload={(event) =>
                  handleUploadPhotos("resolutionImageUrls", event)
                }
                containerClassName="w-full"
                buttonClassName="rounded-2xl"
              />

              <div className="grid gap-3">
                {editDraft.resolutionImageUrls.length > 0 ? (
                  editDraft.resolutionImageUrls.map((photo, index) => (
                    <UploadedFilePreview
                      key={`${photo.uri}-${index}`}
                      label={`Foto depois ${index + 1}`}
                      file={photo}
                      onCancel={() =>
                        handleRemovePhoto("resolutionImageUrls", index)
                      }
                      containerClassName="rounded-[1.25rem] border-border-card/60 bg-bg-card"
                      mediaClassName="rounded-[1rem]"
                    />
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-border-card/60 bg-bg-card p-4 text-sm text-foreground/60">
                    Nenhuma foto de depois selecionada.
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </GenericModal>

      <GenericModal
        open={Boolean(deleteTarget)}
        onClose={handleCloseDeleteModal}
        title="Confirmar remoção"
        description="Essa ação remove a solicitação apenas da sua listagem atual."
        size="sm"
        className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
        showCancelButton
        showConfirmButton
        cancelButtonLabel="Voltar"
        confirmButtonLabel="Remover solicitação"
        onConfirm={handleConfirmDeleteSolicitation}
        cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
        confirmButtonClassName="rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-500"
      >
        {deleteTarget ? (
          <div className="flex items-start gap-3 rounded-[1.4rem] border border-rose-500/15 bg-rose-500/10 p-4 text-sm text-foreground/80">
            <WarningCircleIcon
              size={22}
              weight="fill"
              className="mt-0.5 shrink-0 text-rose-500"
            />
            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                Deseja remover <span className="text-rose-500">{deleteTarget.title}</span>?
              </p>
              <p>
                Depois de confirmar, o item será retirado da listagem de
                solicitações visível nesta sessão.
              </p>
            </div>
          </div>
        ) : null}
      </GenericModal>
    </main>
  );
}
