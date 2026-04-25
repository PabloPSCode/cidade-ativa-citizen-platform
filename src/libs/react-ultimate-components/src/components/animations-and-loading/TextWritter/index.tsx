"use client";

import { useMemo } from "react";
import type { } from 'react-type-animation';
import { TypeAnimation } from "react-type-animation";

export interface TypeWriterProps {
  /** Elemento wrapper que receberá o texto animado. */
  wrapper?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  /** Lista de mensagens a serem digitadas em sequência. */
  textList: string[];
  /** Intervalo (ms) de pausa após cada mensagem. */
  textDelayMs?: number;
  /**
   * Quantidade de repetições do ciclo de mensagens.
   * Use `Infinity` para repetir indefinidamente.
   */
  repeat?: number;
  /** Exibe o cursor durante a animação. */
  showsCursor?: boolean;
  /** Velocidade da animação (1-99). */
  speed?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99
  /** Classes utilitárias para estilização. */
  className?: string;
}

/**
 * Componente de digitação de texto (typewriter) baseado em `react-type-animation`.
 * - Gera automaticamente a sequência `sequence` intercalando cada texto com o atraso (`textDelayMs`).
 * - Permite escolher o wrapper (h1–h6, p, span, div) e configurar repetição/cursores.
 */
export default function TypeWriter({
  textList,
  textDelayMs = 1200,
  wrapper = "h1",
  repeat = Infinity,
  showsCursor = true,
  speed = 20,
  className,
}: TypeWriterProps) {
  // Monta a sequência: ["texto A", delay, "texto B", delay, ...]
  const sequence = useMemo(() => {
    // filtra entradas vazias/undefined só por segurança
    const clean = textList.filter(Boolean);
    // intercala texto + delay
    const seq = clean.flatMap((t) =>
      // manter um delay após cada item para suavizar o loop
      [t, textDelayMs]
    );
    // Se não houver textos, evita passar uma sequência vazia
    return seq.length ? seq : [""];
  }, [textList, textDelayMs]);

  return (
    <TypeAnimation
      sequence={sequence}
      wrapper={wrapper}
      className={className}
      cursor={showsCursor}
      repeat={repeat}
      speed={speed}
    />
  );
}

