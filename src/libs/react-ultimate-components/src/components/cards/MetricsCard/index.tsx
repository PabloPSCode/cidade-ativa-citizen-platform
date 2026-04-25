"use client";

import clsx from "clsx";
import CountUp from "react-countup";

interface MetricsCardProps {
  /** Título do cartão */
  title: string;
  /** Texto que antecede o título do cartão */
  preTitle?: string;
  /** Valor a ser exibido */
  value: number;
  /** Ícone a ser exibido */
  icon?: React.ReactNode;
  /** Duração em segundos, recomendado valores entre 1 e 10 segudos*/
  countDuration: number;
  /** Classe extra para o contêiner externo */
  className?: string;
  /** Classe extra para o valor */
  valueClassName?: string;
  /** Classe extra para o título */
  titleClassName?: string;
  /** Classe extra para o pre-título */
  preTitleClassName?: string;
}

/**
 * Componente para exibir um cartão de métricas com animação de contagem
 * Mais informações sobre o componente podem ser encontradas na documentação do react-countup.
 */
export default function MetricsCard({
  title,
  preTitle,
  value,
  icon,
  countDuration,
  className,
  valueClassName,
  titleClassName,
  preTitleClassName,
}: MetricsCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-4 border-border-card border bg-bg-card rounded-lg shadow",
        className
      )}
    >
      {preTitle && (
        <h3
          className={clsx(
            "text-md sm:text-lg font-regular text-foreground",
            preTitleClassName
          )}
        >
          {preTitle}
        </h3>
      )}
      <CountUp
        end={value}
        start={value / 2}
        duration={countDuration}
        className={clsx(
          "text-2xl sm:text-4xl font-bold text-foreground",
          valueClassName
        )}
        separator="."
      />
      <h3
        className={clsx(
          "text-sm sm:text-base font-regular my-4 text-center text-foreground",
          titleClassName
        )}
      >
        {title}
      </h3>
      <div className="mb-4 text-2xl">{icon}</div>
    </div>
  );
}

