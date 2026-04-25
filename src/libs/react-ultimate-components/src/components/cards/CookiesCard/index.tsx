"use client";
import clsx from "clsx";
import { useState } from "react";

export interface CookiesCardProps {
  title: string;
  /** Descrição do item (opcional). */
  description?: string;
  /** Classes adicionais para customização. */
  containerClassName?: string;
  /** Classes adicionais para o título. */
  titleClassName?: string;
  /** Classes adicionais para a descrição. */
  descriptionClassName?: string;
  /**Título do botão de confirmação */
  buttonTitle?: string;
  /**Ação ao clicar no botão de confirmação */
  onConfirm?: () => void;
  /** Classes adicionais para o botão */
  buttonClassName?: string;
}

export default function CookiesCard({
  title,
  description,
  containerClassName,
  titleClassName,
  descriptionClassName,
  buttonClassName,
  buttonTitle = "Entendi",
  onConfirm,
}: CookiesCardProps) {
  const [showCard, setShowCard] = useState(true);

  const handleConfirm = () => {
    setShowCard(false);
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div
      className={clsx(
        showCard
          ? "absolute bottom-0 left-0 w-full flex flex-col bg-background border-foreground border-t p-4 shadow-sm mx-auto"
          : "hidden",
        containerClassName
      )}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h3
            className={clsx(
              "text-base sm:text-lg font-semibold text-foreground",
              titleClassName
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={clsx(
                "text-sm sm:text-base text-foreground/70",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
        </div>
        <button
          className={clsx(
            "flex items-center justify-center px-3 py-2 rounded-md w-40 bg-primary-500 text-white text-sm sm:text-base",
            buttonClassName
          )}
          onClick={handleConfirm}
        >
          {buttonTitle}
        </button>
      </div>
    </div>
  );
}

