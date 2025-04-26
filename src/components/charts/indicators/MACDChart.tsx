
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

interface MACDChartProps {
  data: any[];
  color?: string;
}

const MACDChart: React.FC<MACDChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="MACD" stroke={color} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Signal" stroke="#ff7300" dot={false} />
        <Line type="monotone" dataKey="Histogram" stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MACDChart;
