import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function WeightTrendChart({ history }) {
  const chartData = history
    .filter(
      (item) =>
        item.inputData?.Weight &&
        item.createdAt?.toDate
    )
    .map((item) => ({
      date: item.createdAt.toDate().toLocaleString(),
      weight: Number(item.inputData.Weight)
    }))
    .reverse();

  if (chartData.length < 2) {
    return (
      <section className="weight-chart-section">

        <div className="weight-chart-heading">
          <h2>Weight Trend</h2>

          <p>
            At least two predictions are needed to display a weight trend.
          </p>
        </div>

      </section>
    );
  }

  return (
    <section className="weight-chart-section">

      <div className="weight-chart-heading">
        <h2>Weight Trend</h2>

        <p>
          Your recorded weight across prediction history.
        </p>
      </div>

      <div className="weight-chart">

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.08)"
            />

            <XAxis
              dataKey="date"
              stroke="#7893a7"
              tick={{ fill: "#7893a7", fontSize: 11 }}
            />

            <YAxis
              stroke="#7893a7"
              tick={{ fill: "#7893a7", fontSize: 11 }}
              domain={["auto", "auto"]}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#4daee2"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </section>
  );
}

export default WeightTrendChart;