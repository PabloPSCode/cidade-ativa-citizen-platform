import type {
  SolicitationRecord,
  SolicitationStatus,
} from "./solicitations";

export interface CitizenLegalRankingEntry {
  id: string;
  position: number;
  fullName: string;
  points: number;
  createdAt: string;
}

export interface CitizenLegalActionRecord extends SolicitationRecord {
  citizenId: string;
  citizenName: string;
}

export const citizenLegalRanking: CitizenLegalRankingEntry[] = [
  {
    id: "cid-legal-1",
    position: 1,
    fullName: "Pablo Silva",
    points: 180,
    createdAt: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "cid-legal-2",
    position: 2,
    fullName: "José Roberto Bruno da Silva",
    points: 160,
    createdAt: "2026-01-03T09:00:00.000Z",
  },
  {
    id: "cid-legal-3",
    position: 3,
    fullName: "Marina Costa Fernandes",
    points: 145,
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "cid-legal-4",
    position: 4,
    fullName: "André Luiz Pereira",
    points: 132,
    createdAt: "2026-01-07T09:00:00.000Z",
  },
  {
    id: "cid-legal-5",
    position: 5,
    fullName: "Camila Vitória Souza",
    points: 128,
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "cid-legal-6",
    position: 6,
    fullName: "Helena Aparecida Rocha",
    points: 120,
    createdAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "cid-legal-7",
    position: 7,
    fullName: "Rafael Martins Lima",
    points: 114,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "cid-legal-8",
    position: 8,
    fullName: "Patrícia Nogueira Alves",
    points: 109,
    createdAt: "2026-01-18T09:00:00.000Z",
  },
  {
    id: "cid-legal-9",
    position: 9,
    fullName: "Carlos Eduardo Mendes",
    points: 104,
    createdAt: "2026-01-21T09:00:00.000Z",
  },
  {
    id: "cid-legal-10",
    position: 10,
    fullName: "Fernanda Gomes Batista",
    points: 98,
    createdAt: "2026-01-24T09:00:00.000Z",
  },
];

export const citizenLegalMonthLabel = "Março 2026";

const actionStatusCycle: SolicitationStatus[] = [
  "resolved",
  "resolved",
  "resolved",
  "in_progress",
  "resolved",
  "resolved",
];

