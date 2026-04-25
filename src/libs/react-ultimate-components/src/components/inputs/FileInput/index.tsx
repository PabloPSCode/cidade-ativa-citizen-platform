"use client";

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
}

/** Componente de input de arquivo com texto de instrução.*/
const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, instructionText, buttonTitle, onUpload, ...rest }: FileInputProps, ref) => {
    return (
      <div className="flex flex-col w-full">
        <span className="text-foreground text-xs sm:text-sm lg:text-sm mb-1">
          {label}
        </span>
        {instructionText && (
          <span className="text-foreground/70 text-xs sm:text-sm lg:text-sm mb-1 ">
            {instructionText}
          </span>
        )}
        <input
          className="opacity-0 mb-[-3rem] cursor-pointer z-10 w-full h-[3rem]"
          ref={ref}
          onChange={onUpload}
          type="file"
          {...rest}
        />
        <button
          type="button"
          className="w-full h-[3rem] flex items-center justify-center bg-gray-200 font-medium rounded-lg border border-black text-black text-xs sm:text-sm"
        >
          {buttonTitle ? buttonTitle : "Selecione um arquivo"}
        </button>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
export default FileInput;
