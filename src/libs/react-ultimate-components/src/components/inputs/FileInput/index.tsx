"use client";

import clsx from "clsx";
import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from "react";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo do campo de upload */
  label: string;
  /** Texto de instrução para o campo de upload */
  instructionText?: string;
  /** Texto do botão de upload */
  buttonTitle?: string;
  /** Função a ser chamada ao fazer upload do arquivo */
  onUpload?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Classe opcional para o botão visual. */
  buttonClassName?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
}

/** Componente de input de arquivo com texto de instrução.*/
const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      instructionText,
      buttonTitle,
      onUpload,
      buttonClassName,
      containerClassName,
      disabled,
      ...rest
    }: FileInputProps,
    ref
  ) => {
    return (
      <div className={clsx("flex w-full flex-col", containerClassName)}>
        <span className="text-foreground text-xs sm:text-sm lg:text-sm mb-1">
          {label}
        </span>
        {instructionText && (
          <span className="text-foreground/70 text-xs sm:text-sm lg:text-sm mb-1 ">
            {instructionText}
          </span>
        )}
        <input
          className="opacity-0 mb-[-3rem] cursor-pointer z-10 w-full h-[3rem] disabled:cursor-not-allowed"
          ref={ref}
          onChange={onUpload}
          disabled={disabled}
          type="file"
          {...rest}
        />
        <button
          type="button"
          disabled={disabled}
          className={clsx(
            "flex h-[3rem] w-full items-center justify-center rounded-lg border text-xs font-medium transition sm:text-sm",
            "border-border-card/70 bg-background text-foreground",
            "hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60",
            buttonClassName
          )}
        >
          {buttonTitle ? buttonTitle : "Selecione um arquivo"}
        </button>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
export default FileInput;
