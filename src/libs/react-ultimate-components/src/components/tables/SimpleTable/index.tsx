"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchInput from "./components/SearchInput";
import { compareDataType, type Currency } from "../../../utils/format";
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

export type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

export interface SimpleTableProps {
  /** Dados para alimentar a tabela, array de objetos, JSON */
  data: Array<Record<string, any>>;
  /** Mapeamento dos cabeçalhos da tabela */
  tableHeadersMap?: Record<string, string>;
  /** Rótulos customizados para colunas (além do tableHeadersMap) */
  columnLabels?: { key: string; label: string }[];
  /** Callback chamado quando o usuário muda a página */
  onValuePageChange?: (page: number) => void;
  /** Callback chamado quando o usuário muda o tamanho da página */
  onValueTotalChange?: (pageSize: number) => void;
  /** Dados de paginação */
  paginationData?: PaginationData;
  /** Callback chamado quando o usuário clica em uma linha (ver detalhes) */
  onSeeItemDetails?: (row: Record<string, any>) => void;
  /** Callback chamado quando o usuário aplica filtros/busca */
  onFiltersChange?: (filters: Record<string, any>) => void;
  /** Mostra controles de paginação abaixo da tabela (default: true) */
  showPagination?: boolean;
  /** Mostra campo de busca (default: true) */
  showSearch?: boolean;
  /** Moeda para formatação de colunas monetárias (default: "BRL") */
  currency?: Currency;
  /** Aplica estilo listrado (zebra) nas linhas (default: true) */
  stripped?: boolean;
  /** Nomes das colunas que devem ser tratadas como monetárias (ex: ["price", "total"]). Se não fornecido, tenta detectar automaticamente. */
  moneyColumns?: string[];
  /** Classe CSS customizada para a tabela */
  tableClassName?: string;
  /** Classe CSS customizada para os cabeçalhos */
  headerClassName?: string;
  /** Classe CSS customizada para o campo de busca */
  searchClassName?: string;
  /** Classe CSS customizada para a paginação */
  paginationClassName?: string;
}

/* -------------------- sort helpers -------------------- */
type Sort = { key: string | null; dir: "asc" | "desc" };

/* -------------------- currency helpers -------------------- */
const localeFromCurrency = (currency: Currency) =>
  currency === "USD"
    ? "en-US"
    : currency === "EUR"
    ? "de-DE"
    : currency === "GBP"
    ? "en-GB"
    : currency === "JPY"
    ? "ja-JP"
    : currency === "CNY"
    ? "zh-CN"
    : "pt-BR";

