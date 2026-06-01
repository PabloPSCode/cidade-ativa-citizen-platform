import { mockAuthenticatedUser } from "./auth";

export type SolicitationStatus = "not_resolved" | "in_progress" | "resolved";

export interface SolicitationSummary {
  id: string;
  protocolNumber: string;
  title: string;
  requestingUserId: string;
  description: string;
  imageUrls: string[];
  neighborhood: string;
  createdAt: string;
  street: string;
  status: SolicitationStatus;
}

export interface SolicitationRecord extends SolicitationSummary {
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
  not_resolved: {
    label: "Não resolvido",
    dotClassName: "bg-alert-500",
    badgeClassName:
      "border border-alert-500/30 bg-alert-500/10 text-alert-700 dark:bg-alert-400/15 dark:text-alert-100",
  },
  in_progress: {
    label: "Em andamento",
    dotClassName: "bg-primary-500",
    badgeClassName:
      "border border-primary-500/30 bg-primary-500/10 text-primary-700 dark:bg-primary-400/15 dark:text-primary-100",
  },
  resolved: {
    label: "Resolvido",
    dotClassName: "bg-foreground/55",
    badgeClassName:
      "border border-foreground/15 bg-foreground/10 text-foreground dark:bg-white/10 dark:text-white",
  },
};

const otherRequesterNames = [
  "José Antônio da Silva",
  "Maria Clara Souza",
  "André Luiz Pereira",
  "Helena Aparecida Rocha",
  "Roberto Nunes Costa",
  "Paula Cristina Martins",
];

const beforeImageSets = [
  [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  ],
];

const afterImageSets = [
  [
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=900&q=80",
  ],
];

const baseSolicitations: Array<
  Omit<
    SolicitationRecord,
    | "id"
    | "protocolNumber"
    | "createdAt"
    | "requestingUserId"
    | "status"
    | "resolvedAt"
    | "resolutionComment"
  >
> = [
  {
    title: "Lote com mato alto e descarte irregular",
    description:
      "Lote vazio tomado por mato alto, descarte irregular e focos de água parada bloqueando a passagem de pedestres e ciclistas.",
    neighborhood: "Nova Esperança",
    street: "Rua das Acácias, 142",
    mapAddress:
      "Rua das Acácias, 142, Nova Esperança, Belo Horizonte - MG, Brasil",
    imageUrls: beforeImageSets[0],
    resolutionImageUrls: afterImageSets[0],
  },
  {
    title: "Bueiro aberto em frente à escola",
    description:
      "Bueiro sem tampa em frente à escola municipal, com risco constante para crianças, motociclistas e moradores da rua.",
    neighborhood: "Jardim Primavera",
    street: "Avenida Central, 820",
    mapAddress:
      "Avenida Central, 820, Jardim Primavera, Contagem - MG, Brasil",
    imageUrls: beforeImageSets[1],
    resolutionImageUrls: afterImageSets[1],
  },
  {
    title: "Iluminação pública apagada na via",
    description:
      "Iluminação pública apagada em três postes consecutivos, deixando o trecho escuro e inseguro durante a noite.",
    neighborhood: "Vila Aurora",
    street: "Rua Francisco Melo, 51",
    mapAddress: "Rua Francisco Melo, 51, Vila Aurora, Betim - MG, Brasil",
    imageUrls: beforeImageSets[2],
    resolutionImageUrls: afterImageSets[2],
  },
  {
    title: "Calçada danificada na área da UBS",
    description:
      "Calçada quebrada e inclinada na área da UBS, dificultando o acesso de cadeirantes e idosos ao atendimento.",
    neighborhood: "Centro",
    street: "Praça da Matriz, 12",
    mapAddress: "Praça da Matriz, 12, Centro, Sabará - MG, Brasil",
    imageUrls: beforeImageSets[3],
    resolutionImageUrls: afterImageSets[3],
  },
  {
    title: "Acúmulo de lixo orgânico na esquina",
    description:
      "Acúmulo frequente de lixo orgânico em esquina residencial, atraindo insetos, mau cheiro e animais.",
    neighborhood: "Parque dos Girassóis",
    street: "Rua das Rosas, 204",
    mapAddress:
      "Rua das Rosas, 204, Parque dos Girassóis, Lagoa Santa - MG, Brasil",
    imageUrls: beforeImageSets[4],
    resolutionImageUrls: afterImageSets[4],
  },
  {
    title: "Faixa de pedestres apagada no cruzamento",
    description:
      "Sinalização horizontal quase apagada em cruzamento muito movimentado, com vários relatos de quase acidentes.",
    neighborhood: "Residencial do Lago",
    street: "Rua do Comércio, 331",
    mapAddress:
      "Rua do Comércio, 331, Residencial do Lago, Nova Lima - MG, Brasil",
    imageUrls: beforeImageSets[5],
    resolutionImageUrls: afterImageSets[5],
  },
];

