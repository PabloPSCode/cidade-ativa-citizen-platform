"use client";

import { convertKbToMb } from "../../../utils/convertions";
import {
  FileIcon,
  ImageIcon,
  InfoIcon,
  TrashIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";

export interface IFilePreview {
  /** Nome do arquivo (ex.: foto.png) */
  name: string;
  /** URL/URI do arquivo para pré-visualização ou download */
  uri: string;
  /** Tamanho do arquivo em KB */
  size: number;
  /** MIME type (ex.: image/png, video/mp4, application/pdf) */
  type: string;
}

export interface UploadedFilePreviewProps {
  /** Rótulo exibido acima do preview */
  label?: string;
  /** Dados do arquivo selecionado */
  file: IFilePreview;
  /** Callback para remover/cancelar o arquivo */
  onCancel: () => void;
  /** Ativaopção de exibir o arquivo em outra aba */
  enableFileOnOtherTab?: boolean;
  /** Classe opcional para o contêiner externo */
  containerClassName?: string;
  /** Classe opcional para o quadro de mídia (imagem/vídeo) */
  mediaClassName?: string;
}

/**
 * Preview de arquivo enviado (imagem/vídeo/outros).
 * - **Responsivo** e com **dark mode** (usa tokens `bg-background`, `text-foreground` etc.).
 * - Mostra nome, tamanho, ícone por tipo e botão de remoção acessível.
 * - Suporta preview de **imagem** e **vídeo**; outros tipos exibem um placeholder com link.
 */
export default function UploadedFilePreview({
  file,
  onCancel,
  label = "Arquivo anexado",
  enableFileOnOtherTab = false,
  containerClassName,
  mediaClassName,
}: UploadedFilePreviewProps) {
  const { name, uri, size, type } = file;

  const isImage = /^image\//.test(type);
  const isVideo = /^video\//.test(type);

  return (
    <section
      className={clsx(
        "w-full rounded-md border border-foreground/10 bg-background",
        "p-3 sm:p-4",
        containerClassName
      )}
      aria-label={`Preview do arquivo ${name}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-medium text-foreground/80">
            {label}
          </span>
          {isImage ? (
            <ImageIcon className="text-foreground/60" size={16} weight="bold" />
          ) : isVideo ? (
            <VideoCameraIcon
              className="text-foreground/60"
              size={16}
              weight="bold"
            />
          ) : (
            <FileIcon className="text-foreground/60" size={16} weight="bold" />
          )}
        </div>

        <button
          type="button"
          onClick={onCancel}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onCancel()}
          className={clsx(
            "inline-flex items-center justify-center rounded-md",
            "text-destructive-500/90 hover:text-destructive-600",
            "focus:outline-none focus:ring-2 focus:ring-destructive-400/30",
            "p-1"
          )}
          aria-label="Remover arquivo"
          title="Remover arquivo"
        >
          <TrashIcon size={16} weight="fill" />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 sm:mb-4">
        <span
          className="max-w-full truncate text-xs sm:text-sm text-foreground"
          title={name}
        >
          {name}
        </span>
        <span className="text-[11px] sm:text-xs text-foreground/70">
          {convertKbToMb(size)} MB
        </span>
        {enableFileOnOtherTab && (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] sm:text-xs text-primary-600 hover:underline"
          >
            Abrir em nova aba
          </a>
        )}
      </div>

      {/* Media preview */}
      <div
        className={clsx(
          "w-full",
          "rounded-lg overflow-hidden",
          mediaClassName
        )}
      >
        <div className="w-full flex items-center">
          <InfoIcon className="text-foreground/60" size={24} weight="regular" />
          {isImage ? (
            <Image
              src={uri}
              alt={name}
              className="w-full h-auto object-cover"
              loading="lazy"
              width={1200}
              height={675}
              sizes="100vw"
            />
          ) : isVideo ? (
            <video
              src={uri}
              controls
              className="w-full h-auto"
              style={{ aspectRatio: "16 / 9" }}
            />
          ) : (
            <div className="p-3 sm:p-4 text-xs sm:text-sm text-foreground/80">
              <p>
                Pré-visualização indisponível para o tipo{" "}
                <strong>{type || "desconhecido"}</strong>.
              </p>
              {enableFileOnOtherTab && (
                <p>Faça o download/abertura pelo link acima.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
