export interface CitizenLegalRankingEntry {
  id: string;
  position: number;
  fullName: string;
  points: number;
  createdAt: string;
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

export const formatCitizenLegalDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export const buildCitizenLegalHref = () => "/cidadao-legal";
