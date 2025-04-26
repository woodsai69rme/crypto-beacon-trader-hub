
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

interface RSIChartProps {
  data: any[];
  color?: string;
}

const RSIChart: React.FC<RSIChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
        <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="RSI" stroke={color} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RSIChart;
