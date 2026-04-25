"use client";

// DonutChart.tsx
import clsx from "clsx";
import React from "react";
import {
  Cell as RCell,
  Legend as RLegend,
  Pie as RPie,
  PieChart as RPieChart,
  ResponsiveContainer as RResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";

/* =========================
   Tipos base e utilidades
========================= */

export type DonutPoint = {
  label: string;
  value: number;
  color?: string; // opcional: cor por fatia
  [key: string]: unknown;
};

type Size = "xs" | "sm" | "md" | "lg";

const heightMap: Record<Size, number> = {
  xs: 160,
  sm: 220,
  md: 280,
  lg: 340,
};

export type DonutChartData = DonutPoint[];

export type ValueFormatter = (v: number) => string;
export type LabelFormatter = (l: string) => string;

/* =========================
   Tooltip padrão (dark-mode)
========================= */
type PayloadValue = {
  value: string | number | null;
  name?: string;
  payload?: DonutPoint;
};

interface DefaultTooltipProps {
  active?: boolean;
  payload?: PayloadValue[];
  label?: string | number;
  valueFormatter?: ValueFormatter;
  labelFormatter?: LabelFormatter;
}

export function DefaultTooltip({
  active,
  payload,
  valueFormatter,
  labelFormatter,
}: DefaultTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const pv = payload[0];
  const v =
    pv && typeof pv.value === "number" && valueFormatter
      ? valueFormatter(pv.value)
      : String(pv?.value ?? "--");
  const l =
    pv && pv.payload?.label
      ? labelFormatter
        ? labelFormatter(pv.payload.label)
        : pv.payload.label
      : "";

  return (
    <div
      className={clsx(
        "rounded-lg border border-foreground/15 shadow-lg",
        "bg-background/95 backdrop-blur px-3 py-2",
        "text-foreground text-xs sm:text-sm"
      )}
    >
      <div className="font-medium">{v}</div>
      {l ? <div className="text-foreground/70">{l}</div> : null}
    </div>
  );
}


/* =========================
   Root
========================= */

export interface DonutChartRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Dados: [{ label, value, color? }] */
  data: DonutChartData;

  /** Dimensão */
  size?: Size;
  width?: number | string;
  height?: number;
  responsive?: boolean;

  /** Chaves (caso use nomes diferentes) */
  labelKey?: string; // default: "label"
  valueKey?: string; // default: "value"

  /** Raio interno/externo do donut (px) */
  innerRadius?: number | string; // ex.: 60, "60%"
  outerRadius?: number | string; // ex.: 90, "90%"

  /** Gap entre setores */
  padAngle?: number;

  /** Tooltip */
  showTooltip?: boolean;
  customTooltip?: unknown;

  /** Legenda (título da série – opcional; se omitido, legenda mostra rótulos das fatias) */
  legendTitle?: string;
  showLegend?: boolean;

  /** Formatadores */
  valueFormatter?: ValueFormatter;
  labelFormatter?: LabelFormatter;

  /** Paleta fallback (usada quando item não tem color) */
  colors?: string[];

  /** Centro (texto) */
  showCenterTotal?: boolean;
  centerTotalFormatter?: ValueFormatter;
  centerLabel?: string;

  /** Classes */
  className?: string;
  chartClassName?: string;
}

export default function DonutChart({
  data,
  size = "md",
  width = "100%",
  height,
  responsive = true,
  labelKey = "label",
  valueKey = "value",
  innerRadius = "60%",
  outerRadius = "85%",
  padAngle = 2,
  showTooltip = true,
  customTooltip,
  legendTitle,
  showLegend = true,
  valueFormatter,
  labelFormatter,
  colors = [
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#22d3ee",
    "#84cc16",
  ],
  showCenterTotal = true,
  centerTotalFormatter,
  centerLabel,
  className,
  chartClassName,
  children,
  ...rest
}: DonutChartRootProps) {
  const computedHeight = height ?? heightMap[size];

  const total = React.useMemo(
    () =>
      data.reduce((acc, it) => {
        const n = Number((it as never)[valueKey] ?? 0);
        return acc + (Number.isFinite(n) ? n : 0);
      }, 0),
    [data, valueKey]
  );

  const LegendContent = React.useCallback(
    (props: { payload?: Array<{ color: string; value: string }> }) => {
      const payload = props.payload ?? [];
      if (payload.length === 0) return null;
      return (
        <div className="px-2">
          {legendTitle && (
            <div className="text-xs sm:text-sm text-foreground/70 mb-1 ml-10">
              {legendTitle}
            </div>
          )}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-foreground text-xs sm:text-sm ml-10">
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
        </div>
      );
    },
    [legendTitle]
  );

  const pieCX = "50%";
  const pieCY = "50%";

  const Chart = (
    <RPieChart className={chartClassName}>
      {/* Tooltip */}
      {showTooltip && (
        <RTooltip
          isAnimationActive={false}
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
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
          itemStyle={{ color: "var(--foreground)", fontSize: 12 }}
          // Deixamos o tooltip default com formatters via componente custom
          content={
            (customTooltip as never) ?? (
              <DefaultTooltip
                valueFormatter={valueFormatter}
                labelFormatter={labelFormatter}
              />
            )
          }
        />
      )}

      {/* Legenda */}
      {showLegend && (
        <RLegend
          verticalAlign="top"
          height={40}
          content={LegendContent as never}
        />
      )}

      <RPie
        data={data}
        dataKey={valueKey}
        nameKey={labelKey}
        cx={pieCX}
        cy={pieCY}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        paddingAngle={padAngle}
        stroke="var(--background)"
        strokeWidth={2}
        isAnimationActive={false}
      >
        {data.map((entry, index) => (
          <RCell
            key={`cell-${index}`}
            fill={entry.color ?? colors[index % colors.length]}
            style={{ border: "none", outline: "none" }}
          />
        ))}
      </RPie>

      {/* Centro: total e rótulo */}
      {showCenterTotal && (
        <>
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            className="fill-current"
            style={{ fill: "currentColor", fontSize: 14, opacity: 0.8 }}
          >
            {centerLabel ?? "Total"}
          </text>
          <text
            x="50%"
            y="62%"
            textAnchor="middle"
            className="fill-current"
            style={{
              fill: "currentColor",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {centerTotalFormatter
              ? centerTotalFormatter(total)
              : total.toLocaleString("pt-BR")}
          </text>
        </>
      )}

      {children}
    </RPieChart>
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