const solicitationStatuses: SolicitationStatus[] = [
  "resolved",
  "in_progress",
  "not_resolved",
];

const resolutionCommentByStatus: Record<SolicitationStatus, string> = {
  resolved:
    "A situação foi resolvida com apoio da prefeitura e validada pela equipe de campo após nova vistoria.",
  in_progress:
    "A equipe técnica realizou a vistoria inicial e o atendimento segue programado para a próxima janela operacional.",
  not_resolved:
    "A demanda foi registrada e aguarda o primeiro atendimento da equipe responsável para definição da tratativa.",
};

export const mockedSolicitations: SolicitationRecord[] = Array.from(
  { length: 18 },
  (_, index) => {
    const seed = baseSolicitations[index % baseSolicitations.length];
    const month = index % 4;
    const day = 3 + index;
    const status = solicitationStatuses[index % solicitationStatuses.length];
    const createdAt = new Date(2026, month, day).toISOString();
    const resolvedAt =
      status === "resolved"
        ? new Date(2026, month, day + 2).toISOString()
        : undefined;

    return {
      id: `sol-${index + 1}`,
      protocolNumber: `${12331 + index}`,
      requestingUserId:
        index < 12
          ? mockAuthenticatedUser.name
          : otherRequesterNames[(index - 12) % otherRequesterNames.length],
      ...seed,
      createdAt,
      resolvedAt,
      status,
      resolutionComment: resolutionCommentByStatus[status],
      resolutionImageUrls:
        status === "not_resolved" ? [] : seed.resolutionImageUrls,
    };
  }
);

export const neighborhoodOptions = Array.from(
  new Set(mockedSolicitations.map((item) => item.neighborhood))
).sort((left, right) => left.localeCompare(right));

export const requestingUserOptions = Array.from(
  new Set(mockedSolicitations.map((item) => item.requestingUserId))
).sort((left, right) => left.localeCompare(right));

export const statusOptions = solicitationStatuses.map((status) => ({
  value: status,
  label: solicitationStatusMap[status].label,
}));

export const solicitationStats = {
  total: mockedSolicitations.length,
  pending: mockedSolicitations.filter(
    (item) => item.status === "not_resolved"
  ).length,
  inProgress: mockedSolicitations.filter(
    (item) => item.status === "in_progress"
  ).length,
  resolved: mockedSolicitations.filter((item) => item.status === "resolved")
    .length,
};

export const formatSolicitationDate = (value?: string) => {
  if (!value) return "Em aberto";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export const getSolicitationById = (id: string) =>
  mockedSolicitations.find((item) => item.id === id);

export const getSolicitationsByRequestingUserId = (
  requestingUserId: string
) => mockedSolicitations.filter((item) => item.requestingUserId === requestingUserId);

export const buildSolicitationDetailsHref = (id: string) =>
  `/solicitacoes/${id}`;
