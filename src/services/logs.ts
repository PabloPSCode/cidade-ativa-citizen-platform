import api, { type PaginatedResult, type PaginationParams } from './http';

export interface LogResponseDTO {
  id: string;
  userId: string;
  userName: string;
  email: string;
  activityDescription: string;
  createdAt: Date;
}

export interface CreateLogDTO {
  userId: string;
  userName: string;
  email: string;
  activityDescription: string;
}

export interface UpdateLogDTO {
  userId?: string;
  userName?: string;
  email?: string;
  activityDescription?: string;
}

export async function createLog(data: CreateLogDTO): Promise<LogResponseDTO> {
  return api.post('/logs', data);
}

export async function listLogs(
  params?: PaginationParams,
): Promise<PaginatedResult<LogResponseDTO>> {
  return api.get('/logs', { params: { page: 1, perPage: 10, ...params } });
}

export async function getLogById(id: string): Promise<LogResponseDTO> {
  return api.get(`/logs/${id}`);
}

export async function updateLog(id: string, data: UpdateLogDTO): Promise<LogResponseDTO> {
  return api.put(`/logs/${id}`, data);
}

export async function deleteLog(id: string): Promise<void> {
  return api.delete(`/logs/${id}`);
}
