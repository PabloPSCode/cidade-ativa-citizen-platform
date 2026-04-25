"use client";
import clsx from "clsx";
import { Tooltip as TooltipComponent } from "react-tooltip";

interface TooltipProps {
  /** ID do tooltip (deve ser o mesmo usado no `data-tooltip-id` do elemento alvo). */
  id: string;
  /** Posição do tooltip em relação ao elemento alvo. */
  place?: "top" | "bottom" | "left" | "right";
  /** Classes extras para customização. */
  className?: string;
}

export default function Tooltip({ id, place = "top", className }: TooltipProps) {
  return (
    <TooltipComponent
      id={id}
      place={place}
      positionStrategy="fixed"
      offset={8}
      className={clsx(
        "!bg-foreground !text-background !px-2 !py-1 !text-xs !sm:text-sm",
        "!rounded-md !shadow-lg !border !border-border-card/40",
        "!opacity-100",
        className
      )}
      style={{ zIndex: 9999 }}
    />
  );
}

