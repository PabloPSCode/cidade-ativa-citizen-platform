"use client";

// BarChart.tsx
import clsx from "clsx";
import React from "react";
import {
  Bar as RBar,
  BarChart as RBarChart,
  CartesianGrid as RCartesianGrid,
  Legend as RLegend,
  ReferenceLine as RReferenceLine,
  ResponsiveContainer as RResponsiveContainer,
  Tooltip as RTooltip,
  XAxis as RXAxis,
  YAxis as RYAxis,
  Cell as RCell,
} from "recharts";

/* =========================
   Tipos base e utilidades
========================= */

export type BarPoint = {
  label: string;
  value: number;
  [key: string]: unknown;
};

type Size = "xs" | "sm" | "md" | "lg";

const heightMap: Record<Size, number> = {
  xs: 140,
  sm: 200,
  md: 260,
  lg: 320,
};

export type BarChartData = BarPoint[];

export type ValueFormatter = (v: number) => string;
export type LabelFormatter = (l: string) => string;

/* =========================
   Tooltip padrão (dark-mode)
========================= */
type PayloadValue = {
  value: string | number | null;
  [key: string]: unknown;
};

interface DefaultTooltipProps {
  active?: boolean;
  payload?: PayloadValue[];
  label?: string | number;
}

export function DefaultTooltip({
  active,
  payload,
  label,
}: DefaultTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const pv = payload[0];
  return (
    <div
      className={clsx(
        "rounded-lg border border-foreground/15 shadow-lg",
        "bg-background/95 backdrop-blur px-3 py-2",
        "text-foreground text-xs sm:text-sm"
      )}
    >
      <div className="font-medium">
        {pv && pv.value !== null ? String(pv.value) : "--"}
      </div>
      <div className="text-foreground/70">{String(label)}</div>
    </div>
  );
}


/* =========================
   Root
========================= */

export interface BarChartRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Dados: [{ label, value }] */
  data: BarChartData;

  /** Chaves nos objetos de dados */
  xKey?: string; // default: "label"
  yKey?: string; // default: "value"

  /** Orientação: barras verticais (padrão) ou horizontais */
  horizontal?: boolean;

  /** Dimensão */
  size?: Size;
  width?: number | string;
  height?: number;

  /** Responsividade */
  responsive?: boolean;

  /** Tooltip */
  showTooltip?: boolean;
  /** Tooltip customizado (compatível com Recharts) */
  customTooltip?: unknown;

  /** Legenda (nome da série) */
  legend?: string;

  /** Formatadores */
  valueFormatter?: ValueFormatter;
  labelFormatter?: LabelFormatter;

  /** Estilo das barras */
  color?: string;          // cor principal
  barSize?: number;        // largura/altura da barra
  barRadius?: number | [number, number, number, number]; // raio dos cantos

  /** Classes */
  className?: string;
  chartClassName?: string;
}

