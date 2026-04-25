"use client";

import clsx from "clsx";
import { Checkbox, IntervalSliderInput } from "react-ultimate-components";
import { formatBRL } from "../../libs/react-ultimate-components/src/utils/format";
import type { ICategory } from "../../types";

type PriceRange = [number, number];

export interface FilterControllerCardProps {
  categories: ICategory[];
  selectedCategoryIds: string[];
  priceRange: PriceRange;
  minPrice: number;
  maxPrice: number;
  onToggleCategory: (categoryId: string) => void;
  onPriceChange: (values: PriceRange) => void;
  onResetFilters: () => void;
  className?: string;
}

export default function FilterControllerCard({
  categories,
  selectedCategoryIds,
  priceRange,
  minPrice,
  maxPrice,
  onToggleCategory,
  onPriceChange,
  onResetFilters,
  className,
}: FilterControllerCardProps) {
  return (
    <div
      className={clsx(
        "filter-controller-container Container",
        "flex w-full flex-col gap-5 rounded-2xl border border-border-card bg-bg-card p-4 sm:p-5 text-foreground shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={onResetFilters}
        className={clsx(
          "filter-controller-reset-button ResetFilterButton",
          "w-fit text-xs sm:text-sm font-semibold text-foreground/70 hover:text-foreground transition"
        )}
      >
        Limpar todos os filtros
      </button>

      <div
        className={clsx(
          "filter-controller-section FilterControllerSection",
          "filter-controller-section-categories",
          "flex flex-col gap-3"
        )}
      >
        <div className="filter-controller-section-header flex flex-col gap-2">
          <h3 className="filter-controller-section-title FilterControllerSectionTitle text-sm sm:text-base font-bold uppercase tracking-wide">
            Categoria
          </h3>
          <span className="filter-controller-section-divider h-px w-full bg-foreground/10" />
        </div>

        <div className="filter-controller-section-content flex flex-col gap-2">
          {categories.map((category) => {
            const categoryId = category.id ?? category.name;
            return (
              <div
                key={categoryId}
                className="filter-controller-category-item"
              >
                <Checkbox
                  checked={selectedCategoryIds.includes(categoryId)}
                  onChange={() => onToggleCategory(categoryId)}
                  helperText={category.name}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={clsx(
          "filter-controller-section FilterControllerSection",
          "filter-controller-section-price",
          "flex flex-col gap-3"
        )}
      >
        <div className="filter-controller-section-header flex flex-col gap-2">
          <h3 className="filter-controller-section-title FilterControllerSectionTitle text-sm sm:text-base font-bold uppercase tracking-wide">
            Preco
          </h3>
          <span className="filter-controller-section-divider h-px w-full bg-foreground/10" />
        </div>

        <IntervalSliderInput
          label="Faixa de preco"
          minValue={minPrice}
          maxValue={maxPrice}
          stepValue={1}
          values={priceRange}
          onChange={onPriceChange}
          formatValue={formatBRL}
        />
      </div>
    </div>
  );
}
