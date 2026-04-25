"use client";
import clsx from "clsx";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface CanvasSignatureProps {
  /** Rótulo do campo de assinatura */
  label?: string;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Largura do canvas em pixels. Padrão é 500. */
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
  width = 500,
  height = 200,
  onSave,
  onClear,
}: CanvasSignatureProps) {
  const canvasRef = useRef<SignatureCanvas>(null);

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
      <SignatureCanvas
        ref={canvasRef}
        penColor="black"
        canvasProps={{
          width,
          height,
          className: "border rounded-md w-full bg-white",
        }}
      />
      <div className="w-full flex justify-between sm:items-center gap-4 mt-1">
        <button
          className="text-foreground/70 font-light text-xs sm:text-sm"
          onClick={handleClear}
        >
          Limpar assinatura
        </button>
        <button
          className="text-foreground/70 text-xs sm:text-sm font-bold"
          onClick={handleSave}
        >
          Salvar assinatura
        </button>
      </div>
    </div>
  );
}

