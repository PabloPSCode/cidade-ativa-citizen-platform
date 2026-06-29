"use client";

import { useCallback, useRef, useState } from "react";

interface UseAsyncActionOptions {
  /**
   * Mensagem exibida quando o valor capturado no `catch` não é uma instância de
   * `Error` (o `http.ts` já rejeita com `Error`, então isso é apenas fallback).
   */
  fallbackErrorMessage?: string;
  /** Callback opcional executado após o erro ser tratado e armazenado. */
  onError?: (error: unknown) => void;
}

/**
 * Encapsula o padrão repetido de toda ação assíncrona disparada por botão:
 * ligar o estado de carregamento, limpar o erro anterior, rodar a requisição
 * dentro de `try/catch/finally` e desligar o carregamento ao final.
 *
 * O `isLoading` retornado serve para desabilitar o botão e exibir o spinner
 * enquanto a requisição está em andamento, evitando cliques duplicados.
 *
 * A ação mais recente é guardada em ref, então o componente não precisa
 * memoizar o callback e o `run` retornado é estável entre renders.
 *
 * @example
 * const { isLoading, error, run } = useAsyncAction(async () => {
 *   await deleteSolicitation(id);
 *   onClose();
 * });
 * // <Button label="Excluir" loading={isLoading} onClick={run} />
 */
export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
  options: UseAsyncActionOptions = {},
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantém sempre a versão mais recente da ação/opções sem exigir que o
  // componente memoize os callbacks, evitando closures defasadas.
  const actionRef = useRef(action);
  actionRef.current = action;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const run = useCallback(
    async (...args: Args): Promise<Result | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        return await actionRef.current(...args);
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : optionsRef.current.fallbackErrorMessage ??
              "Ocorreu um erro inesperado. Tente novamente.";
        setError(message);
        optionsRef.current.onError?.(caught);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, error, run, setError };
}
