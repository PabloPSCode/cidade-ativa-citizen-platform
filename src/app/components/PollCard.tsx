"use client";

import {
  CalendarDotsIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ListChecksIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { Button } from "../../libs/react-ultimate-components/src";
import { formatPollDate, pollStatusMap, type PollStatus } from "../constants/polls";

export interface PollCardProps {
  title: string;
  description: string;
  status: PollStatus;
  pollCoverUrl?: string;
  createdAt: string | Date;
  finishedAt: string | Date | null;
  votesCount: number;
  hasVoted?: boolean;
  onVote?: () => void;
  onSeeResults?: () => void;
  className?: string;
}

export default function PollCard({
  title,
  description,
  status,
  pollCoverUrl,
  createdAt,
  finishedAt,
  votesCount,
  hasVoted,
  onVote,
  onSeeResults,
  className,
}: PollCardProps) {
  const statusConfig = pollStatusMap[status];
  const isActive = status === "active";

  return (
    <article
      className={clsx(
        "poll-card Container flex w-full max-w-full flex-col gap-4 rounded-[2rem] border border-border-card/70 bg-bg-card p-5 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-6",
        className
      )}
    >
      {pollCoverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pollCoverUrl}
          alt={`Capa da enquete ${title}`}
          className="h-44 w-full rounded-[1.5rem] object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-sm bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/60 dark:bg-white/5">
          <ChartBarIcon size={16} weight="fill" />
          Enquete
        </span>
        <span
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            statusConfig.badgeClassName
          )}
        >
          <span
            className={clsx(
              "h-2.5 w-2.5 rounded-full",
              statusConfig.dotClassName
            )}
          />
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight">{title}</h3>
        <p className="text-sm leading-6 text-foreground/70 sm:text-[0.95rem]">
          {description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Criada em
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
            <CalendarDotsIcon
              size={18}
              weight="fill"
              className="shrink-0 text-foreground/55"
            />
            <span>{formatPollDate(createdAt)}</span>
          </div>
        </div>

        <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            Encerramento
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
            <CalendarDotsIcon
              size={18}
              weight="fill"
              className="shrink-0 text-foreground/55"
            />
            <span>{formatPollDate(finishedAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-card/60 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70">
          <ListChecksIcon size={18} weight="fill" className="text-foreground/55" />
          {votesCount} {votesCount === 1 ? "voto" : "votos"}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {onSeeResults ? (
            <button
              type="button"
              onClick={onSeeResults}
              className="inline-flex items-center gap-2 rounded-sm border border-foreground/10 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/20 hover:bg-foreground/5 dark:bg-white/[0.03]"
            >
              <ChartBarIcon size={18} weight="fill" />
              Ver votação
            </button>
          ) : null}

          {hasVoted ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-success-500/10 px-3 py-1.5 text-sm font-semibold text-success-700 dark:text-success-100">
              <CheckCircleIcon size={18} weight="fill" />
              Você já votou
            </span>
          ) : isActive && onVote ? (
            <Button
              type="button"
              label="Votar"
              onClick={onVote}
              className="rounded-sm px-6 py-2.5 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600"
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
