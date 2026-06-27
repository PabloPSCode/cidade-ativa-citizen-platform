import api, { authHeaders, type PaginatedResult, type PaginationParams } from './http';

export interface SolicitationTypeResponseDTO {
  id: string;
  description: string;
  points: number;
}

export interface CreateSolicitationTypeDTO {
  description: string;
  points: number;
}

export interface UpdateSolicitationTypeDTO {
  description?: string;
  points?: number;
}

export async function createSolicitationType(
  data: CreateSolicitationTypeDTO,
): Promise<SolicitationTypeResponseDTO> {
  return api.post('/solicitation-types', data);
}

export async function listSolicitationTypes(
  params?: PaginationParams,
  token?: string,
): Promise<PaginatedResult<SolicitationTypeResponseDTO>> {
  return api.get('/solicitation-types', {
    params: { page: 1, perPage: 10, ...params },
    headers: authHeaders(token),
  });
}

export async function getSolicitationTypeById(
  id: string,
): Promise<SolicitationTypeResponseDTO> {
  return api.get(`/solicitation-types/${id}`);
}

export async function updateSolicitationType(
  id: string,
  data: UpdateSolicitationTypeDTO,
): Promise<SolicitationTypeResponseDTO> {
  return api.put(`/solicitation-types/${id}`, data);
}

export async function deleteSolicitationType(id: string): Promise<void> {
  return api.delete(`/solicitation-types/${id}`);
}
