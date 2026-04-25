"use client";

import { capitalizeFirst, formatDate } from "../../../utils/format";
import { FlagCheckeredIcon, MapPinIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import React from "react";

type Event = {
  title: string;
  description: string;
  date: string; // ISO / parseable
  icon?: React.ReactNode;
};

export interface TimelineProps {
  /**Array de eventos a serem exibidos*/
  events: Event[];
  /**Inverte a ordem dos eventos (mais recente primeiro)*/
  reverseOrder?: boolean;
  /**Classes adicionais para o container externo*/
  className?: string;
  /**Ícone opcional para o primeiro ponto (substitui o padrão)*/
  firstIcon?: React.ReactNode;
  /**Ícone opcional para o último ponto (substitui o padrão)*/
  lastIcon?: React.ReactNode;
}

/**
 * Timeline — vertical alternando lados (md+), com espinha global e
 * “máscaras” por item para iniciar/encerrar visualmente a linha.
 */
export default function Timeline({
  events,
  reverseOrder = false,
  firstIcon,
  lastIcon,
  className,
}: TimelineProps) {
  if (!events?.length) return null;

  const ordered = reverseOrder ? [...events].reverse() : events;

  const monthYear = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const DOT_GAP = "10px";

  return (
    <section
      aria-label="Linha do tempo"
      className={clsx(
        "relative w-full bg-background text-foreground",
        "py-6 sm:py-8",
        className
      )}
    >
      {/* ===== Espinha global (une os itens através dos gaps) ===== */}
      <div
        aria-hidden
        className={clsx(
          "pointer-events-none absolute top-0 bottom-0 w-px",
          "bg-gradient-to-b from-background via-primary-500 via-10% to-foreground/10",
          "left-8 md:left-1/2 md:-translate-x-1/2"
        )}
      />

      <ol className="mx-auto grid max-w-6xl gap-10 sm:gap-12 md:gap-16 px-4 md:px-6">
        {ordered.map((ev, idx) => {
          const isLeft = idx % 2 === 0;
          const isFirst = idx === 0;
          const isLast = idx === ordered.length - 1;

          // --- NEW: swap start/finish positions when reverseOrder is true ---
          const showStartIcon = reverseOrder ? isLast : isFirst;
          const showFinishIcon = reverseOrder ? isFirst : isLast;
          // ------------------------------------------------------------------

          return (
            <li
              key={`${ev.title}-${idx}`}
              className={clsx(
                "grid items-start",
                "grid-cols-[2rem_1fr]",
                "md:grid-cols-[1fr_2.5rem_1fr]"
              )}
            >
              {/* Coluna ESQUERDA (md+) / Conteúdo (mobile) */}
              <div
                className={clsx(
                  "col-start-2 md:col-start-1",
                  isLeft
                    ? "md:order-1"
                    : "md:order-1 md:opacity-0 md:pointer-events-none"
                )}
              >
                {isLeft && (
                  <EventCard
                    ev={ev}
                    align="right"
                    pillLabel={monthYear(ev.date)}
                  />
                )}
              </div>

              {/* ===== Coluna da ESPINHA / PONTO ===== */}
              <div className="relative col-start-1 md:col-start-2 row-span-1 flex flex-col items-center">
                {/* Máscaras de recorte */}
                {isFirst && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 z-10 w-px bg-none"
                    style={{ top: 0, bottom: `calc(50% + ${DOT_GAP})` }}
                  />
                )}
                {isLast && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 z-10 w-px bg-none"
                    style={{ top: `calc(50% + ${DOT_GAP})`, bottom: 0 }}
                  />
                )}

                {/* Dot central */}
                <span
                  className={clsx(
                    "relative z-20 inline-flex w-6 sm:w-12 h-6 sm:h-12 p-1 items-center justify-center rounded-full shadow-md ring-2",
                    isFirst &&
                      "bg-gradient-to-br from-success-500 to-success-400 ring-success-200/60",
                    isLast &&
                      "bg-gradient-to-br from-success-500 to-success-400 ring-success-200/60",
                    !isFirst &&
                      !isLast &&
                      "bg-gradient-to-br from-primary-500 to-tertiary-500 ring-primary-400/30"
                  )}
                  aria-hidden
                >
                  {showFinishIcon ? (
                    // Finish icon (flag) – unless custom lastIcon was given
                    lastIcon ?? (
                      <FlagCheckeredIcon
                        weight="bold"
                        className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                      />
                    )
                  ) : showStartIcon ? (
                    // Start icon (pin) – unless custom firstIcon was given
                    firstIcon ?? (
                      <MapPinIcon
                        weight="bold"
                        className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                      />
                    )
                  ) : (
                    <span className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-white rounded-full" />
                  )}
                </span>

                {/* Segmentos decorativos curtos */}
                {isFirst && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 z-10 w-px bg-gradient-to-b from-success-500/70 to-transparent"
                    style={{ top: `calc(50% + ${DOT_GAP})`, height: 24 }}
                  />
                )}
                {isLast && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 z-10 w-px bg-gradient-to-t from-foreground/40 to-transparent"
                    style={{ bottom: `calc(50% + ${DOT_GAP})`, height: 24 }}
                  />
                )}
              </div>

              {/* Coluna DIREITA (md+) */}
              <div
                className={clsx(
                  "col-start-2 md:col-start-3",
                  isLeft
                    ? "md:order-3 md:opacity-0 md:pointer-events-none"
                    : "md:order-3"
                )}
              >
                {!isLeft && (
                  <EventCard
                    ev={ev}
                    align="left"
                    pillLabel={monthYear(ev.date)}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}


/* ===================== Subcomponentes ===================== */

function EventCard({
  ev,
  align,
  pillLabel,
}: {
  ev: Event;
  align: "left" | "right";
  pillLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <span
        className={clsx(
          "inline-flex w-max items-center rounded-full px-3 py-1 text-xs sm:text-sm font-medium text-white shadow-md bg-primary-500",
          align === "right" ? "self-end" : "self-start"
        )}
      >
        {capitalizeFirst(pillLabel)}
      </span>

      <article
        className={clsx(
          "rounded-xl border bg-bg-card p-4 sm:p-5 transition-shadow",
          "border-border-card shadow-sm hover:shadow-md"
        )}
      >
        <header className="mb-1 flex items-start gap-2">
          {ev.icon && (
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-foreground/5 text-foreground">
              {ev.icon}
            </span>
          )}
          <h3 className="text-sm sm:text-base md:text-lg font-semibold">
            {ev.title}
          </h3>
        </header>

        <p className="text-xs sm:text-sm text-foreground/80">
          {ev.description}
        </p>

        <footer className="mt-3 text-[11px] sm:text-xs text-foreground/60">
          {formatDate(ev.date)}
        </footer>
      </article>
    </div>
  );
}
