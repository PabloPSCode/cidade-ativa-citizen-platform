"use client";

import { useEffect, useState } from "react";
import { ModalsGenericModal as GenericModal } from "../../libs/react-ultimate-components/src";
import type { PollResponseDTO } from "../../services/polls";
import {
  getPollVoteSummary,
  type PollOptionCount,
} from "../../services/poll-results";

interface PollResultsModalProps {
  poll: PollResponseDTO;
  onClose: () => void;
}

export default function PollResultsModal({
  poll,
  onClose,
}: PollResultsModalProps) {
  const [counts, setCounts] = useState<PollOptionCount[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      setIsLoading(true);
      try {
        const summary = await getPollVoteSummary(poll.id);
        if (!cancelled) {
          setCounts(summary.counts);
          setTotalVotes(summary.total);
        }
      } catch {
        if (!cancelled) {
          setCounts([]);
          setTotalVotes(0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [poll.id]);

  return (
    <GenericModal
      open
      onClose={onClose}
      title="Resultado da votação"
      description={poll.title}
      size="md"
      className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
      showCancelButton
      cancelButtonLabel="Fechar"
      cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Votos por opção
          </p>
          {!isLoading && (
            <span className="text-xs font-semibold text-foreground/55">
              {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-foreground/65">Carregando votos...</p>
        ) : counts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {counts.map((option) => {
              const percentage =
                totalVotes > 0
                  ? Math.round((option.count / totalVotes) * 100)
                  : 0;
              return (
                <div key={option.optionText} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {option.optionText}
                    </span>
                    <span className="shrink-0 text-foreground/65">
                      {option.count} {option.count === 1 ? "voto" : "votos"} (
                      {percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-foreground/65">
            Esta enquete ainda não possui votos registrados.
          </p>
        )}
      </div>
    </GenericModal>
  );
}
