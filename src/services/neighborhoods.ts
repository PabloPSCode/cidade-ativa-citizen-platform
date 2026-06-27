import api, { type PaginationParams } from './http';

export interface NeighborhoodResponseDTO {
  id: string;
  name: string;
  cityName: string;
}

export interface CreateNeighborhoodDTO {
  name: string;
  cityId: string;
}

export interface UpdateNeighborhoodDTO {
  name?: string;
  cityId?: string;
}

export interface ListNeighborhoodsParams extends PaginationParams {
  /** Filtra os bairros pelo nome da cidade (query `cityName` da rota). */
  cityName?: string;
}

export async function createNeighborhood(
  data: CreateNeighborhoodDTO,
): Promise<NeighborhoodResponseDTO> {
  return api.post('/neighborhoods', data);
}

export async function listNeighborhoods(
  params?: ListNeighborhoodsParams,
): Promise<NeighborhoodResponseDTO[]> {
  return api.get('/neighborhoods', { params });
}

export async function getNeighborhoodById(id: string): Promise<NeighborhoodResponseDTO> {
  return api.get(`/neighborhoods/${id}`);
}

export async function updateNeighborhood(
  id: string,
  data: UpdateNeighborhoodDTO,
): Promise<NeighborhoodResponseDTO> {
  return api.put(`/neighborhoods/${id}`, data);
}

export async function deleteNeighborhood(id: string): Promise<void> {
  return api.delete(`/neighborhoods/${id}`);
}
