"use client";

import clsx from "clsx";

interface HeroSectionProps {
  /** Tamanho da largura da seção */
  size: "full" | "middle";
  /** Título da seção */
  title?: string;
  /** Subtítulo da seção */
  subtitle?: string;
  /** Texto do botão */
  buttonText?: string;
  /** URL da imagem de fundo */
  backgroundImageLocalPath?: string;
  /** Classes adicionais para customização da seção */
  sectionClassName?: string;
  /** Classes adicionais para customização do título */
  titleClassName?: string;
  /** Classes adicionais para customização do subtítulo */
  subtitleClassName?: string;
  /** Classes adicionais para customização do botão */
  buttonClassName?: string;
  /** Função chamada ao clicar no botão */
  onButtonClick?: () => void;
  /** Conteúdo adicional a ser renderizado dentro da seção */
  children?: React.ReactNode;
}

export default function HeroSection({
  size,
  title,
  subtitle,
  buttonText,
  backgroundImageLocalPath,
  sectionClassName,
  titleClassName,
  subtitleClassName,
  buttonClassName,
  onButtonClick,
  children,
}: HeroSectionProps) {
  return (
    <section
      className={clsx(
        size === "full" ? "w-full" : "w-full max-w-7xl mx-auto",
        "flex flex-col items-center px-8 py-12",
        "bg-cover bg-center",
        sectionClassName
      )}
      style={
        backgroundImageLocalPath
          ? { backgroundImage: `url(${backgroundImageLocalPath})` }
          : undefined
      }
    >
      {title && (
        <h1
          className={clsx(
            "text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-2 text-foreground",

            titleClassName
          )}
        >
          {title}
        </h1>
      )}
      {subtitle && (
        <h2
          className={clsx(
            "text-base sm:text-lg  text-foreground/60 font-regular font-secondary text-center",
            subtitleClassName
          )}
        >
          {subtitle}
        </h2>
      )}
      {children && children}
      {buttonText && (
        <button
          className={clsx(
            "mt-4 bg-primary-500 rounded-md py-2 px-4",
            buttonClassName
          )}
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </section>
  );
}
