"use client";

import { CalendarDotsIcon, MedalIcon, ScalesIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { Button } from "../../libs/react-ultimate-components/src";
import { formatCitizenLegalDate } from "../constants/citizen-legal";

export interface RankingCardProps {
  position: number;
  fullName: string;
  points: number;
  createdAt: string;
  className?: string;
  actionsLabel?: string;
}

const positionStyles: Record<
  number,
  {
    medalClassName: string;
    cardClassName: string;
    avatarClassName: string;
  }
> = {
  1: {
    medalClassName: "bg-amber-400 text-zinc-950",
    cardClassName:
      "border-amber-300/40 shadow-[0_28px_64px_-48px_rgba(245,158,11,0.55)]",
    avatarClassName:
      "from-fuchsia-300 via-pink-300 to-rose-300 text-white",
  },
  2: {
    medalClassName: "bg-slate-200 text-zinc-900",
    cardClassName:
      "border-slate-300/50 shadow-[0_28px_64px_-48px_rgba(148,163,184,0.45)]",
    avatarClassName:
      "from-fuchsia-300 via-pink-300 to-rose-300 text-white",
  },
  3: {
    medalClassName: "bg-orange-300 text-zinc-950",
    cardClassName:
      "border-orange-300/40 shadow-[0_28px_64px_-48px_rgba(251,146,60,0.5)]",
    avatarClassName:
      "from-fuchsia-300 via-pink-300 to-rose-300 text-white",
  },
};

const fallbackStyle = {
  medalClassName: "",
  cardClassName: "border-border-card/70",
  avatarClassName: "from-fuchsia-300 via-pink-300 to-rose-300 text-white",
};

const getInitial = (fullName: string) => fullName.trim().charAt(0).toUpperCase();

export default function RankingCard({
  position,
  fullName,
  points,
  createdAt,
  className,
  actionsLabel = "Ver ações",
}: RankingCardProps) {
  const accentStyle = positionStyles[position] ?? fallbackStyle;
  const showMedal = position <= 3;

  return (
    <article
      className={clsx(
        "ranking-card Container rounded-[2rem] border bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-5 xl:p-6",
        accentStyle.cardClassName,
        className
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4 sm:gap-5 lg:min-w-[13rem]">
          <div className="flex min-w-[6rem] items-center gap-3 sm:min-w-[7rem]">
            <span className="text-4xl font-black tracking-tight text-foreground/85 sm:text-5xl">
              {position}
            </span>
            {showMedal ? (
              <span
                className={clsx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full shadow-sm",
                  accentStyle.medalClassName
                )}
              >
                <MedalIcon size={22} weight="fill" />
              </span>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground/45 dark:bg-white/5">
                <ScalesIcon size={18} weight="fill" />
              </span>
            )}
          </div>

          <div
            className={clsx(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-5xl font-light shadow-inner sm:h-24 sm:w-24 sm:text-6xl",
              accentStyle.avatarClassName
            )}
            aria-hidden="true"
          >
            {getInitial(fullName)}
          </div>
        </div>

        <div className="grid flex-1 gap-4 md:grid-cols-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Nome
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
              {fullName}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Pontos Cidadão Legal
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground sm:text-base">
              {points}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-background/80 p-4 dark:bg-white/[0.03]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Data de cadastro
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
              <CalendarDotsIcon
                size={18}
                weight="fill"
                className="shrink-0 text-foreground/55"
              />
              <span>{formatCitizenLegalDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="lg:ml-auto lg:min-w-[9.5rem]">
          <Button
            type="button"
            label={actionsLabel}
            title="Detalhamento das ações em breve"
            className="w-full justify-center rounded-2xl px-6 py-3 text-sm font-bold !bg-emerald-600 hover:!bg-emerald-500"
          />
        </div>
      </div>
    </article>
  );
}
