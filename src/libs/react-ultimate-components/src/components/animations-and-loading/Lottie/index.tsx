"use client";

import type { CSSProperties } from "react";
import Lottie from "react-lottie";

interface LottieAnimationProps {
  /** Animação a ser renderizada. Pode ser um JSON, verificar exemplo.*/
  animation: unknown;
  /** Altura da animação. */
  height: number;
  /** Largura da animação. */
  width: number;
  /** Repetir animação. */
  loop?: boolean;
  /** Iniciar animação automaticamente. */
  autoplay?: boolean;
  /** Estilos personalizados para a animação. */
  style?: CSSProperties;
}

/** Componente de animação baseado na biblioteca Lottie. Para mais detalhes, ver documentação em https://github.com/airbnb/lottie-web. */
export default function LottieAnimation({
  animation,
  height,
  width,
  loop,
  autoplay,
  style,
}: LottieAnimationProps) {
  const defaultOptions = {
    loop,
    autoplay,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie
      options={defaultOptions}
      height={height}
      width={width}
      style={style}
    />
  );
}

