"use client";

import { getThemeColor } from "../../../utils/colors";
import Switch from "react-switch";

interface SwitcherProps {
  /** Rótulo exibido ao lado do switch */
  label?: string;
  /** Indica se o switch está ativado */
  checked: boolean;
  /** Função chamada quando o estado do switch é alterado */
  onChange: (checked: boolean) => void;
  /** Texto de ajuda (exibido abaixo do input quando não há erro). */
  helperText?: string;
  /** Mensagem de erro (prioridade sobre o helperText). */
  errorMessage?: string;
  /** Classe opcional para o contêiner externo. */
  containerClassName?: string;
  /** Indica se o switch está desativado */
  disabled?: boolean;
}

export default function Switcher({
  checked,
  onChange,
  label,
  helperText,
  errorMessage,
  containerClassName,
  disabled,
}: SwitcherProps) {
  const primaryColor = getThemeColor("--color-primary-500");

  return (
    <div className={containerClassName}>
      <label className="flex flex-col gap-1 text-xs sm:text-sm text-foreground">
        {label}
        <Switch
          checked={checked}
          onChange={onChange}
          offColor="#d0d0d0"
          onColor={primaryColor}
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
          handleDiameter={20}
          disabled={disabled}
        />
      </label>
      {errorMessage ? (
        <p className={"text-red-400 text-xs sm:text-sm"}>{errorMessage}</p>
      ) : helperText && !disabled ? (
        <p className={"text-foreground/70 text-xs sm:text-sm"}>{helperText}</p>
      ) : null}
    </div>
  );
}

