import api, { type PaginatedResult, type PaginationParams } from './http';

export interface VoteResponseDTO {
  id: string;
  title: string;
  description: string;
  pollId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateVoteDTO {
  title: string;
  description: string;
  pollId: string;
  userId: string;
}

export interface ListVotesParams extends PaginationParams {
  pollId?: string;
  userId?: string;
}

export async function createVote(data: CreateVoteDTO): Promise<VoteResponseDTO> {
  return api.post('/votes', data);
}

export async function listVotes(
  params?: ListVotesParams,
): Promise<PaginatedResult<VoteResponseDTO>> {
  return api.get('/votes', { params: { page: 1, perPage: 10, ...params } });
}
