"use client";

import { useEffect, useState } from "react";
import { listNeighborhoods } from "../../services/neighborhoods";

export interface NeighborhoodOption {
  label: string;
  value: string;
}

/**
 * Busca os bairros cadastrados na rota `GET /neighborhoods` do back-end.
 * Como os payloads/filtros usam o nome do bairro como string, as opções
 * retornam o nome tanto como `label` quanto como `value`.
 *
 * Quando um `cityName` é informado, retorna apenas os bairros daquela cidade;
 * sem `cityName` a lista traz todos os bairros (comportamento padrão).
 */
export function useNeighborhoods(cityName?: string) {
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNeighborhoods() {
      setIsLoading(true);
      try {
        const result = await listNeighborhoods(
          cityName ? { cityName } : undefined,
        );
        if (cancelled) return;
        const names = Array.from(
          new Set(result.map((item) => item.name))
        ).sort((left, right) => left.localeCompare(right));
        setNeighborhoods(names);
      } catch {
        if (!cancelled) setNeighborhoods([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchNeighborhoods();
    return () => {
      cancelled = true;
    };
  }, [cityName]);

  const options: NeighborhoodOption[] = neighborhoods.map((name) => ({
    label: name,
    value: name,
  }));

  return { neighborhoods, options, isLoading };
}
