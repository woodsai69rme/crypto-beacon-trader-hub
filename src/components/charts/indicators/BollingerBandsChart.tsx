
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

interface BollingerBandsChartProps {
  data: any[];
  color?: string;
}

const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Price" stroke="#ff7300" dot={false} />
        <Line type="monotone" dataKey="Upper" stroke="#8884d8" dot={false} strokeDasharray="5 5" />
        <Line type="monotone" dataKey="Middle" stroke={color} dot={false} />
        <Line type="monotone" dataKey="Lower" stroke="#8884d8" dot={false} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BollingerBandsChart;
