import api, { type PaginatedResult, type PaginationParams } from './http';

export interface CityResponseDTO {
  id: string;
  name: string;
  /** Sigla da UF (ex.: "MG"). Vem direto da rota `GET /cities`. */
  uf: string;
  createdAt: Date;
}

export interface CreateCityDTO {
  name: string;
  uf: string;
}

export interface UpdateCityDTO {
  name?: string;
  uf?: string;
}

export type ListCitiesParams = PaginationParams;

export async function createCity(data: CreateCityDTO): Promise<CityResponseDTO> {
  return api.post('/cities', data);
}

export async function listCities(
  params?: ListCitiesParams,
): Promise<PaginatedResult<CityResponseDTO>> {
  return api.get('/cities', { params: { page: 1, perPage: 10, ...params } });
}

export async function getCityById(id: string): Promise<CityResponseDTO> {
  return api.get(`/cities/${id}`);
}

export async function updateCity(
  id: string,
  data: UpdateCityDTO,
): Promise<CityResponseDTO> {
  return api.put(`/cities/${id}`, data);
}

export async function deleteCity(id: string): Promise<void> {
  return api.delete(`/cities/${id}`);
}
