import api, { authHeaders, type PaginatedResult, type PaginationParams } from './http';

export interface CoolActionResponseDTO {
  id: string;
  title: string;
  category: string;
  points: number;
  solicitationTypeId: string;
  solicitationId: string;
  createdAt: Date;
}

export interface CreateCoolActionDTO {
  solicitationTypeId: string;
  solicitationId: string;
}

export interface UpdateCoolActionDTO {
  solicitationTypeId?: string;
}

export async function createCoolAction(
  data: CreateCoolActionDTO,
): Promise<CoolActionResponseDTO> {
  return api.post('/cool-actions', data);
}

export async function listCoolActions(
  params?: PaginationParams,
  token?: string,
): Promise<PaginatedResult<CoolActionResponseDTO>> {
  return api.get('/cool-actions', {
    params: { page: 1, perPage: 10, ...params },
    headers: authHeaders(token),
  });
}

export async function getCoolActionById(id: string): Promise<CoolActionResponseDTO> {
  return api.get(`/cool-actions/${id}`);
}

export async function updateCoolAction(
  id: string,
  data: UpdateCoolActionDTO,
): Promise<CoolActionResponseDTO> {
  return api.put(`/cool-actions/${id}`, data);
}

export async function deleteCoolAction(id: string): Promise<void> {
  return api.delete(`/cool-actions/${id}`);
}
