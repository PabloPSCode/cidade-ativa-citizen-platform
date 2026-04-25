"use client";

import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

interface FadeContainerProps {
  children: React.ReactNode;
  /** Percentagem do elemento que deve estar visível na viewport para executar a animação. Padrão: 0.25 */
  visibilityAmount?: number;
  /** Executar a animação apenas na 1ª vez que entrar em viewport. */
  once?: boolean;
  // /** Classes adicionais para customização do container */
  className?: string;
  // /** Delay da animação em segundos */
  delay?: number;
}

/** Container de animação com efeito fade. Para ver o efeito, envolva o conteúdo em um <ZoomContainer> e garanta que o componente esteja dentro de algum container que tenha altura mínima para scrolar a página.*/

export default function FadeContainer({
  children,
  visibilityAmount = 0.25,
  once = false,
  delay = 0,

  className,
}: FadeContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Detecta visibilidade
  const inView = useInView(ref, { amount: visibilityAmount, once });

  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay: delay * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

