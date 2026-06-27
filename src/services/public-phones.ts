import api, { authHeaders, type PaginatedResult, type PaginationParams } from './http';

export interface PublicPhoneResponseDTO {
  id: string;
  phone: string;
  institutionName: string;
}

export interface CreatePublicPhoneDTO {
  phone: string;
}

export interface UpdatePublicPhoneDTO {
  phone?: string;
}

export async function createPublicPhone(
  data: CreatePublicPhoneDTO,
): Promise<PublicPhoneResponseDTO> {
  return api.post('/public-phones', data);
}

export async function listPublicPhones(
  params?: PaginationParams,
  token?: string,
): Promise<PaginatedResult<PublicPhoneResponseDTO>> {
  return api.get('/public-phones', {
    params: { page: 1, perPage: 10, ...params },
    headers: authHeaders(token),
  });
}

export async function getPublicPhoneById(id: string): Promise<PublicPhoneResponseDTO> {
  return api.get(`/public-phones/${id}`);
}

export async function updatePublicPhone(
  id: string,
  data: UpdatePublicPhoneDTO,
): Promise<PublicPhoneResponseDTO> {
  return api.put(`/public-phones/${id}`, data);
}

export async function deletePublicPhone(id: string): Promise<void> {
  return api.delete(`/public-phones/${id}`);
}
