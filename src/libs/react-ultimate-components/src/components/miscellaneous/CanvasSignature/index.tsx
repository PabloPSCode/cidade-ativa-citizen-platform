"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface CanvasSignatureProps {
  /** Rótulo do campo de assinatura */
  label?: string;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /**
   * Largura fixa do canvas em pixels. Quando omitida, o canvas preenche a
   * largura do container de forma responsiva.
   */
  width?: number;
  /** Altura do canvas em pixels. Padrão é 200. */
  height?: number;
  /** Função chamada ao salvar a assinatura. */
  onSave?: (dataURL: string) => void;
  /** Função chamada ao limpar a assinatura. */
  onClear?: () => void;
}

export default function CanvasSignature({
  label,
  helperText,
  errorMessage,
  width,
  height = 200,
  onSave,
  onClear,
}: CanvasSignatureProps) {
  const canvasRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);

  // Mede a largura real do container e usa esse valor como tamanho do buffer do
  // canvas. Sem isso, o atributo `width` fixo difere do tamanho exibido via CSS
  // (`w-full`), fazendo o react-signature-canvas mapear os pontos com um
  // deslocamento — o traço fica distante do cursor.
  useEffect(() => {
    if (width) return;
    const element = containerRef.current;
    if (!element) return;

    const update = () => setMeasuredWidth(element.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  const canvasWidth = width ?? measuredWidth;

  const handleClear = () => {
    canvasRef.current?.clear();
    onClear?.();
  };

  const handleSave = () => {
    const dataURL = canvasRef.current?.toDataURL();
    if (dataURL) {
      onSave?.(dataURL);
    }
  };

  return (
    <div>
      <label
        className={clsx("flex font-medium text-xs sm:text-sm text-foreground")}
      >
        {label || "Desenhe sua assinatura abaixo"}
      </label>
      {helperText && !errorMessage && (
        <p className="text-foreground/70 text-xs sm:text-sm mb-1">
          {helperText}
        </p>
      )}
      {errorMessage && (
        <p className="text-red-400 text-xs sm:text-sm mb-1">{errorMessage}</p>
      )}

      <div ref={containerRef} className="w-full" style={{ minHeight: height }}>
        {canvasWidth > 0 && (
          <SignatureCanvas
            ref={canvasRef}
            penColor="black"
            canvasProps={{
              // O buffer tem exatamente o tamanho exibido (1:1) → sem escala,
              // os pontos acompanham o cursor com precisão.
              width: canvasWidth,
              height,
              className: "border rounded-md bg-white",
            }}
          />
        )}
      </div>

      <div className="w-full flex justify-between sm:items-center gap-4 mt-1">
        <button
          type="button"
          className="text-foreground/70 font-light text-xs sm:text-sm"
          onClick={handleClear}
        >
          Limpar assinatura
        </button>
        <button
          type="button"
          className="text-foreground/70 text-xs sm:text-sm font-bold"
          onClick={handleSave}
        >
          Salvar assinatura
        </button>
      </div>
    </div>
  );
}
