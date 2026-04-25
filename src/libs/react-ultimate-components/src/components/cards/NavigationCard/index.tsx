"use client";

import clsx from "clsx";

export interface NavigationCardProps {
  onAdvance: () => void;
  onBack: () => void;
  advanceLabel?: string;
  backLabel?: string;
  advanceIcon?: React.ReactNode;
  backIcon?: React.ReactNode;
  advanceDisabled?: boolean;
  backDisabled?: boolean;
  className?: string;
  advanceButtonClassName?: string;
  backButtonClassName?: string;
}

export default function NavigationCard({
  onAdvance,
  onBack,
  advanceLabel,
  backLabel,
  advanceIcon,
  backIcon,
  advanceDisabled,
  backDisabled,
  className,
  advanceButtonClassName,
  backButtonClassName,
}: NavigationCardProps) {
  return (
    <div
      className={clsx(
        "w-full flex justify-between p-4 rounded-md border border-border-card bg-bg-card shadow-sm",
        className
      )}
    >
      <button
        onClick={onBack}
        disabled={backDisabled}
        className={clsx(
          "flex items-center gap-2  px-4 py-2 bg-transparent text-foreground text-xs sm:text-sm rounded border border-foreground",
          backButtonClassName
        )}
      >
        {backIcon} {backLabel ?? "Voltar"}
      </button>
      <button
        onClick={onAdvance}
        disabled={advanceDisabled}
        className={clsx(
          "flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-xs sm:text-sm rounded disabled:cursor-not-allowed disabled:opacity-60",
          advanceButtonClassName
        )}
      >
        {advanceIcon} {advanceLabel ?? "Continuar"}
      </button>
    </div>
  );
}

