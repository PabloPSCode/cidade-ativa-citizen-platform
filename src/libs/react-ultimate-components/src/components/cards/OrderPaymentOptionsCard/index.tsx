"use client";
import creditCard from "../../../assets/credit-card.png";
import pixLogo from "../../../assets/pix.png";
import { formatBRL } from "../../../utils/format";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";

interface OrderPaymentOptionsCardProps {
  totalOrder: number;
  className?: string;
  checkoutLabel?: string;
  onCheckout?: () => void;
  onBack?: () => void;
  showPixOption?: boolean;
  pixPaymentDiscountPercentage?: number;
  creditCardInstallmentsLimit?: number;
  showCreditCardOption?: boolean;
}

export default function OrderPaymentOptionsCard({
  totalOrder,
  className,
  checkoutLabel = "Prosseguir para o checkout",
  showCreditCardOption = true,
  showPixOption = true,
  pixPaymentDiscountPercentage = 5,
  creditCardInstallmentsLimit = 10,
  onCheckout,
  onBack,
}: OrderPaymentOptionsCardProps) {
  const pixPaymentValue = useMemo(() => {
    if (!showPixOption) return null;
    const discount =
      pixPaymentDiscountPercentage > 0
        ? (totalOrder * pixPaymentDiscountPercentage) / 100
        : 0;
    return totalOrder - discount;
  }, [pixPaymentDiscountPercentage, showPixOption, totalOrder]);

  const crediCartInstallmentsPaymentValue = useMemo(() => {
    if (!showCreditCardOption) return null;
    return totalOrder / creditCardInstallmentsLimit;
  }, [creditCardInstallmentsLimit, showCreditCardOption, totalOrder]);

  return (
    <section
      className={clsx(
        "w-full rounded-md border border-border-card bg-bg-card p-5 sm:p-6 shadow-sm text-foreground",
        "flex flex-col gap-4",
        className
      )}
      aria-label="Resumo do pedido"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-base sm:text-lg font-semibold">Total</span>
        <span className="text-sm sm:text-base  font-bold text-green-600">
          {formatBRL(totalOrder)}
        </span>
      </div>

      {showPixOption && pixPaymentValue !== null && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-foreground/5 rounded-md">
          <Image
            src={pixLogo}
            alt="logo-pix"
            className="w-6 h-6 sm:w-8 sm:h-8"
            width={32}
            height={32}
          />
          <span className="text-xs sm:text-sm text-foreground">
            Pagamento via Pix com {pixPaymentDiscountPercentage}% de desconto:
          </span>
          <span className="text-xs sm:text-sm  font-semibold text-green-600">
            {formatBRL(pixPaymentValue)}
          </span>
        </div>
      )}

      {showCreditCardOption && crediCartInstallmentsPaymentValue !== null && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-foreground/5 rounded-md">
          <Image
            src={creditCard}
            alt="logo-cartão de crédito"
            className="w-6 h-7 sm:w-8 sm:h-9"
            width={32}
            height={36}
          />
          <span className="text-xs sm:text-sm ">
            Cartão de crédito em até {creditCardInstallmentsLimit}x sem juros de{" "}
            {formatBRL(crediCartInstallmentsPaymentValue)}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onCheckout}
        className={clsx(
          "inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-xs sm:text-sm font-semibold text-white  focus-visible:outline-offset-2 focus-visible:outline-primary-500",
          "bg-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {checkoutLabel}
      </button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={clsx(
            "inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-xs sm:text-sm  font-semibold text-foreground  focus-visible:outline-offset-2 focus-visible:outline-primary-500",
            "border border-foreground/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          Voltar
        </button>
      )}
    </section>
  );
}
