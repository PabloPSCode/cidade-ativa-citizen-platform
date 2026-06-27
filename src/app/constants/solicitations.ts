import type { SolicitationResponseDTO } from "../../services/solicitations";

export type SolicitationStatus =
  | "waiting_approval"
  | "not_resolved"
  | "in_progress"
  | "resolved"
  | "unconsidered";

export interface SolicitationSummary {
  id: string;
  protocolNumber: string;
  title: string;
  requestingUserId: string;
  requestingUserName: string;
  description: string;
  imageUrls: string[];
  neighborhood: string;
  createdAt: string;
  street: string;
  /** Indica se a solicitação representa uma ação coletiva. */
  isCollective?: boolean;
  status: SolicitationStatus;
}

export interface SolicitationRecord extends SolicitationSummary {
  // CEP só é necessário no registro completo (usado no mapa de detalhes); o
  // card-resumo da listagem não o exibe.
  cep: string;
  mapAddress: string;
  resolutionComment: string;
  resolutionImageUrls: string[];
  resolvedAt?: string;
}

export const solicitationStatusMap: Record<
  SolicitationStatus,
  {
    label: string;
    dotClassName: string;
    badgeClassName: string;
  }
> = {
  waiting_approval: {
    label: "Aguardando aprovação",
    dotClassName: "bg-secondary-500",
    badgeClassName:
      "border border-secondary-500/35 bg-secondary-500/10 text-secondary-700 dark:bg-secondary-400/15 dark:text-secondary-100",
  },
  not_resolved: {
    label: "Não resolvido",
    dotClassName: "bg-alert-500",
    badgeClassName:
      "border border-alert-500/35 bg-alert-500/10 text-alert-700 dark:bg-alert-400/15 dark:text-alert-100",
  },
  in_progress: {
    label: "Em andamento",
    dotClassName: "bg-info-500",
    badgeClassName:
      "border border-info-500/35 bg-info-500/10 text-info-700 dark:bg-info-400/15 dark:text-info-100",
  },
  resolved: {
    label: "Resolvido",
    dotClassName: "bg-success-500",
    badgeClassName:
      "border border-success-500/35 bg-success-500/10 text-success-700 dark:bg-success-400/15 dark:text-success-100",
  },
  unconsidered: {
    label: "Não considerado",
    dotClassName: "bg-destructive-500",
    badgeClassName:
      "border border-destructive-500/35 bg-destructive-500/10 text-destructive-700 dark:bg-destructive-400/15 dark:text-destructive-100",
  },
};

export const statusOptions = (
  Object.keys(solicitationStatusMap) as SolicitationStatus[]
).map((status) => ({
  value: status,
  label: solicitationStatusMap[status].label,
}));

// Solicitations awaiting approval are only visible to their owner on the
// "my solicitations" screen, so they are excluded from public-facing filters.
export const publicStatusOptions = statusOptions.filter(
  (option) => option.value !== "waiting_approval"
);

// Maximum number of open (unresolved) solicitations a user may have before
// being blocked from registering a new one.
export const MAX_OPEN_SOLICITATIONS = 3;

export const OPEN_SOLICITATIONS_LIMIT_MESSAGE =
  "Você já possui 3 solicitações em aberto. Aguarde a resolução de ao menos uma solicitação para abrir uma nova solicitação.";

// A solicitation is considered "open" until it has been resolved.
export const isSolicitationOpen = (status: SolicitationStatus) =>
  status !== "resolved";

export const formatSolicitationDate = (value?: string) => {
  if (!value) return "Em aberto";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export const buildSolicitationDetailsHref = (id: string) =>
  `/solicitacoes/${id}`;

// CEP (código postal brasileiro). O back-end exige o formato 00000-000.
export const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
};

export const isValidCep = (value: string) => /^\d{5}-?\d{3}$/.test(value.trim());

export function mapSolicitationDTOToRecord(
  dto: SolicitationResponseDTO
): SolicitationRecord {
  const createdAt =
    typeof dto.createdAt === "string"
      ? dto.createdAt
      : new Date(dto.createdAt).toISOString();

  const resolvedAt = dto.solvedDate
    ? typeof dto.solvedDate === "string"
      ? dto.solvedDate
      : new Date(dto.solvedDate).toISOString()
    : undefined;

  return {
    id: dto.id,
    protocolNumber: dto.protocolNumber ?? dto.id.slice(0, 8).toUpperCase(),
    title: dto.title,
    requestingUserId: dto.requestingUserId,
    requestingUserName: dto.requestingUserName ?? '',
    description: dto.description,
    imageUrls: dto.unsolvedImageUrls,
    neighborhood: dto.neighborhood,
    createdAt,
    street: dto.street,
    cep: dto.cep ?? "",
    isCollective: dto.isCollective ?? false,
    status: dto.status,
    mapAddress: `${dto.street}, ${dto.neighborhood}, Brasil`,
    resolutionComment: dto.solvedCommentary ?? "",
    resolutionImageUrls: dto.solvedImageUrls ?? [],
    resolvedAt,
  };
}
