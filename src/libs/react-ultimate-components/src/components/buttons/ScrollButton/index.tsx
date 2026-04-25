"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { CaretDoubleUpIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import React, { useCallback, useEffect, useState, type ReactNode } from "react";

interface ScrollButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Variante de estilo. */
  variant?: "filled" | "outlined";
  /** Ícone customizado. */
  icon?: ReactNode;
  /** Mostrar o botão após X pixels de rolagem. */
  showAfterPx?: number;
  /** Rolagem suave ao topo. */
  smooth?: boolean;
  /** Handler opcional ao clicar (executa depois do scroll). */
  onClick?: () => void;
  /** Classes adicionais. */
  className?: string;
}

/**
 * ScrollButton
 * - Fica fixo em bottom-4 right-4 em relação à janela (não ao pai).
 * - Só aparece após rolar a página (showAfterPx).
 * - Ao clicar, rola para o topo.
 */
export default function ScrollButton({
  variant = "filled",
  icon,
  showAfterPx = 200,
  smooth = true,
  disabled,
  className,
  onClick,
  ...props
} : ScrollButtonProps) {
  const [visible, setVisible] = useState(false);

  // Atualiza visibilidade conforme rolagem
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      setVisible(window.scrollY > showAfterPx);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterPx]);

  const handleGoTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    onClick?.();
  }, [onClick, smooth]);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      {...props}
      className={clsx(
        "fixed bottom-4 right-4",
        "flex items-center justify-center w-fit px-3 py-2 sm:px-4 sm:py-3 rounded-md shadow-md",
        " focus:outline-none focus:ring-2 focus:ring-primary/40",
        disabled && "opacity-60 cursor-not-allowed",
        variant === "filled"
          ? "bg-primary-500 text-white hover:bg-primary-600"
          : "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
        className
      )}
      disabled={disabled}
      onClick={handleGoTop}
    >
      <div className="flex items-center gap-3">
        {icon || <CaretDoubleUpIcon size={20} />}
      </div>
    </button>
  );
}

