"use client";

import { CalendarDotsIcon, MedalIcon, ScalesIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Button } from "../../libs/react-ultimate-components/src";
import { formatCitizenLegalDate } from "../constants/citizen-legal";

export interface RankingCardProps {
  position: number;
  fullName: string;
  points: number;
  createdAt: string;
  className?: string;
  actionsLabel?: string;
  actionsHref?: string;
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
    medalClassName: "bg-primary-500 text-white",
    cardClassName: "border-primary-500/35",
    avatarClassName: "bg-primary-500 text-white",
  },
  2: {
    medalClassName: "bg-foreground/10 text-foreground",
    cardClassName: "border-border-card",
    avatarClassName: "bg-secondary-700 text-white dark:bg-white/15",
  },
  3: {
    medalClassName: "bg-secondary-300 text-secondary-900",
    cardClassName: "border-border-card",
    avatarClassName: "bg-secondary-600 text-white",
  },
};

const fallbackStyle = {
  medalClassName: "",
  cardClassName: "border-border-card/70",
  avatarClassName: "bg-secondary-700 text-white dark:bg-white/15",
};

const getInitial = (fullName: string) => fullName.trim().charAt(0).toUpperCase();

export default function RankingCard({
  position,
  fullName,
  points,
  createdAt,
  className,
  actionsLabel = "Ver ações",
  actionsHref,
}: RankingCardProps) {
  const router = useRouter();
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
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-5xl font-light sm:h-24 sm:w-24 sm:text-6xl",
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
            title="Ver ações cidadãs"
            onClick={actionsHref ? () => router.push(actionsHref) : undefined}
            className="w-full justify-center rounded-sm px-6 py-3 text-sm font-medium !bg-primary-500 !text-white hover:!bg-primary-600"
          />
        </div>
      </div>
    </article>
  );
}
