"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

/** Componente de conteúdo customizável. */
export type DealRibbonContentComponent<P = unknown> = React.ComponentType<P>;

export interface DealRibbonProps<CProps = unknown> {
  /** Texto curto da faixa (ex.: “Oferta por tempo limitado — Aproveite”). */
  text?: string;
  /** HTML curto (sanitizado pela sua aplicação). Use **com cautela**. */
  html?: string;
  /** Ícone opcional renderizado ao lado do conteúdo. */
  Icon?: React.ComponentType<{ className?: string; size?: number | string }>;
  /** Componente React para renderizar conteúdo customizado (ex.: timer, CTA mini). */
  Content?: DealRibbonContentComponent<CProps>;
  /** Propriedades repassadas ao componente `Content`. */
  contentProps?: CProps;

  /** Velocidade do “marquee” (ms para 1 ciclo). Padrão: 20000. */
  speedMs?: number;
  /** Pausar a animação ao passar o mouse. Padrão: true. */
  pauseOnHover?: boolean;

  /** Fixar no topo (position: sticky). */
  stickyTop?: boolean;
  /** Fixar no rodapé (position: sticky bottom). */
  stickyBottom?: boolean;

  /** Classes extras para customização. */
  className?: string;
}

/**
 * DealRibbon — Faixa promocional para landing pages (mercado brasileiro)
 *
 * Ajustes:
 * 1) Calcula dinamicamente a QUANTIDADE de itens para nunca haver “buracos”.
 *    - Garante largura >= 2x a largura do container (para um loop 0→-50% perfeito).
 *    - Usa também `speedMs` como piso para itens (faixas mais lentas exibem mais repetições).
 * 2) Corrige a largura com `calc(100vw - 64px)` (antes Tailwind não resolvia a expressão).
 */
export default function DealRibbon({
  text,
  html,
  Icon,
  Content,
  contentProps,
  speedMs = 20000,
  pauseOnHover = true,
  stickyTop,
  stickyBottom,
  className,
}: DealRibbonProps<unknown>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [itemCount, setItemCount] = useState<number>(24); // valor inicial seguro

  // Conteúdo prioritário: Content > html > image > text
  const ContentComp = Content as React.ComponentType<any> | undefined;

  const renderInner = () => (
    <div className="flex items-center gap-2 whitespace-nowrap pr-8 py-2">
      {Icon && (
        <span className="inline-flex">
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </span>
      )}

      {ContentComp ? (
        <ContentComp {...(contentProps ?? {})} />
      ) : html ? (
        <span
          className="text-sm md:text-base"
          // Garanta sanitização do HTML na sua aplicação antes de passar aqui.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <span className="text-sm md:text-base">
          {text ?? "Oferta por tempo limitado — Aproveite"}
        </span>
      )}
    </div>
  );

  // Mede o item e calcula a quantidade necessária
  useLayoutEffect(() => {
    const recalc = () => {
      const container = containerRef.current;
      const sample = measureRef.current;
      if (!container || !sample) return;

      const containerWidth = container.getBoundingClientRect().width;
      const unitWidth = sample.getBoundingClientRect().width || 1;

      // Precisamos de largura >= 2x container para a animação 0→-50% sem “buracos”.
      const minByWidth = Math.ceil((containerWidth * 2) / unitWidth);

      // Relaciona quantidade a speedMs: faixas mais lentas mostram mais itens
      // (garante variedade visual e cobre casos onde o texto é muito curto).
      const minBySpeed = Math.max(6, Math.ceil(speedMs / 4000));

      setItemCount(Math.max(minByWidth, minBySpeed));
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [speedMs, text, html, Icon, ContentComp]);

  // Gera a sequência e duplica para um loop perfeito (0→-50%).
  const items = useMemo(
    () => Array.from({ length: itemCount }, (_, i) => i),
    [itemCount]
  );

  return (
    <section
      role="region"
      aria-live="polite"
      className={clsx(
        "relative w-full overflow-hidden",
        stickyTop && "sticky top-0 z-50",
        stickyBottom && "sticky bottom-0 z-50",
        "bg-primary-500 text-white",
        className
      )}
      style={
        {
          ["--deal-speed" as any]: `${speedMs}ms`,
        } as React.CSSProperties
      }
    >
      {/* Largura correta com calc() */}
      <div
        ref={containerRef}
        className="overflow-hidden mx-auto"
        style={{ width: "calc(100vw - 40px)" }}
      >
        <div
          className={clsx(
            "group",
            pauseOnHover &&
              "[&:hover_.deal-track]:[animation-play-state:paused]"
          )}
        >
          <div
            className={clsx(
              "deal-track flex w-max items-center gap-6 py-2 md:py-2.5 px-4 md:px-6",
              "animate-[deal-marquee_var(--deal-speed)_linear_infinite]"
            )}
          >
            {/* Sequência A */}
            {items.map((i) => (
              <div key={`a-${i}`} className="flex items-center gap-3">
                {renderInner()}
                <span className="text-white/80 select-none">•</span>
              </div>
            ))}
            {/* Sequência B (duplicada) */}
            {items.map((i) => (
              <div key={`b-${i}`} className="flex items-center gap-3">
                {renderInner()}
                <span className="text-white/80 select-none">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medidor invisível do “item unitário” */}
      <div
        ref={measureRef}
        className="absolute -left-[9999px] top-0 pointer-events-none opacity-0"
        aria-hidden
      >
        <div className="flex items-center gap-3">
          {renderInner()}
          <span className="select-none">•</span>
        </div>
      </div>

      {/* CSS escopado: marquee + reduced motion */}
      <style>{`
        @keyframes deal-marquee {
          from { transform: translateX(0%); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .deal-track { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

