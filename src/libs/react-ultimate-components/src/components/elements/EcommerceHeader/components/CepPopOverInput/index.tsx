"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import MaskedTextInput from "../MaskedInput";
import { brazilianCepMask }
 from "../../../../../utils/masks";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface CepPopOverInputProps {
  shouldBeShown: boolean;
  align: "left" | "right";
  label?: string;
  buttonLabel?: string;
  className?: string;
  onSearchCep?: (cep: string) => void;
}

export default function CepPopOverInput({
  shouldBeShown,
  align,
  label,
  buttonLabel,
  className,
  onSearchCep,
}: CepPopOverInputProps) {
  const [cep, setCep] = useState("");
  const [popOverVisible, setPopOverVisible] = useState(shouldBeShown);

  useEffect(() => {
    setPopOverVisible(shouldBeShown);
  }, [shouldBeShown]);

  useClosePopOverWhenClickingOutside(popOverVisible, setPopOverVisible);

  function useClosePopOverWhenClickingOutside(
    isVisible: boolean,
    setIsVisible: (visible: boolean) => void
  ) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (isVisible && !target.closest(".cep-popover")) {
          setIsVisible(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isVisible, setIsVisible]);
  }

  if (!popOverVisible) {
    return null;
  }

  return (
    <div
      className={clsx(
        "cep-popover min-w-[240px] z-80 flex flex-col items-center p-4 rounded-sm bg-background border border-foreground/10  duration-200 ease-in-out gap-2",
        `absolute top-15 ${align === "right" ? "right-0" : "left-0"}`,
        className
      )}
    >
      <MaskedTextInput
        mask={brazilianCepMask}
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        label={label ?? "Digite seu CEP"}
        placeholder="00000-000"
      />

      <button
        type="button"
        onClick={() => onSearchCep?.(cep)}
        className="w-full h-10 flex items-center justify-center px-1 sm:px-2 rounded-md text-xs font-medium text-primary hover:bg-primary/10border border-foreground/20 bg-foreground/10"
        disabled={cep.length < 9}
      >
        {buttonLabel ?? "Buscar"}
      </button>
    </div>
  );
}

