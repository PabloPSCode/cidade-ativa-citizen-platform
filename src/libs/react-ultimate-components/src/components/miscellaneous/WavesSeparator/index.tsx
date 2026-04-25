import clsx from "clsx";
import type { CSSProperties } from "react";

export type WaveVariant =
  | "curved"
  | "sharped"
  | "squared"
  | "soft"
  | "tilted-left"
  | "tilted-right";

interface WaveShape {
  viewBox: string;
  path: string;
}

const WAVE_SHAPES: Record<WaveVariant, WaveShape> = {
  curved: {
    viewBox: "0 0 1200 120",
    path: "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
  },
  sharped: {
    viewBox: "0 0 1200 120",
    path: "M0,120V40L100,74L200,28L300,66L400,24L500,72L600,20L700,68L800,26L900,76L1000,32L1100,62L1200,40V120Z",
  },
  squared: {
    viewBox: "0 0 1200 120",
    path: "M0,120V60H120V32H240V68H360V40H480V76H600V44H720V82H840V50H960V74H1080V46H1200V120Z",
  },
  soft: {
    viewBox: "0 0 1200 120",
    path: "M0,120V52C75,84,150,84,225,52C300,20,375,20,450,52C525,84,600,84,675,52C750,20,825,20,900,52C975,84,1050,84,1125,52C1150,42,1175,42,1200,52V120Z",
  },
  "tilted-left": {
    viewBox: "0 0 1200 120",
    path: "M0,120V90L1200,20V120Z",
  },
  "tilted-right": {
    viewBox: "0 0 1200 120",
    path: "M0,120V20L1200,90V120Z",
  },
};

export interface WavesSeparatorProps {
  primaryColor?: string;
  backgroundColor?: string;
  variant?: WaveVariant;
  height?: number | string;
  className?: string;
  svgClassName?: string;
}
export default function WavesSeparator({
  primaryColor = "var(--color-primary-500)",
  backgroundColor = "var(--color-background)",
  variant = "curved",
  height = 80,
  className,
  svgClassName,
}: WavesSeparatorProps) {
  const waveShape = WAVE_SHAPES[variant];

  const containerStyle: CSSProperties = { backgroundColor: primaryColor };
  const svgStyle: CSSProperties = { height };
  const pathStyle: CSSProperties = { fill: backgroundColor };

  return (
    <div
      aria-hidden
      className={clsx("relative w-full overflow-hidden leading-none", className)}
      style={containerStyle}
    >
      <svg
        className={clsx("relative block w-[calc(100%+1.3px)]", svgClassName)}
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={waveShape.viewBox}
        preserveAspectRatio="none"
        style={svgStyle}
      >
        <path d={waveShape.path} style={pathStyle} />
      </svg>
    </div>
  );
}
