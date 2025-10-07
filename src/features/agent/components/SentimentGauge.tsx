import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import type { LabelProps } from "recharts";

export type SentimentGaugeProps = {
  value: number;
  color?: string;
  backgroundColor?: string;
};

export default function SentimentGauge({ value, color = "#69b1ff", backgroundColor = "#e9ecef" }: SentimentGaugeProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const pieProps = {
    startAngle: 180,
    endAngle: 0,
    innerRadius: 60,
    outerRadius: 95,
    dataKey: "value" as const,
    stroke: "none",
  };

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          {...pieProps}
          data={[{ name: "value", value: clampedValue }, { name: "rest", value: 100 - clampedValue }]}
          isAnimationActive
        >
          <Cell fill={color} />
          <Cell fill={backgroundColor} />
          <Label
            position="center"
            content={({ viewBox }: LabelProps) => {
              if (!viewBox) return null;

              const {
                cx,
                cy,
                x,
                y,
                width,
                height,
                outerRadius: viewBoxOuterRadius,
              } = viewBox as LabelProps["viewBox"] & {
                cx?: number;
                cy?: number;
                x?: number;
                y?: number;
                width?: number;
                height?: number;
                outerRadius?: number;
              };

              const centerX = typeof cx === "number"
                ? cx
                : typeof x === "number" && typeof width === "number"
                  ? x + width / 2
                  : undefined;
              const centerY = typeof cy === "number"
                ? cy
                : typeof y === "number" && typeof height === "number"
                  ? y + height / 2
                  : undefined;

              if (typeof centerX !== "number" || typeof centerY !== "number") {
                return null;
              }

              const outerRadius = typeof viewBoxOuterRadius === "number" ? viewBoxOuterRadius : pieProps.outerRadius;
              const startAngle = pieProps.startAngle;
              const endAngle = pieProps.endAngle;
              const RAD = Math.PI / 180;
              const angle = startAngle + ((endAngle - startAngle) * clampedValue) / 100;

              const tickAngles = [0, 25, 50, 75, 100].map(
                (tick) => startAngle + ((endAngle - startAngle) * tick) / 100
              );

              const ticks = tickAngles.map((tickAngle, index) => {
                const inner = outerRadius + 2;
                const outer = outerRadius + 10;
                const x1 = centerX + inner * Math.cos(tickAngle * RAD);
                const y1 = centerY - inner * Math.sin(tickAngle * RAD);
                const x2 = centerX + outer * Math.cos(tickAngle * RAD);
                const y2 = centerY - outer * Math.sin(tickAngle * RAD);
                return <line key={`tick-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#bfbfbf" strokeWidth={2} />;
              });

              const needleRadius = outerRadius + 8;
              const needleX = centerX + needleRadius * Math.cos(angle * RAD);
              const needleY = centerY - needleRadius * Math.sin(angle * RAD);

              return (
                <g>
                  {ticks}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={needleX}
                    y2={needleY}
                    stroke="#525B66"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <circle cx={centerX} cy={centerY} r={6} fill="#525B66" />
                </g>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
