import api, { type PaginatedResult, type PaginationParams } from './http';

export interface VoteOptionResponseDTO {
  id: string;
  optionText: string;
  voteId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateVoteOptionDTO {
  optionText: string;
  voteId: string;
}

export interface ListVoteOptionsParams extends PaginationParams {
  voteId?: string;
}

export async function createVoteOption(
  data: CreateVoteOptionDTO,
): Promise<VoteOptionResponseDTO> {
  return api.post('/vote-options', data);
}

export async function listVoteOptions(
  params?: ListVoteOptionsParams,
): Promise<PaginatedResult<VoteOptionResponseDTO>> {
  return api.get('/vote-options', { params: { page: 1, perPage: 10, ...params } });
}
