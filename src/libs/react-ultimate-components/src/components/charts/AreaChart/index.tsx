"use client";

import clsx from "clsx";
import React from "react";
import {
  Area as RArea,
  AreaChart as RAreaChart,
  CartesianGrid as RCartesianGrid,
  Legend as RLegend,
  ReferenceLine as RReferenceLine,
  ResponsiveContainer as RResponsiveContainer,
  Tooltip as RTooltip,
  XAxis as RXAxis,
  YAxis as RYAxis,
} from "recharts";

/* =========================
   Tipos base e utilidades
========================= */

export type AreaPoint = {
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

export type AreaChartData = AreaPoint[];

export type ValueFormatter = (v: number) => string;
export type LabelFormatter = (l: string) => string;

/* =========================
   Tooltip padrão (dark-mode)
   - Tipado com TooltipProps<any, any> para compatibilidade ampla
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

export interface AreaChartRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Dados no formato genérico: [{ label, value }] */
  data: AreaChartData;

  /** Chaves */
  xKey?: string; // default: "label"
  yKey?: string; // default: "value"

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

  /** Legenda */
  legend?: string;

  /** Formatadores */
  valueFormatter?: ValueFormatter;
  labelFormatter?: LabelFormatter;

  /** Cores */
  color?: string;

  /** Classes */
  className?: string;
  chartClassName?: string;
}

function Root({
  data,
  xKey = "label",
  yKey = "value",
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
  className,
  chartClassName,
  children,
  ...rest
}: AreaChartRootProps) {
  const computedHeight = height ?? heightMap[size];

  const gradientId = React.useId();
  const fillColor = color ?? "var(--color-primary-500, #3b82f6)";
  const strokeColor = color ?? "var(--color-primary-600, #2563eb)";

  const LegendContent = React.useCallback(
    (props: { payload: Array<{ color: string; value: string }> }) => {
      const { payload } = props;
      if (!payload || payload.length === 0) return null;
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
    <RAreaChart
      data={data}
      className={chartClassName}
      margin={{ top: 16, right: 32, bottom: 16 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={fillColor} stopOpacity={0.35} />
          <stop offset="95%" stopColor={fillColor} stopOpacity={0.06} />
        </linearGradient>
      </defs>

      <RCartesianGrid
        vertical={false}
        strokeDasharray="3 3"
        stroke="currentColor"
        opacity={0.15}
      />

      <RXAxis
        dataKey={xKey}
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: "currentColor" }}
        tickFormatter={(v) =>
          labelFormatter ? labelFormatter(String(v)) : String(v)
        }
      />
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
          cursor={{ strokeOpacity: 0.2 }}
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
          /* If you pass a fully custom tooltip component, it'll override the default content above */
          content={customTooltip as never}
        />
      )}

      {legend && (
        <RLegend
          verticalAlign="top"
          height={36}
          content={LegendContent as never}
        />
      )}

      <RArea
        type="monotone"
        dataKey={yKey}
        stroke={strokeColor}
        fill={`url(#${gradientId})`}
        isAnimationActive
        strokeWidth={2}
        dot={{ r: 2 }}
        activeDot={{ r: 4 }}
        name={legend}
      />

      {children}
    </RAreaChart>
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
   - Use type aliases / inline types (evita “interface sem membros”)
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
  <RXAxis
    axisLine={false}
    tickLine={false}
    tick={{ fontSize: 12, fill: "currentColor" }}
    {...props}
  />
); }


function YAxis(props: React.ComponentProps<typeof RYAxis>) { return (
  <RYAxis
    axisLine={false}
    tickLine={false}
    tick={{ fontSize: 12, fill: "currentColor" }}
    {...props}
  />
); }


function Area(props: React.ComponentProps<typeof RArea>) { return (
  <RArea isAnimationActive strokeWidth={2} {...props} />
); }


function Tooltip(props: React.ComponentProps<typeof RTooltip>) { return (
  <RTooltip {...props} />
); }


function ReferenceLine(props: React.ComponentProps<typeof RReferenceLine>) { return <RReferenceLine {...props} />; }


/* =========================
   Namespace / export
========================= */

type AreaChartExtras = {
  Root: typeof Root;
  CartesianGrid: typeof CartesianGrid;
  XAxis: typeof XAxis;
  YAxis: typeof YAxis;
  Area: typeof Area;
  Tooltip: typeof Tooltip;
  ReferenceLine: typeof ReferenceLine;
};

function AreaChart(props: AreaChartRootProps) {
  return <Root {...props} />;
}

type AreaChartComponent = typeof AreaChart & AreaChartExtras;

const AreaChartComponent: AreaChartComponent = Object.assign(AreaChart, {
  Root,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  ReferenceLine,
});

export default AreaChartComponent;