const parseNumberSoft = (v: any): number | null => {
  if (v == null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const n = Number(
    String(v)
      .replace(/[^\d,-.]/g, "")
      .replace(",", ".")
  );
  return Number.isFinite(n) ? n : null;
};

/* ------------------------- Component --------------------------- */
export default function SimpleTable({
  data,
  tableHeadersMap,
  columnLabels,
  onValuePageChange,
  onValueTotalChange,
  paginationData,
  onSeeItemDetails,
  showPagination = true,
  showSearch = true,
  onFiltersChange,
  currency = "BRL",
  stripped = true,
  moneyColumns,
  tableClassName,
  headerClassName,
  searchClassName,
  paginationClassName,
}: SimpleTableProps) {
  const cols = useMemo(() => (data[0] ? Object.keys(data[0]) : []), [data]);

  // sort state (start with no key so it won't force "id")
  const [sort, setSort] = useState<Sort>({ key: null, dir: "asc" });
  // small sorter ui state
  const [sortCol, setSortCol] = useState<string>(""); // "" = none selected
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");

  const locale = localeFromCurrency(currency);
  const currencyFmt = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency }),
    [locale, currency]
  );
  const numberFmt = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    [locale]
  );

  // auto-detect money columns by name if not provided
  const moneyCols = useMemo(() => {
    if (moneyColumns?.length) return new Set(moneyColumns);
    const pattern =
      /(valor|pre(ç|c)o|price|amount|total|cust|custo|receita|despesa|saldo)/i;
    return new Set(cols.filter((k) => pattern.test(k)));
  }, [moneyColumns, cols]);

  const getColTitle = (k: string) =>
    tableHeadersMap?.[k] ?? columnLabels?.find((c) => c.key === k)?.label ?? k;

  // Derived: sorted data
  const sorted = useMemo(() => {
    if (!sort.key) return filteredData;
    return [...filteredData].sort((a, b) =>
      compareDataType(a[sort.key!], b[sort.key!], sort.dir)
    );
  }, [filteredData, sort]);

  // Header click sorting (key + dir toggle) and keep small-sorter in sync
  const toggleSort = (k: string) => {
    setSort((s) => {
      const nextDir: "asc" | "desc" =
        s.key !== k ? "asc" : s.dir === "asc" ? "desc" : "asc";
      setSortCol(k);
      setSortDir(nextDir);
      return { key: k, dir: nextDir };
    });
  };

  // Small sorter: change key
  const onChangeSortCol = (k: string) => {
    setSortCol(k);
    if (k) setSort({ key: k, dir: sortDir });
    else setSort({ key: null, dir: "asc" });
  };

  // Small sorter: change dir
  const onClickDir = (dir: "asc" | "desc") => {
    setSortDir(dir);
    if (sortCol) setSort({ key: sortCol, dir });
  };

  // Filtering
  const handleFilterChange = useCallback(() => {
    const MIN = 3;
    if (search.trim().length < MIN) {
      setFilteredData(data);
      onFiltersChange?.({ search: "" });
      return;
    }
    const q = search.toLowerCase();
    setFilteredData(
      data.filter((row) =>
        cols.some((col) =>
          String(row[col] ?? "")
            .toLowerCase()
            .includes(q)
        )
      )
    );
    onFiltersChange?.({ search });
  }, [search, data, onFiltersChange, cols]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <div className="w-full rounded-xl border border-foreground/10 bg-background text-foreground shadow-sm">
      {/* Search + Small Sorter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <div
          className={clsx(
            "flex items-center gap-3 text-xs sm:text-sm",
            searchClassName
          )}
        >
          {showSearch && (
            <SearchInput
              placeholder="Filtrar..."
              search={search}
              setSearch={setSearch}
            />
          )}
        </div>

        {/* A–Z / Z–A controls */}
        {cols.length > 0 && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <label className="text-foreground/70">Ordenar por</label>
            <select
              className="h-8 rounded-md border border-foreground/15 bg-background px-2 text-sm"
              value={sortCol}
              onChange={(e) => onChangeSortCol(e.target.value)}
            >
              <option value="">—</option>
              {cols.map((c) => (
                <option key={c} value={c}>
                  {getColTitle(c)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={clsx(
                "h-8 rounded-md border border-foreground/15 bg-background px-2 inline-flex items-center gap-1",
                sortDir === "asc" && "bg-foreground/10"
              )}
              onClick={() => onClickDir("asc")}
              title="A–Z"
            >
              <SortAscendingIcon size={14} />
              A–Z
            </button>
            <button
              type="button"
              className={clsx(
                "h-8 rounded-md border border-foreground/15 bg-background px-2 inline-flex items-center gap-1",
                sortDir === "desc" && "bg-foreground/10"
              )}
              onClick={() => onClickDir("desc")}
              title="Z–A"
            >
              <SortDescendingIcon size={14} />
              Z–A
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <table
          className={clsx(
            "w-full border-t border-foreground/10",
            tableClassName
          )}
        >
          <thead>
            <tr>
              {cols.map((k) => {
                const isSorted = sort.key === k;
                const SortIcon =
                  isSorted && sort.dir === "asc"
                    ? CaretDownIcon
                    : isSorted
                    ? CaretUpIcon
                    : null;

                return (
                  <th
                    key={k}
                    className={clsx(
                      "min-w-[160px] px-2 py-2 text-left text-xs sm:text-sm font-semibold",
                      "bg-background sticky top-0 border-b border-foreground/10",
                      headerClassName
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(k)}
                      className="inline-flex items-center gap-2 hover:opacity-90"
                      title="Ordenar"
                    >
                      <span className="truncate">{getColTitle(k)}</span>
                      {SortIcon ? <SortIcon size={14} /> : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Zebra striping */}
          <tbody className="divide-y divide-foreground/10">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={cols.length}
                  className="py-10 text-center text-sm text-foreground/60"
                >
                  Sem registros.
                </td>
              </tr>
            ) : (
              sorted.map((row, ri) => (
                <tr
                  key={ri}
                  className={clsx(
                    "hover:bg-foreground/[0.04]",
                    stripped && "odd:bg-foreground/[0.02]",
                    !!onSeeItemDetails && "cursor-pointer"
                  )}
                  onClick={() => onSeeItemDetails?.(row)}
                >
                  {cols.map((k) => {
                    const raw = row[k];
                    const asNum = parseNumberSoft(raw);
                    const isMoney = moneyCols.has(k);

                    return (
                      <td key={k} className="px-2 py-2 text-xs sm:text-sm">
                        {isMoney
                          ? asNum == null
                            ? ""
                            : currencyFmt.format(asNum)
                          : typeof raw === "number"
                          ? numberFmt.format(raw)
                          : String(raw ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && paginationData && (
        <div
          className={clsx(
            "flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 border-t border-foreground/10",
            paginationClassName
          )}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-foreground/70">Mostrar</span>
            <select
              className="h-8 rounded-md border border-foreground/15 bg-background px-2 text-sm"
              value={paginationData.pageSize}
              onChange={(e) => onValueTotalChange?.(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} items por página
                </option>
              ))}
            </select>
            <span className="text-foreground/60 ml-2">
              {paginationData.totalItems.toLocaleString("pt-BR")} itens
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-foreground/10 disabled:opacity-40"
              disabled={
                paginationData.totalPages <= 1 ||
                paginationData.currentPage <= 1
              }
              onClick={() => onValuePageChange?.(1)}
              aria-label="Primeira página"
            >
              <CaretDoubleLeftIcon size={16} />
            </button>
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-foreground/10 disabled:opacity-40"
              disabled={
                paginationData.totalPages <= 1 ||
                paginationData.currentPage <= 1
              }
              onClick={() =>
                onValuePageChange?.(paginationData.currentPage - 1)
              }
              aria-label="Página anterior"
            >
              <CaretLeftIcon size={16} />
            </button>

            <span className="mx-2 text-xs sm:text-sm">
              Página <b>{paginationData.currentPage}</b> de{" "}
              <b>{paginationData.totalPages}</b>
            </span>

            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-foreground/10 disabled:opacity-40"
              disabled={
                paginationData.totalPages <= 1 ||
                paginationData.currentPage >= paginationData.totalPages
              }
              onClick={() =>
                onValuePageChange?.(paginationData.currentPage + 1)
              }
              aria-label="Próxima página"
            >
              <CaretRightIcon size={16} />
            </button>
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-foreground/10 disabled:opacity-40"
              disabled={
                paginationData.totalPages <= 1 ||
                paginationData.currentPage >= paginationData.totalPages
              }
              onClick={() => onValuePageChange?.(paginationData.totalPages)}
              aria-label="Última página"
            >
              <CaretDoubleRightIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

