import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMontyHallContext } from "../context/useMontyHallContext";
import { THEORETICAL_SWITCH_WIN_RATE, THEORETICAL_STAY_WIN_RATE } from "../consts";

function calculateStep(total: number): number {
  if (total <= 50) return 1;
  if (total <= 200) return 5;
  if (total <= 1000) return 10;
  if (total <= 5000) return 50;

  return 100;
}

const WinRateChart = () => {
  const { history } = useMontyHallContext();

  const { data, tickInterval } = useMemo(() => {
    if (history.length === 0) return { data: [], tickInterval: 1 };

    let switchWins = 0;
    let switchTotal = 0;
    let stayWins = 0;
    let stayTotal = 0;

    const sorted = [...history].sort((a, b) => a.id - b.id);
    const points = sorted.map((entry, i) => {
      if (entry.doSwitch) {
        switchTotal++;
        if (entry.won) switchWins++;
      } else {
        stayTotal++;
        if (entry.won) stayWins++;
      }

      return {
        game: i + 1,
        switchRate: switchTotal > 0 ? parseFloat(((switchWins / switchTotal) * 100).toFixed(1)) : null,
        stayRate: stayTotal > 0 ? parseFloat(((stayWins / stayTotal) * 100).toFixed(1)) : null,
      };
    });

    return { data: points, tickInterval: calculateStep(history.length) };
  }, [history]);

  if (history.length === 0) return null;

  return (
    <section className="win-rate-chart">
      <h2>Zbieżność do wartości teoretycznych</h2>
      <p className="win-rate-chart__desc">
        Wykres pokazuje, jak wraz ze wzrostem liczby rozegranych gier procent zwycięstw dla obu strategii zbliża się do
        wartości przewidzianych matematycznie ({THEORETICAL_SWITCH_WIN_RATE}% przy zmianie pierwotnego wyboru,{" "}
        {THEORETICAL_STAY_WIN_RATE}% przy pozostaniu przy pierwotnym wyborze).
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" />
          <XAxis
            dataKey="game"
            type="number"
            domain={[0, "dataMax"]}
            interval={tickInterval - 1}
            tick={{ fontSize: 11, fill: "var(--c-text-muted)" }}
            label={{
              value: "Liczba gier",
              position: "insideBottom",
              offset: 8,
              fontSize: 11,
              fill: "var(--c-text-muted)",
            }}
            height={40}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "var(--c-text-muted)" }}
            width={42}
          />
          <Tooltip
            formatter={(value) => [`${value}%`]}
            labelFormatter={(label) => `Gra nr ${label}`}
            contentStyle={{
              background: "var(--c-surface)",
              border: "1px solid var(--c-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.82rem",
            }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: "0.82rem", paddingBottom: "8px" }} />
          <ReferenceLine y={THEORETICAL_SWITCH_WIN_RATE} stroke="#2e7d32" strokeDasharray="6 3" strokeOpacity={0.5} />
          <ReferenceLine y={THEORETICAL_STAY_WIN_RATE} stroke="#81c784" strokeDasharray="6 3" strokeOpacity={0.5} />
          <Line
            type="monotone"
            dataKey="switchRate"
            name="Zmiana wyboru"
            stroke="#2e7d32"
            dot={false}
            strokeWidth={2}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="stayRate"
            name="Pozostanie"
            stroke="#81c784"
            dot={false}
            strokeWidth={2}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default WinRateChart;