const beforeImageSets = [
  [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
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

const afterImageSets = [
  [
    "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1469571486292-b53601020f1b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  ],
];

const actionTemplates: Array<
  Omit<
    CitizenLegalActionRecord,
    | "id"
    | "protocolNumber"
    | "createdAt"
    | "resolvedAt"
    | "status"
    | "citizenId"
    | "citizenName"
    | "requestingUserId"
    | "requestingUserName"
  >
> = [
  {
    title: "Mutirão de limpeza na praça central",
    description:
      "Organização de mutirão comunitário para limpeza da praça principal e orientação sobre descarte correto de resíduos.",
    neighborhood: "Centro",
    street: "Praça da Estação, 120",
    cep: "30160-012",
    mapAddress: "Praça da Estação, 120, Centro, Belo Horizonte - MG, Brasil",
    imageUrls: beforeImageSets[0],
    resolutionComment:
      "A mobilização envolveu moradores, comerciantes e estudantes, resultando em área limpa, coleta seletiva estruturada e maior consciência ambiental no entorno.",
    resolutionImageUrls: afterImageSets[0],
  },
  {
    title: "Plantio de mudas no corredor escolar",
    description:
      "Plantio de mudas nativas em corredor escolar para ampliar sombra, reduzir calor e incentivar educação ambiental entre crianças.",
    neighborhood: "Jardim Primavera",
    street: "Rua das Mangueiras, 88",
    cep: "32010-000",
    mapAddress:
      "Rua das Mangueiras, 88, Jardim Primavera, Contagem - MG, Brasil",
    imageUrls: beforeImageSets[1],
    resolutionComment:
      "As mudas foram adotadas por turmas da escola municipal, com cronograma de irrigação colaborativa e placas educativas instaladas na área.",
    resolutionImageUrls: afterImageSets[1],
  },
  {
    title: "Campanha solidária de agasalhos",
    description:
      "Campanha de arrecadação e distribuição de agasalhos com pontos de coleta em comércios de bairro e apoio de voluntários locais.",
    neighborhood: "Nova Esperança",
    street: "Avenida Solidária, 54",
    cep: "32600-000",
    mapAddress:
      "Avenida Solidária, 54, Nova Esperança, Betim - MG, Brasil",
    imageUrls: beforeImageSets[2],
    resolutionComment:
      "A ação arrecadou peças de inverno, organizou triagem por faixa etária e reforçou a rede local de apoio a famílias em vulnerabilidade.",
    resolutionImageUrls: afterImageSets[2],
  },
  {
    title: "Mapeamento colaborativo de acessibilidade",
    description:
      "Mapeamento colaborativo de pontos com acessibilidade comprometida para encaminhamento formal ao poder público e acompanhamento cidadão.",
    neighborhood: "Vila Aurora",
    street: "Rua do Fórum, 17",
    cep: "32604-115",
    mapAddress: "Rua do Fórum, 17, Vila Aurora, Betim - MG, Brasil",
    imageUrls: beforeImageSets[3],
    resolutionComment:
      "O levantamento gerou relatório com fotos, prioridades e sugestões de adequação para rampas, travessias e acessos a equipamentos públicos.",
    resolutionImageUrls: afterImageSets[3],
  },
  {
    title: "Oficina cidadã de reciclagem",
    description:
      "Oficina cidadã sobre reciclagem, uso consciente dos espaços públicos e preservação de áreas verdes com participação de lideranças comunitárias.",
    neighborhood: "Parque dos Girassóis",
    street: "Rua dos Ipês, 230",
    cep: "33400-000",
    mapAddress:
      "Rua dos Ipês, 230, Parque dos Girassóis, Lagoa Santa - MG, Brasil",
    imageUrls: beforeImageSets[4],
    resolutionComment:
      "A oficina formou multiplicadores locais, distribuiu material educativo e abriu calendário mensal de encontros para continuidade das ações.",
    resolutionImageUrls: afterImageSets[4],
  },
  {
    title: "Travessia segura em frente à escola",
    description:
      "Apoio voluntário à travessia segura em frente à escola municipal com orientação a motoristas e reforço de sinalização comunitária.",
    neighborhood: "Residencial do Lago",
    street: "Rua da Escola, 312",
    cep: "34000-000",
    mapAddress:
      "Rua da Escola, 312, Residencial do Lago, Nova Lima - MG, Brasil",
    imageUrls: beforeImageSets[5],
    resolutionComment:
      "A mobilização reduziu conflitos no horário de saída, fortaleceu a participação das famílias e gerou proposta de melhoria entregue à administração local.",
    resolutionImageUrls: afterImageSets[5],
  },
];

export const formatCitizenLegalDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export const buildCitizenLegalHref = () => "/cidadao-legal";

export const buildCitizenLegalCitizenActionsHref = (citizenId: string) =>
  `/cidadao-legal/${citizenId}`;

export const buildCitizenLegalActionDetailsHref = (
  citizenId: string,
  actionId: string
) => `/cidadao-legal/${citizenId}/acoes/${actionId}`;

export const buildCitizenLegalActionStatusLabel = (
  status: SolicitationStatus
) => {
  if (status === "resolved") return "Concluída";
  if (status === "in_progress") return "Em andamento";
  return "Planejada";
};

export const citizenLegalActions: CitizenLegalActionRecord[] =
  citizenLegalRanking.flatMap((citizen, citizenIndex) =>
    actionTemplates.map((template, actionIndex) => {
      const baseDate = new Date(2026, (citizenIndex + actionIndex) % 4, 2 + actionIndex * 3);
      const status = actionStatusCycle[actionIndex % actionStatusCycle.length];
      const createdAt = baseDate.toISOString();
      const resolvedAt =
        status === "resolved"
          ? new Date(baseDate.getTime() + 1000 * 60 * 60 * 24 * 4).toISOString()
          : undefined;

      return {
        id: `${citizen.id}-acao-${actionIndex + 1}`,
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        protocolNumber: `ACL-${String(citizen.position).padStart(2, "0")}${String(
          actionIndex + 1
        ).padStart(2, "0")}`,
        requestingUserId: citizen.id,
        requestingUserName: citizen.fullName,
        createdAt,
        resolvedAt,
        status,
        ...template,
      };
    })
  );

export const getCitizenById = (citizenId: string) =>
  citizenLegalRanking.find((item) => item.id === citizenId);

export const getCitizenActionsByCitizenId = (citizenId: string) =>
  citizenLegalActions.filter((item) => item.citizenId === citizenId);

export const getCitizenLegalActionByIds = (
  citizenId: string,
  actionId: string
) =>
  citizenLegalActions.find(
    (item) => item.citizenId === citizenId && item.id === actionId
  );
