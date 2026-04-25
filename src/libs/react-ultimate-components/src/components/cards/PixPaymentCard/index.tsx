"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// PixPaymentCard.tsx
import {
  CheckIcon,
  CopyIcon,
  LinkIcon,
  TimerIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/** Propriedades do PixPaymentCard */
export interface PixPaymentCardProps {
  /** Mensagem orientativa ao usuário (ex.: “Escaneie o QR Code ou copie o link para pagar via Pix”). */
  message: string;
  /** Link de pagamento Pix (px/copia-e-cola). */
  paymentLink: string;
  /** URL da imagem do QR Code já pronta para exibição. */
  qrCodeImage: string;
  /**
   * Callback executado ao copiar o link de pagamento.
   * Recebe o próprio `paymentLink` como argumento.
   */
  onCopyCode?: (paymentLink: string) => void;
  /**
   * Data/hora de expiração do código Pix (ISO string).
   * Padrão: agora + 1 hora.
   * Ex.: "2025-12-31T23:59:59.000Z"
   */
  expiresAt?: string;
}

/**
 * Card de pagamento Pix.
 * - Exibe QR Code, mensagem para copiar o link e botão de copiar.
 * - Mostra contador regressivo até a expiração (padrão 1 hora).
 */
export default function PixPaymentCard({
  message,
  paymentLink,
  qrCodeImage,
  onCopyCode,
  expiresAt,
}: PixPaymentCardProps) {
  // === Expiração: padrão +1h ===
  const defaultEnd = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    return d;
  }, []);

  const endAt = useMemo(() => {
    if (!expiresAt) return defaultEnd;
    const parsed = new Date(expiresAt);
    return isNaN(parsed.getTime()) ? defaultEnd : parsed;
  }, [expiresAt, defaultEnd]);

  // === Contador regressivo ===
  const [remainingMs, setRemainingMs] = useState<number>(
    // eslint-disable-next-line react-hooks/purity
    Math.max(0, endAt.getTime() - Date.now())
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingMs(Math.max(0, endAt.getTime() - Date.now()));
    intervalRef.current = window.setInterval(() => {
      setRemainingMs(Math.max(0, endAt.getTime() - Date.now()));
    }, 1000);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [endAt]);

  const isExpired = remainingMs <= 0;

  const fmt = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // === Copiar link ===
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    onCopyCode?.(paymentLink);
    // reseta status de copiado depois de alguns segundos
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="
        group flex flex-col rounded-xl bg-bg-card border-border-card border bg-card shadow-sm p-3 sm:p-4 gap-3 sm:gap-4 max-w-full w-full sm:max-w-sm
      "
      aria-label="Pagamento via Pix"
    >
      {/* Cabeçalho: selo/contador */}
      <div
        className={`
            w-fit inline-flex items-center self-end gap-1 rounded-md px-2 py-1 text-[10px] sm:text-xs font-medium
            ${
              isExpired
                ? "bg-gray-100 text-gray-600"
                : "bg-orange-50 text-orange-700"
            }
          `}
        aria-live="polite"
      >
        <TimerIcon size="1em" weight="bold" />
        {isExpired ? "Código expirado" : `Expira em ${fmt(remainingMs)}`}
      </div>

      {/* QR Code */}
      <div className="w-full">
        <div
          className="
            w-full overflow-hidden rounded-lg bg-none
            h-44 sm:h-56 md:h-64 flex items-center justify-center
          "
        >
          <Image
            src={qrCodeImage}
            alt="QR Code do pagamento Pix"
            width={256}
            height={256}
            className="h-full w-auto object-contain"
            loading="eager"
            decoding="sync"
            sizes="(min-width: 768px) 320px, 240px"
          />
        </div>
      </div>

      {/* Mensagem orientativa */}
      <p className="text-xs sm:text-sm text-foreground/80 text-center">
        {message}
      </p>

      {/* Link + botão copiar */}
      <div className="flex flex-col gap-2">
        <div
          className="
            flex-1 inline-flex items-center gap-2 rounded-md border border-bg-card
            bg-background px-3 py-2 text-[11px] sm:text-xs text-foreground/80
            overflow-hidden
          "
          title={paymentLink}
          aria-label="Link de pagamento Pix"
        >
          <LinkIcon size={16} weight="regular" className="min-w-4" />
          <span className="truncate">{paymentLink}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={isExpired}
          className={`
            inline-flex items-center justify-center gap-2 rounded-md
            px-3 py-2 text-sm font-medium transition
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              isExpired
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-400"
            }
          `}
          aria-label="Copiar link Pix"
        >
          {copied ? (
            <>
              <CheckIcon size={18} weight="bold" /> Copiado!
            </>
          ) : (
            <>
              <CopyIcon size={18} weight="bold" /> Copiar link
            </>
          )}
        </button>
      </div>

      {/* Nota adicional */}
      <p className="text-[11px] sm:text-xs text-center text-foreground/60">
        Você também pode pagar escaneando o QR Code no app do seu banco.
      </p>
    </div>
  );
}
