"use client";

import CheckBox, { type CheckboxChangeEvent } from "rc-checkbox";

interface CheckboxProps {
  /** Se o checkbox está marcado ou não */
  checked?: boolean;
  /** Função chamada quando o estado do checkbox muda */
  onChange?: (e: CheckboxChangeEvent) => void;
  /** Texto de ajuda (exibido ao lado do checkbox) */
  helperText?: string;
  /** Mensagem de erro (exibida abaixo do checkbox) */
  errorMessage?: string;
  /** Se o checkbox está desabilitado */
  disabled?: boolean;
}

export default function Checkbox({
  checked,
  onChange,
  helperText,
  errorMessage,
  disabled = false,
}: CheckboxProps) {
  return (
    <div className="block gap-4">
      <div className="flex items-center gap-2 mt-1">
        <CheckBox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
        inline-flex items-center justify-center
        /* tamanho e borda do quadrado */
        /* cor quando marcado */
        [&.rc-checkbox-checked_.rc-checkbox-inner]:!bg-primary-600
        [&.rc-checkbox-checked_.rc-checkbox-inner]:!border-primary-600
        /* foco/acessibilidade */
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary-400/40
      `}
        />
        {helperText && (
          <span className="flex font-medium text-sm sm:text-base text-foreground -mt-[2px]">
            {helperText}
          </span>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-400 text-xs sm:text-sm">{errorMessage}</p>
      )}
    </div>
  );
}
