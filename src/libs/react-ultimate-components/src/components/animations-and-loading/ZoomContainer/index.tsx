"use client";

import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

interface ZoomContainerProps {
  children: React.ReactNode;
  /** Percentagem do elemento que deve estar visível na viewport para executar a animação. Padrão: 0.25 */
  visibilityAmount?: number;
  /** Executar a animação apenas na 1ª vez que entrar em viewport. */
  once?: boolean;
  /** Escala mínima/máxima quando visível. */
  scale?: number;
  // /** Classes adicionais para customização do container */
  className?: string;
  // /** Delay da animação em segundos */
  delay?: number;
}

/** Container de animação com efeito zoom in.*/

export default function ZoomContainer({
  children,
  visibilityAmount = 0.25,
  once = false,
  scale = 1,
  delay = 0,
  className,
}: ZoomContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Detecta visibilidade
  const inView = useInView(ref, { amount: visibilityAmount, once });

  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1, scale: scale } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.8, delay: delay * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

