"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  ModalsGenericModal as GenericModal,
  RadioGroupInput,
} from "../../libs/react-ultimate-components/src";
import type { PollResponseDTO } from "../../services/polls";
import { createVote } from "../../services/votes";
import { listVotes } from "../../services/votes";
import { createVoteOption, listVoteOptions } from "../../services/vote-options";

interface VoteModalProps {
  poll: PollResponseDTO;
  userId: string;
  onClose: () => void;
  onVoted: (pollId: string) => void;
}

/**
 * Coleta as opções de voto disponíveis de uma enquete a partir dos textos
 * distintos de `optionText` cadastrados nas opções dos votos da enquete.
 */
async function fetchPollOptions(pollId: string): Promise<string[]> {
  const votesResult = await listVotes({ pollId, perPage: 100 });

  const optionLists = await Promise.all(
    votesResult.data.map((vote) =>
      listVoteOptions({ voteId: vote.id, perPage: 100 })
    )
  );

  const distinct = new Set<string>();
  optionLists.forEach((result) =>
    result.data.forEach((option) => distinct.add(option.optionText))
  );

  return Array.from(distinct).sort((a, b) => a.localeCompare(b));
}

export default function VoteModal({
  poll,
  userId,
  onClose,
  onVoted,
}: VoteModalProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setIsLoadingOptions(true);
      setError("");
      try {
        const result = await fetchPollOptions(poll.id);
        if (!cancelled) setOptions(result);
      } catch {
        if (!cancelled) {
          setOptions([]);
          setError("Não foi possível carregar as opções desta enquete.");
        }
      } finally {
        if (!cancelled) setIsLoadingOptions(false);
      }
    }

    loadOptions();
    return () => {
      cancelled = true;
    };
  }, [poll.id]);

  const handleConfirm = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);
    setError("");
    try {
      const vote = await createVote({
        title: poll.title,
        description: poll.description,
        pollId: poll.id,
        userId,
      });
      await createVoteOption({ optionText: selectedOption, voteId: vote.id });
      onVoted(poll.id);
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível registrar o seu voto. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const radioOptions = options.map((optionText) => ({
    label: optionText,
    value: optionText,
  }));

  return (
    <GenericModal
      open
      onClose={onClose}
      title="Votar na enquete"
      description={poll.title}
      size="md"
      className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
      showCancelButton
      showConfirmButton
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isSubmitting ? "Registrando voto..." : "Confirmar voto"}
      confirmButtonDisabled={
        isSubmitting || isLoadingOptions || selectedOption.trim().length === 0
      }
      onConfirm={handleConfirm}
      cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
      confirmButtonClassName="rounded-sm bg-primary-500 px-5 py-3 font-medium text-white hover:bg-primary-600"
    >
      <div className="space-y-4">
        {isLoadingOptions ? (
          <p className="text-sm text-foreground/65">Carregando opções...</p>
        ) : radioOptions.length > 0 ? (
          <RadioGroupInput
            label="Escolha uma opção"
            options={radioOptions}
            onSelectOption={(option) => setSelectedOption(String(option.value))}
            helperText="Seu voto é único e não poderá ser alterado depois."
            containerClassName="w-full"
          />
        ) : (
          <p className="text-sm text-foreground/65">
            Esta enquete ainda não possui opções de voto cadastradas.
          </p>
        )}

        {error ? (
          <div className="flex items-start gap-3 rounded-sm border border-destructive-500/25 bg-destructive-500/10 p-4 text-sm text-foreground/80">
            <WarningCircleIcon
              size={20}
              weight="fill"
              className="mt-0.5 shrink-0 text-destructive-500"
            />
            <p>{error}</p>
          </div>
        ) : null}
      </div>
    </GenericModal>
  );
}
