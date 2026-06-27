"use client";

import { useEffect, useMemo, useState } from "react";
import { listCities, type CityResponseDTO } from "../../services/cities";

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Busca todas as cidades cadastradas na rota `GET /cities` do back-end.
 * O back-end não expõe uma rota de UFs: a sigla da UF vem no campo `uf`
 * de cada cidade, então as UFs disponíveis são derivadas dessa lista.
 *
 * Retorna também um helper `citiesByUf` para montar o select de cidades
 * dependente da UF selecionada.
 */
export function useCities() {
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAllCities() {
      setIsLoading(true);
      try {
        const all: CityResponseDTO[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const result = await listCities({ page, perPage: 100 });
          if (cancelled) return;
          all.push(...result.data);
          totalPages = result.meta.totalPages;
          page += 1;
        } while (page <= totalPages);

        if (!cancelled) setCities(all);
      } catch {
        if (!cancelled) setCities([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAllCities();
    return () => {
      cancelled = true;
    };
  }, []);

  // UFs únicas (ex.: "MG", "SP") derivadas das cidades.
  const ufOptions: SelectOption[] = useMemo(() => {
    const ufs = Array.from(new Set(cities.map((city) => city.uf)));
    return ufs
      .sort((left, right) => left.localeCompare(right))
      .map((uf) => ({ label: uf, value: uf }));
  }, [cities]);

  /** Cidades de uma UF específica, prontas para o `SelectInput`. */
  function citiesByUf(uf: string): SelectOption[] {
    if (!uf) return [];
    return cities
      .filter((city) => city.uf === uf)
      .map((city) => ({ label: city.name, value: city.id }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  /** Localiza o nome de uma cidade pelo seu id (usado para filtrar bairros). */
  function cityNameById(cityId: string): string | undefined {
    return cities.find((city) => city.id === cityId)?.name;
  }

  return { cities, ufOptions, citiesByUf, cityNameById, isLoading };
}
