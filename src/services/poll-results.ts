import { listVoteOptions } from './vote-options';
import { listVotes } from './votes';

export interface PollOptionCount {
  optionText: string;
  count: number;
}

export interface PollVoteSummary {
  counts: PollOptionCount[];
  total: number;
}

/**
 * Resumo de votos de uma enquete contando apenas cédulas reais.
 *
 * No modelo do back-end, ao criar a enquete é gerado um voto "semente" que
 * carrega TODAS as opções disponíveis. Cada cidadão, ao votar, cria um voto com
 * exatamente UMA opção. Por isso uma cédula real é um voto com exatamente uma
 * opção — o voto semente (com mais de uma opção) é ignorado na contagem, mas
 * ainda define quais opções existem.
 */
export async function getPollVoteSummary(
  pollId: string,
): Promise<PollVoteSummary> {
  const votesResult = await listVotes({ pollId, perPage: 100 });

  const optionLists = await Promise.all(
    votesResult.data.map((vote) =>
      listVoteOptions({ voteId: vote.id, perPage: 100 }),
    ),
  );

  const availableOptions = new Set<string>();
  const ballotTotals = new Map<string, number>();

  optionLists.forEach((result) => {
    result.data.forEach((option) => availableOptions.add(option.optionText));

    // Apenas votos com exatamente uma opção são cédulas reais (exclui o voto
    // semente, que possui todas as opções).
    if (result.data.length !== 1) return;
    const optionText = result.data[0].optionText;
    ballotTotals.set(optionText, (ballotTotals.get(optionText) ?? 0) + 1);
  });

  const counts: PollOptionCount[] = Array.from(availableOptions)
    .map((optionText) => ({
      optionText,
      count: ballotTotals.get(optionText) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  const total = Array.from(ballotTotals.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

  return { counts, total };
}
