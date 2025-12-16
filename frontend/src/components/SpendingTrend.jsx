import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function SpendingTrend({ expenses }) {
  if (!expenses || expenses.length === 0) return null;

  // Group by date
  const dateMap = {};

  expenses.forEach(exp => {
    const date = new Date(exp.date).toLocaleDateString();
    dateMap[date] = (dateMap[date] || 0) + Number(exp.amount);
  });

  const data = Object.keys(dateMap).map(date => ({
    date,
    amount: dateMap[date]
  }));

  return (
    <div className="card">
      <h4>Spending Trend</h4>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingTrend;
