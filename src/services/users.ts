import api, { type PaginatedResult, type PaginationParams } from './http';

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  isCouncilman: boolean;
  isAdmin: boolean;
  address: string;
  neighborhood: string;
  createdAt: Date;
}

export interface UpdateUserDTO {
  name?: string;
  address?: string;
  neighborhood?: string;
}

export async function listUsers(
  params?: PaginationParams,
): Promise<PaginatedResult<UserResponseDTO>> {
  return api.get('/users', { params: { page: 1, perPage: 10, ...params } });
}

export async function getUserById(id: string): Promise<UserResponseDTO> {
  return api.get(`/users/${id}`);
}

export async function getUserByEmail(email: string): Promise<UserResponseDTO> {
  return api.get(`/users/email/${email}`);
}

export async function updateUser(
  id: string,
  data: UpdateUserDTO,
): Promise<UserResponseDTO> {
  return api.put(`/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<void> {
  return api.delete(`/users/${id}`);
}
