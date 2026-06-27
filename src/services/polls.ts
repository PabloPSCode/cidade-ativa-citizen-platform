import api, { type PaginatedResult, type PaginationParams } from './http';

export type PollStatus = 'active' | 'inactive' | 'finished';

export interface PollResponseDTO {
  id: string;
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  status: PollStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ListPollsParams extends PaginationParams {
  status?: PollStatus;
}

export async function listPolls(
  params?: ListPollsParams,
): Promise<PaginatedResult<PollResponseDTO>> {
  return api.get('/polls', { params: { page: 1, perPage: 10, ...params } });
}

export async function getPollById(id: string): Promise<PollResponseDTO> {
  return api.get(`/polls/${id}`);
}
