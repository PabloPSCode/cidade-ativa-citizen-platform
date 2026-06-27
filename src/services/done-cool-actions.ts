import api, { authHeaders, type PaginatedResult, type PaginationParams } from './http';

export interface DoneCoolActionResponseDTO {
  id: string;
  userId: string;
  description: string;
  neighborhood: string;
  street: string;
  actionPhotoURL: string;
  coolActionId: string;
  createdAt: Date;
}

export interface CreateDoneCoolActionDTO {
  userId: string;
  description: string;
  neighborhood: string;
  street: string;
  actionPhotoURL: string;
  coolActionId: string;
}

export interface UpdateDoneCoolActionDTO {
  description?: string;
  neighborhood?: string;
  street?: string;
  actionPhotoURL?: string;
  coolActionId?: string;
}

export interface ListDoneCoolActionsParams extends PaginationParams {
  userId?: string;
}

export interface DoneCoolActionRankingDTO {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  actionsCount: number;
}

export async function createDoneCoolAction(
  data: CreateDoneCoolActionDTO,
): Promise<DoneCoolActionResponseDTO> {
  return api.post('/done-cool-actions', data);
}

export async function listDoneCoolActions(
  params?: ListDoneCoolActionsParams,
): Promise<PaginatedResult<DoneCoolActionResponseDTO>> {
  return api.get('/done-cool-actions', { params: { page: 1, perPage: 10, ...params } });
}

export async function listDoneCoolActionsRanking(
  token?: string,
): Promise<DoneCoolActionRankingDTO[]> {
  return api.get('/done-cool-actions/ranking', { headers: authHeaders(token) });
}

export async function getDoneCoolActionById(
  id: string,
): Promise<DoneCoolActionResponseDTO> {
  return api.get(`/done-cool-actions/${id}`);
}

export async function updateDoneCoolAction(
  id: string,
  data: UpdateDoneCoolActionDTO,
): Promise<DoneCoolActionResponseDTO> {
  return api.put(`/done-cool-actions/${id}`, data);
}

export async function deleteDoneCoolAction(id: string): Promise<void> {
  return api.delete(`/done-cool-actions/${id}`);
}
