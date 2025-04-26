
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
} from "recharts";

interface MovingAverageChartProps {
  data: any[];
  color?: string;
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Price" stroke="#ff7300" dot={false} />
        <Line type="monotone" dataKey="MA7" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="MA25" stroke={color} dot={false} />
        <Line type="monotone" dataKey="MA99" stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MovingAverageChart;
