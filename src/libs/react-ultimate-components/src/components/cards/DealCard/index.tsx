"use client";

import clsx from "clsx";
import React from "react";

type Resource =
  | string
  | {
      icon?: React.ReactNode;
      label: string;
    };

export interface DealCardProps {
  title: string;
  subtitle?: string;
  currentPrice: string;
  oldPrice?: string;
  resources: Resource[];
  buttonTitle?: string;
  onSeeDetails: () => void;
  isBestOption?: boolean;
  discountPercentage?: number;

  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  buttonClassName?: string;
  currentPriceClassName?: string;
  oldPriceClassName?: string;
  resourcesClassName?: string;
}

export default function DealCard({
  title,
  subtitle,
  currentPrice,
  oldPrice,
  resources,
  onSeeDetails,
  buttonTitle,
  isBestOption,
  discountPercentage,
  className,
  titleClassName,
  subtitleClassName,
  buttonClassName,
  currentPriceClassName,
  oldPriceClassName,
  resourcesClassName,
}: DealCardProps) {
  const hasDiscount = typeof discountPercentage === "number";

  return (
    <div
      className={clsx(
        "relative w-full max-w-full sm:max-w-sm",
        "flex flex-col items-stretch rounded-xl border shadow-sm",
        "bg-white text-black border-black/10 p-4 sm:p-5",
        "dark:bg-neutral-900 dark:text-neutral-100 dark:border-white/10",
        className
      )}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {hasDiscount && (
          <span className="flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            {discountPercentage}% OFF
          </span>
        )}
        {isBestOption && (
          <span className="flex items-center rounded-md px-2 py-0.5 text-xs font-semibold mr-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Melhor opção
          </span>
        )}
      </div>

      {/* Header */}
      <strong
        className={clsx(
          "mt-6 sm:mt-8 text-lg sm:text-xl font-semibold text-center",
          titleClassName
        )}
      >
        {title}
      </strong>

      {subtitle && (
        <span
          className={clsx(
            "mt-2 sm:mt-3 mb-3 sm:mb-4 text-sm sm:text-base text-center text-black/70 dark:text-white/70",
            subtitleClassName
          )}
        >
          {subtitle}
        </span>
      )}

      {/* Prices */}
      {oldPrice && (
        <span
          className={clsx(
            "text-xs sm:text-sm line-through text-center text-black/60 dark:text-white/60",
            oldPriceClassName
          )}
        >
          de {oldPrice}
        </span>
      )}

      <span
        className={clsx(
          "mt-1 mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-center text-emerald-600 dark:text-emerald-400",
          currentPriceClassName
        )}
      >
        {oldPrice ? "por " : ""}
        {currentPrice}
      </span>

      {/* CTA */}
      <button
        type="button"
        onClick={onSeeDetails}
        className={clsx(
          "w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs sm:text-sm",
          "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
          isBestOption
            ? "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-400"
            : "bg-transparent border border-primary-600 text-primary-700 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/30",
          buttonClassName
        )}
        aria-label={buttonTitle || "Escolher plano"}
      >
        {buttonTitle || "Escolher plano"}
      </button>

      {/* Resources */}
      {resources?.length ? (
        <div
          className={clsx(
            "flex flex-col items-center mt-4 pt-4 border-t",
            "border-black/10 dark:border-white/10",
            resourcesClassName
          )}
        >
          <ul
            className={
              typeof resources[0] === "string"
                ? "list-disc list-inside"
                : ""
            }
          >
            {resources.map((res, idx) => {
              if (typeof res === "string") {
                return (
                  <li
                    key={idx}
                    className="list-item text-black/90 dark:text-white/90 leading-normal"
                  >
                    {/* move flex to inner wrapper to preserve bullet */}
                    <span className="text-xs sm:text-sm">{res}</span>
                  </li>
                );
              }
              return (
                <li key={idx} className=" text-black/90 dark:text-white/90">
                  <div className="flex items-center gap-2 leading-normal">
                    {res.icon ? (
                      <span className="shrink-0">{res.icon}</span>
                    ) : null}
                    <span>{res.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

