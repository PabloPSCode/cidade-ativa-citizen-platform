import type { CoolActionResponseDTO } from "../../services/cool-actions";
import type { DoneCoolActionResponseDTO } from "../../services/done-cool-actions";

/** Registro de ação legal já enriquecido com dados de exibição. */
export interface DoneCoolActionRecord {
  id: string;
  coolActionId: string;
  description: string;
  neighborhood: string;
  street: string;
  actionPhotoURL: string;
  createdAt: string;
  coolActionTitle: string;
  category: string;
  points: number;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
});

export const formatDoneCoolActionDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
};

/** Converte categorias cruas (ex.: "PUBLIC_LIGHTING") em rótulos legíveis. */
export const normalizeCategory = (category: string) =>
  (category ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

/**
 * Combina o registro de ação concluída com os dados de catálogo (ação legal e
 * solicitação) para montar uma linha pronta para exibição.
 */
export const mapDoneCoolActionToRecord = (
  doneCoolAction: DoneCoolActionResponseDTO,
  coolActionsById: Map<string, CoolActionResponseDTO>
): DoneCoolActionRecord => {
  const coolAction = coolActionsById.get(doneCoolAction.coolActionId);

  return {
    id: doneCoolAction.id,
    coolActionId: doneCoolAction.coolActionId,
    description: doneCoolAction.description,
    neighborhood: doneCoolAction.neighborhood,
    street: doneCoolAction.street,
    actionPhotoURL: doneCoolAction.actionPhotoURL,
    createdAt:
      doneCoolAction.createdAt instanceof Date
        ? doneCoolAction.createdAt.toISOString()
        : String(doneCoolAction.createdAt),
    coolActionTitle: coolAction?.title ?? "Ação não encontrada",
    category: coolAction ? normalizeCategory(coolAction.category) : "—",
    points: coolAction?.points ?? 0,
  };
};