function Root({
  data,
  xKey = "label",
  yKey = "value",
  horizontal = false,
  size = "md",
  width = "100%",
  height,
  responsive = true,
  showTooltip = true,
  legend,
  customTooltip,
  valueFormatter,
  labelFormatter,
  color,
  barSize = 14,
  barRadius = [4, 4, 0, 0],
  className,
  chartClassName,
  children,
  ...rest
}: BarChartRootProps) {
  const computedHeight = height ?? heightMap[size];
  const fillColor = color ?? "var(--color-primary-500, #3b82f6)";
  const strokeColor = color ?? "var(--color-primary-600, #2563eb)";

  const LegendContent = React.useCallback(
    (props: { payload?: Array<{ color: string; value: string }> }) => {
      const payload = props.payload ?? [];
      if (payload.length === 0) return null;
      return (
        <ul className="flex items-center gap-4 text-foreground text-xs sm:text-sm ml-10">
          {payload.map((it, i) => (
            <li key={i} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-4 rounded-sm"
                style={{ background: it.color }}
                aria-hidden
              />
              <span className="text-foreground">{it.value}</span>
            </li>
          ))}
        </ul>
      );
    },
    []
  );

  const Chart = (
    <RBarChart
      data={data}
      className={chartClassName}
      margin={{ top: 16, right: 32, bottom: 16 }}
      layout={horizontal ? "vertical" : "horizontal"}
    >
      <RCartesianGrid
        vertical={false}
        strokeDasharray="3 3"
        stroke="currentColor"
        opacity={0.15}
      />

      {/* Eixos dependem da orientação */}
      {horizontal ? (
        <>
          {/* Horizontal axis = valores numéricos (X) */}
          <RXAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickFormatter={(v) =>
              typeof v === "number" && valueFormatter
                ? valueFormatter(v)
                : String(v)
            }
          />
          {/* Vertical axis = categorias/labels (Y) */}
          <RYAxis
            dataKey={xKey}
            type="category"
            axisLine={false}
            tickLine={false}
            width={60}
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickFormatter={(v) =>
              labelFormatter ? labelFormatter(String(v)) : String(v)
            }
          />
        </>
      ) : (
        <>
          {/* Horizontal axis = categorias/labels (X) */}
          <RXAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickFormatter={(v) =>
              labelFormatter ? labelFormatter(String(v)) : String(v)
            }
          />
          {/* Vertical axis = valores numéricos (Y) */}
          <RYAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "currentColor" }}
            tickFormatter={(v) =>
              typeof v === "number" && valueFormatter
                ? valueFormatter(v)
                : String(v)
            }
          />
        </>
      )}

      {showTooltip && (
        <RTooltip
          labelFormatter={(l) =>
            labelFormatter ? labelFormatter(String(l)) : String(l)
          }
          formatter={(val, name) => {
            const value =
              typeof val === "number" && valueFormatter
                ? valueFormatter(val)
                : String(val);
            return [value, legend ?? name];
          }}
          cursor={{ fillOpacity: 0.06 }}
          wrapperStyle={{
            border: "none",
            outline: "none",
            background: "transparent",
            boxShadow: "none",
          }}
          contentStyle={{
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid rgba(127,127,127,0.18)",
            borderRadius: 8,
            padding: "8px 12px",
            backdropFilter: "blur(4px)",
          }}
          labelStyle={{
            color: "var(--foreground)",
            fontWeight: 600,
            marginBottom: 4,
          }}
          itemStyle={{
            color: "var(--foreground)",
            fontSize: 12,
            padding: 0,
            margin: 0,
          }}
          content={customTooltip as never}
        />
      )}

      {legend && (
        <RLegend verticalAlign="top" height={36} content={LegendContent as never} />
      )}

      <RBar
        dataKey={yKey}
        barSize={barSize}
        radius={barRadius as never}
        fill={fillColor}
        stroke={strokeColor}
        isAnimationActive
        name={legend}
      >
        {/* Permite highlight/cores dinâmicas se necessário no futuro */}
        {Array.isArray(data) &&
          data.map((_, idx) => <RCell key={`cell-${idx}`} />)}
      </RBar>

      {children}
    </RBarChart>
  );

  return (
    <div
      {...rest}
      className={clsx("w-full bg-transparent text-foreground", className)}
    >
      {responsive ? (
        <RResponsiveContainer width="100%" height={computedHeight}>
          {Chart}
        </RResponsiveContainer>
      ) : (
        <div style={{ width, height: computedHeight }}>{Chart}</div>
      )}
    </div>
  );
}


/* =========================
   Subcomponentes (proxies)
========================= */

function CartesianGrid(props: React.ComponentProps<typeof RCartesianGrid>) { return (
  <RCartesianGrid
    strokeDasharray="3 3"
    stroke="currentColor"
    opacity={0.15}
    {...props}
  />
); }


function XAxis(props: React.ComponentProps<typeof RXAxis>) { return (
  <RXAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor" }} {...props} />
); }


function YAxis(props: React.ComponentProps<typeof RYAxis>) { return (
  <RYAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor" }} {...props} />
); }


function Bar(props: React.ComponentProps<typeof RBar>) { return (
  <RBar isAnimationActive {...props} />
); }


function Tooltip(props: React.ComponentProps<typeof RTooltip>) { return (
  <RTooltip {...props} />
); }


function ReferenceLine(props: React.ComponentProps<typeof RReferenceLine>) { return <RReferenceLine {...props} />; }


/* =========================
   Namespace / export
========================= */

type BarChartExtras = {
  Root: typeof Root;
  CartesianGrid: typeof CartesianGrid;
  XAxis: typeof XAxis;
  YAxis: typeof YAxis;
  Bar: typeof Bar;
  Tooltip: typeof Tooltip;
  ReferenceLine: typeof ReferenceLine;
};

function BarChart(props: BarChartRootProps) {
  return <Root {...props} />;
}

type BarChartComponent = typeof BarChart & BarChartExtras;

const BarChartComponent: BarChartComponent = Object.assign(BarChart, {
  Root,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  ReferenceLine,
});

export default BarChartComponent;
