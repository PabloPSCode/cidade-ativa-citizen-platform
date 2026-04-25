/* eslint-disable react-hooks/refs */
"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchInput from "./components/SearchInput";
import { compareDataType, formatCurrency, type Currency } from "../../../utils/format";
import {
  ArrowsLeftRightIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  ChecksIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  SquareIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DND_TYPE = "COLUMN";
const STORAGE_KEY = "completeTableCols";

export type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

export type CountableColumn = {
  name: string;
  isMonetary?: boolean;
  labelReplacer?: string;
};

export interface CompleteTableProps {
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
  /** Dados de paginação (controlado externamente) */
  paginationData?: PaginationData;
  /** Callback chamado quando o usuário clica em uma linha (ver detalhes) */
  onSeeItemDetails?: (row: Record<string, any>) => void;
  /** Callback chamado quando o usuário reordena as colunas (drag & drop) */
  onColumnsChange?: (cols: string[]) => void;
  /** Salva a ordem das colunas no localStorage (default: true) */
  saveColumnsOrder?: boolean; // default true
  /** Callback chamado quando o usuário aplica filtros/busca */
  onFiltersChange?: (filters: Record<string, any>) => void;
  /** Callback chamado quando o usuário seleciona/desseleciona linhas */
  onSelectedRowsChange?: (rows: Record<string, any>[]) => void;
  /** Mostra controles de paginação abaixo da tabela (default: true) */
  showPagination?: boolean;
  /** Mostra campo de busca (default: true) */
  showSearch?: boolean;
  /** Colunas que devem ser somadas (ex: para mostrar total selecionado) */
  countableColumnsName: CountableColumn[];
  /** Código da moeda para formatação (default: "BRL") */
  currency?: Currency;
  /** Remove/aplica o estilo zebra (default: true) */
  stripped?: boolean;
  /** Classe CSS customizada para a tabela */
  tableClassName?: string;
  /** Classe CSS customizada para o cabeçalho (th) */
  headerClassName?: string;
  /** Classe CSS customizada para a barra de busca, seleção e totais */
  searchClassName?: string;
  /** Classe CSS customizada para a área de paginação */
  paginationClassName?: string;
}

/* -------------------- utils -------------------- */
type Sort = { key: string | null; dir: "asc" | "desc" };

const num = (v: any) =>
  typeof v === "number"
    ? v
    : Number(
        String(v)
          .replace(/[^\d,-]/g, "")
          .replace(",", ".")
      ) || 0;



/* -------------------- Draggable TH -------------------- */
type DraggableTHProps = {
  colKey: string;
  title: string;
  index: number;
  sort: Sort;
  onSort: (key: string) => void;
  move: (from: number, to: number) => void;
  onDragState?: (dragIndex: number | null) => void;
  isActive?: boolean;
  headerClassName?: string;
};

function DraggableTH({
  colKey,
  title,
  index,
  sort,
  onSort,
  move,
  onDragState,
  isActive,
  headerClassName,
}: DraggableTHProps) {
  const ref = useRef<HTMLTableCellElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPE,
      item: { index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [index]
  );

  const [, drop] = useDrop({
    accept: DND_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const rect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (rect.right - rect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientX = clientOffset.x - rect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      move(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  useEffect(() => {
    onDragState?.(isDragging ? index : null);
  }, [isDragging, index, onDragState]);

  drag(drop(ref));

  const isSorted = sort.key === colKey;
  const SortIcon =
    isSorted && sort.dir === "asc"
      ? CaretDownIcon
      : isSorted
      ? CaretUpIcon
      : ArrowsLeftRightIcon;

  return (
    <th
      ref={ref}
      className={clsx(
        "min-w-[160px] px-2 py-2 text-left text-xs sm:text-sm font-semibold",
        "bg-background sticky top-0 border-b border-foreground/10",
        "cursor-grab select-none",
        (isDragging || isActive) && "bg-foreground/[0.08] shadow-inner",
        headerClassName
      )}
    >
      <button
        type="button"
        onClick={() => onSort(colKey)}
        className="inline-flex items-center gap-2 hover:opacity-90"
        title="Ordenar / Arrastar"
      >
        <span className="truncate">{title}</span>
        <SortIcon size={14} />
      </button>
    </th>
  );
}


/* ------------------------- Component --------------------------- */
export default function CompleteTable({
  data,
  tableHeadersMap,
  columnLabels,
  onValuePageChange,
  onValueTotalChange,
  paginationData,
  onSeeItemDetails,
  onColumnsChange,
  saveColumnsOrder = true,
  onSelectedRowsChange,
  showPagination = true,
  countableColumnsName,
  showSearch = true,
  onFiltersChange,
  currency = "BRL",
  stripped = true,
  tableClassName,
  headerClassName,
  searchClassName,
  paginationClassName,
}: CompleteTableProps) {
  const initialCols = useMemo(() => {
    const storedCols = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      Array.isArray(storedCols) &&
      storedCols.every((v) => typeof v === "string") &&
      storedCols.length > 0
    ) {
      const valid = storedCols.filter((k) => k in (data[0] || {}));
      if (valid.length > 0) return valid;
    }
    return data[0] ? Object.keys(data[0]) : [];
  }, [data]);

  const [cols, setCols] = useState<string[]>(initialCols);
  const [sort, setSort] = useState<Sort>({ key: null, dir: "asc" });

  const [sortCol, setSortCol] = useState<string>(""); // "" means none selected yet
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // helper for titles
  const getColTitle = useCallback(
    (k: string) =>
      tableHeadersMap?.[k] ??
      columnLabels?.find((c) => c.key === k)?.label ??
      k,
    [tableHeadersMap, columnLabels]
  );

  // ---------- selection (stable ids) ----------
  const idKey = useMemo(() => {
    const candidateKeys = ["id", "codigo", "code", "uuid", "key"];
    const sample = data[0] ?? {};
    const found = candidateKeys.find((k) => k in sample);
    return found ?? candidateKeys[0];
  }, [data]);

  const getId = useCallback(
    (row: Record<string, any>) => {
      const v = row?.[idKey];
      return v ?? JSON.stringify(row);
    },
    [idKey]
  );

  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());

  useEffect(() => {
    if (!onSelectedRowsChange) return;
    const rows = data.filter((r) => selectedIds.has(getId(r)));
    onSelectedRowsChange(rows);
  }, [data, selectedIds, onSelectedRowsChange, getId]);

  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");
  const [draggingCol, setDraggingCol] = useState<number | null>(null);

  // INIT saved order
  useEffect(() => {
    if (!saveColumnsOrder) {
      setCols(initialCols);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setCols(initialCols);
        return;
      }
      const saved: unknown = JSON.parse(raw);
      if (!Array.isArray(saved) || !saved.every((v) => typeof v === "string")) {
        setCols(initialCols);
        return;
      }
      const filtered = (saved as string[]).filter((k) =>
        initialCols.includes(k)
      );
      const newOnes = initialCols.filter((k) => !filtered.includes(k));
      setCols([...filtered, ...newOnes]);
    } catch {
      setCols(initialCols);
    }
  }, [initialCols, saveColumnsOrder]);

  // SAVE order
  useEffect(() => {
    if (!saveColumnsOrder) return;
    const valid = cols.every((k) => initialCols.includes(k));
    if (valid) localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
  }, [cols, initialCols, saveColumnsOrder]);

  useEffect(() => onColumnsChange?.(cols), [cols, onColumnsChange]);

  // sorting
  const sorted = useMemo(() => {
    if (!sort.key) return filteredData;
    return [...filteredData].sort((a, b) =>
      compareDataType(a[sort.key!], b[sort.key!], sort.dir)
    );
  }, [filteredData, sort]);

  // header click sort (sync with small sorter)
  const toggleSort = (k: string) =>
    setSort((s) => {
      const nextDir: "asc" | "desc" =
        s.key !== k ? "asc" : s.dir === "asc" ? "desc" : "asc";
      setSortCol(k);
      setSortDir(nextDir);
      return { key: k, dir: nextDir };
    });

  // small sorter handlers
  const onChangeSortCol = (k: string) => {
    setSortCol(k);
    if (k) setSort({ key: k, dir: sortDir });
    else setSort({ key: null, dir: "asc" });
  };
  const onClickDir = (dir: "asc" | "desc") => {
    setSortDir(dir);
    if (sortCol) setSort({ key: sortCol, dir });
  };

  // selection helpers
  const allChecked =
    sorted.length > 0 && sorted.every((r) => selectedIds.has(getId(r)));
  const toggleAll = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) sorted.forEach((r) => next.delete(getId(r)));
      else sorted.forEach((r) => next.add(getId(r)));
      return next;
    });
  const toggleRow = (row: any) =>
    setSelectedIds((prev) => {
      const id = getId(row);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // currency & sums
  const localeString =
    currency === "USD" ? "en-US" : currency === "EUR" ? "de-DE" : "pt-BR";

  const sums = useMemo(
    () =>
      countableColumnsName.map((c) => {
        const total = data
          .filter((r) => selectedIds.has(getId(r)))
          .reduce((acc, r) => acc + num(r[c.name]), 0);
        const value = c.isMonetary
          ? total.toLocaleString(localeString, { style: "currency", currency })
          : total.toLocaleString(localeString);
        return { key: c.name, label: c.labelReplacer ?? c.name, value };
      }),
    [countableColumnsName, data, localeString, currency, selectedIds, getId]
  );

  // filter
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

  // money columns set (from countableColumnsName.isMonetary)
  const moneyCols = useMemo(
    () =>
      new Set(
        (countableColumnsName ?? [])
          .filter((c) => c.isMonetary)
          .map((c) => c.name)
      ),
    [countableColumnsName]
  );

  const parseNumber = (v: any) => {
    if (v == null || v === "") return null;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    const n = Number(
      String(v)
        .replace(/[^\d,-]/g, "")
        .replace(",", ".")
    );
    return Number.isFinite(n) ? n : null;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full rounded-xl border border-foreground/10 bg-background text-foreground shadow-sm">
        {/* Top bar: Selection/Search + NEW sorter */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          {/* Left: selection count + search */}
          <div
            className={clsx(
              "flex items-center gap-3 text-xs sm:text-sm",
              searchClassName
            )}
          >
            <span
              className={
                selectedIds.size ? "font-medium" : "text-foreground/60"
              }
            >
              {selectedIds.size}
            </span>{" "}
            selecionado(s)
            {showSearch && (
              <SearchInput
                placeholder="Filtrar..."
                search={search}
                setSearch={setSearch}
              />
            )}
          </div>

          {/* Right: sums + sorter */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            {/* sums */}
            {sums.map(({ key, label, value }) => (
              <span key={key} className="text-foreground/80">
                <span className="font-medium">{label}:</span> {value}
              </span>
            ))}

            {/* NEW: Sorter (matches your screenshot) */}
            {cols.length > 0 && (
              <div className="flex items-center gap-2 rounded-md px-2 py-1">
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
                <th
                  className={clsx(
                    "sticky top-0 bg-background border-b border-foreground/10 w-10 px-2",
                    headerClassName
                  )}
                >
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-foreground/10"
                    onClick={toggleAll}
                    aria-label={allChecked ? "Desmarcar todos" : "Marcar todos"}
                  >
                    {allChecked ? (
                      <ChecksIcon size={16} />
                    ) : (
                      <SquareIcon size={16} />
                    )}
                  </button>
                </th>
                {cols.map((k, i) => (
                  <DraggableTH
                    key={k}
                    colKey={k}
                    title={getColTitle(k)}
                    index={i}
                    sort={sort}
                    onSort={toggleSort}
                    move={(from, to) =>
                      setCols((prev) => {
                        if (
                          from === to ||
                          from < 0 ||
                          to < 0 ||
                          from >= prev.length ||
                          to >= prev.length
                        )
                          return prev;
                        const next = [...prev];
                        next.splice(to, 0, next.splice(from, 1)[0]);
                        return next;
                      })
                    }
                    onDragState={setDraggingCol}
                    isActive={draggingCol === i}
                    headerClassName={headerClassName}
                  />
                ))}
              </tr>
            </thead>

            {/* Zebra striping + drag highlight */}
            <tbody className="divide-y divide-foreground/10">
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={cols.length + 1}
                    className="py-10 text-center text-sm text-foreground/60"
                  >
                    Sem registros.
                  </td>
                </tr>
              ) : (
                sorted.map((row) => {
                  const selected = selectedIds.has(getId(row));
                  return (
                    <tr
                      key={String(getId(row))}
                      className={clsx(
                        "hover:bg-foreground/[0.04]",
                        stripped && "odd:bg-foreground/[0.02]",
                        !!onSeeItemDetails && "cursor-pointer"
                      )}
                      onClick={() => onSeeItemDetails?.(row)}
                    >
                      <td
                        className="px-2 py-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => toggleRow(row)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-foreground/10"
                          aria-pressed={selected}
                          aria-label="Selecionar linha"
                        >
                          {selected ? (
                            <ChecksIcon size={16} />
                          ) : (
                            <SquareIcon size={16} />
                          )}
                        </button>
                      </td>

                      {cols.map((k, ci) => (
                        <td
                          key={k}
                          className={clsx(
                            "px-2 py-2 text-xs sm:text-sm",
                            draggingCol === ci && "bg-foreground/[0.06]"
                          )}
                        >
                          {(() => {
                            const raw = row[k];
                            if (moneyCols.has(k)) {
                              const n = parseNumber(raw);
                              return n == null
                                ? ""
                                : formatCurrency(n, localeString, currency);
                            }
                            if (typeof raw === "number")
                              return raw.toLocaleString(localeString);
                            return String(raw ?? "");
                          })()}
                        </td>
                      ))}
                    </tr>
                  );
                })
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
    </DndProvider>
  );
}

