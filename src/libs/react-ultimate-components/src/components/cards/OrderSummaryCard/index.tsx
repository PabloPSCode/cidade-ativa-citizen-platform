"use client";
import { formatBRL } from "../../../utils/format";
import clsx from "clsx";

export interface OrderSummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryCardProps {
  items: OrderSummaryItem[];
  title?: string;
  helperText?: string;
  checkoutLabel?: string;
  onCheckout?: () => void;
  className?: string;
}

const columnsClass =
  "grid-cols-[minmax(0,2fr)_88px_minmax(0,1fr)] sm:text-sm text-xs";

export default function OrderSummaryCard({
  items,
  title = "Resumo do pedido",
  helperText = "Frete e impostos serão calculados na finalização.",
  checkoutLabel = "Prosseguir para o checkout",
  onCheckout,
  className,
}: OrderSummaryCardProps) {
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section
      className={clsx(
        "w-full rounded-md border border-border-card bg-bg-card p-5 sm:p-6 shadow-sm text-foreground",
        "flex flex-col gap-4",
        className
      )}
      aria-label="Resumo do pedido"
    >
      <div className="flex flex-col gap-1 border-b border-foreground/10 pb-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {helperText && (
          <p className="text-xs text-foreground/60">{helperText}</p>
        )}
      </div>

      {items.length ? (
        <>
          <div className="hidden sm:grid grid-cols-[minmax(0,2fr)_88px_minmax(0,1fr)] text-xs font-semibold uppercase tracking-wide text-foreground/60">
            <span>Produto</span>
            <span className="text-center">Qtd.</span>
            <span className="text-right">Subtotal</span>
          </div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {items.map((item) => {
              const subtotal = item.price * item.quantity;
              return (
                <div
                  key={item.id}
                  className={clsx(
                    "py-3 flex flex-col gap-2",
                    "sm:grid sm:items-center",
                    columnsClass
                  )}
                >
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {item.name}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {formatBRL(item.price)} cada
                    </p>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-foreground sm:text-center">
                    {item.quantity}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-right">
                    {formatBRL(subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-foreground/20 bg-background/40 p-4 text-sm text-foreground/70">
          Nenhum item foi adicionado ainda.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 pb-3">
        <span className="text-base font-semibold">Total</span>
        <span className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
          {formatBRL(total)}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={!items.length}
        className={clsx(
          "inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-xs sm:text-sm font-semibold text-white  focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          "bg-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {checkoutLabel}
      </button>
    </section>
  );
}

