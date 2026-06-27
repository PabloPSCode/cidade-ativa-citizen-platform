"use client";

import { ChartBarIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  PaginationList,
  Section,
  SelectInput,
  TextInput,
} from "../../libs/react-ultimate-components/src";
import { listPolls, type PollResponseDTO } from "../../services/polls";
import { getPollVoteSummary } from "../../services/poll-results";
import { listVotes } from "../../services/votes";
import PollCard from "../components/PollCard";
import PollResultsModal from "../components/PollResultsModal";
import VoteModal from "../components/VoteModal";
import { pollStatusOptions, type PollStatus } from "../constants/polls";
import { useAuth } from "../hooks/useAuth";

const ITEMS_PER_PAGE = 5;

const statusFilterOptions = [
  { label: "Todos os status", value: "all" },
  ...pollStatusOptions.map((option) => ({
    label: option.label,
    value: option.value,
  })),
];

export default function PollsPage() {
  const { authenticatedUser } = useAuth();
  const [polls, setPolls] = useState<PollResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PollStatus | "all">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [votedPollIds, setVotedPollIds] = useState<Set<string>>(new Set());
  const [votingPoll, setVotingPoll] = useState<PollResponseDTO | null>(null);
  const [resultsPoll, setResultsPoll] = useState<PollResponseDTO | null>(null);

  const currentUserId = authenticatedUser?.userId;

  useEffect(() => {
    let cancelled = false;

    async function fetchPolls() {
      setIsLoading(true);
      try {
        const result = await listPolls();
        if (!cancelled) setPolls(result.data);
      } catch {
        if (!cancelled) setPolls([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPolls();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchVotedPolls() {
      if (!currentUserId) {
        setVotedPollIds(new Set());
        return;
      }
      try {
        const result = await listVotes({ userId: currentUserId, perPage: 100 });
        if (cancelled) return;
        setVotedPollIds(new Set(result.data.map((vote) => vote.pollId)));
      } catch {
        if (!cancelled) setVotedPollIds(new Set());
      }
    }

    fetchVotedPolls();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (polls.length === 0) return;

    let cancelled = false;

    async function fetchVoteCounts() {
      try {
        const summaries = await Promise.all(
          polls.map((poll) =>
            getPollVoteSummary(poll.id).then((summary) => ({
              pollId: poll.id,
              total: summary.total,
            }))
          )
        );
        if (cancelled) return;

        const counts: Record<string, number> = {};
        summaries.forEach(({ pollId, total }) => {
          counts[pollId] = total;
        });
        setVoteCounts(counts);
      } catch {
        if (!cancelled) setVoteCounts({});
      }
    }

    fetchVoteCounts();
    return () => {
      cancelled = true;
    };
  }, [polls]);

  const handleVoted = (pollId: string) => {
    setVotedPollIds((current) => new Set(current).add(pollId));
    setVoteCounts((current) => ({
      ...current,
      [pollId]: (current[pollId] ?? 0) + 1,
    }));
  };

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredPolls = useMemo(
    () =>
      polls.filter((poll) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [poll.title, poll.description].some((value) =>
            value.toLowerCase().includes(normalizedSearch)
          );
        const matchesStatus =
          selectedStatus === "all" || poll.status === selectedStatus;
        return matchesSearch && matchesStatus;
      }),
    [polls, normalizedSearch, selectedStatus]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPolls.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const selectedStatusOption =
    statusFilterOptions.find((option) => option.value === selectedStatus) ??
    null;

  const hasActiveFilters =
    search.trim().length > 0 || selectedStatus !== "all";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section
        size="middle"
        sectionClassName="items-stretch gap-8 !px-4 !py-8 sm:!px-6 lg:!px-8 lg:!py-10"
      >
        <section className="flex flex-col gap-6 rounded-[2rem] border border-border-card/70 bg-white/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:bg-bg-card/80 sm:p-7">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 rounded-sm bg-background px-4 py-2 text-sm font-medium text-foreground/80">
              <ChartBarIcon size={22} weight="fill" />
              <span>Enquetes</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Enquetes da cidade
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-foreground/70 sm:text-base">
                Acompanhe as enquetes promovidas pela prefeitura e participe das
                decisões que transformam a sua cidade.
              </p>
            </div>

            {!isLoading && (
              <p className="text-sm font-medium text-foreground/70 sm:text-base">
                <span className="font-bold text-foreground">
                  {polls.length} enquetes
                </span>{" "}
                disponíveis no momento.
              </p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <TextInput
              id="polls-search"
              label="Buscar"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque por título ou descrição"
              containerClassName="w-full"
            />

            <SelectInput
              label="Status"
              options={statusFilterOptions}
              value={selectedStatusOption}
              onSelectOption={(option) =>
                setSelectedStatus((option?.value ?? "all") as PollStatus | "all")
              }
              placeholder="Todos os status"
              isSearchable={false}
              containerClassName="w-full"
            />
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Listagem de enquetes
            </h2>
            <p className="text-sm text-foreground/65">
              {isLoading
                ? "Carregando enquetes..."
                : hasActiveFilters
                ? `Exibindo ${filteredPolls.length} de ${polls.length} enquetes.`
                : `Exibindo ${filteredPolls.length} enquetes.`}
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-border-card bg-bg-card p-10 text-center shadow-sm">
              <p className="text-sm text-foreground/65">
                Carregando enquetes...
              </p>
            </div>
          ) : filteredPolls.length > 0 ? (
            <PaginationList
              page={page}
              itemsPerPage={ITEMS_PER_PAGE}
              pagesToShow={4}
              onPageChange={setPage}
              containerClassName="w-full"
              listClassName="gap-5"
              navigationClassName="rounded-[1.75rem] border border-border-card/70 bg-bg-card px-4 py-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)] sm:px-5"
              previousButtonLabel="Anterior"
              nextButtonLabel="Próximo"
              previousButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              nextButtonClassName="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5"
              pageNumberClassName="rounded-sm text-sm font-medium"
              activePageNumberClassName="border border-foreground/15 bg-foreground !text-background"
              inactivePageNumberClassName="border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5"
              showItemsPerPageSelect={false}
              showFirstLastButtons={false}
            >
              {filteredPolls.map((poll) => {
                const hasVoted = votedPollIds.has(poll.id);
                return (
                  <PollCard
                    key={poll.id}
                    title={poll.title}
                    description={poll.description}
                    status={poll.status}
                    pollCoverUrl={poll.pollCoverUrl}
                    startedAt={poll.startedAt}
                    finishedAt={poll.finishedAt}
                    votesCount={voteCounts[poll.id] ?? 0}
                    hasVoted={hasVoted}
                    onVote={
                      currentUserId && !hasVoted
                        ? () => setVotingPoll(poll)
                        : undefined
                    }
                    onSeeResults={() => setResultsPoll(poll)}
                  />
                );
              })}
            </PaginationList>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border-card bg-bg-card p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold">Nenhuma enquete encontrada</h3>
              <p className="mt-2 text-sm text-foreground/65">
                {hasActiveFilters
                  ? "Ajuste sua busca ou os filtros para visualizar as enquetes."
                  : "No momento não há enquetes disponíveis. Volte em breve."}
              </p>
            </div>
          )}
        </section>
      </Section>

      {votingPoll && currentUserId ? (
        <VoteModal
          poll={votingPoll}
          userId={currentUserId}
          onClose={() => setVotingPoll(null)}
          onVoted={handleVoted}
        />
      ) : null}

      {resultsPoll ? (
        <PollResultsModal
          poll={resultsPoll}
          onClose={() => setResultsPoll(null)}
        />
      ) : null}
    </main>
  );
}
