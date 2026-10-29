"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatIssue, type RankingPoint } from "@/lib/ranking";

type Props = {
  // 号の古い順に並べたもの
  points: RankingPoint[];
  pinch: boolean;
};

// F-05: 掲載順の推移。上ほど掲載順が前（Y軸を反転）
export function RankingChart({ points, pinch }: Props) {
  const data = points.map((point, i) => ({
    // 年が変わる所（と最初）だけ年を付ける
    label:
      i === 0 || points[i - 1].issue_year !== point.issue_year
        ? formatIssue(point)
        : `${point.issue_no}号`,
    issue: formatIssue(point),
    position: point.position,
  }));
  const color = pinch ? "var(--color-accent)" : "var(--color-ink)";

  return (
    <div className="h-64 w-full" role="img" aria-label="掲載順の推移グラフ">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 4, left: -16 }}
        >
          <CartesianGrid stroke="var(--color-tone)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "var(--color-ink-soft)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-ink)" }}
          />
          <YAxis
            reversed
            allowDecimals={false}
            domain={[1, "dataMax"]}
            tick={{ fontSize: 12, fill: "var(--color-ink-soft)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value}番目`, "掲載順"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload.issue ?? ""}
            contentStyle={{
              border: "2.5px solid var(--color-ink)",
              borderRadius: 0,
            }}
          />
          <Line
            type="linear"
            dataKey="position"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
