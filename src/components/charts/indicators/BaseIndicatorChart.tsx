
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

export interface BaseIndicatorChartProps {
  data: any[];
  height?: number;
  margin?: { top: number; right: number; left: number; bottom: number };
  domain?: [number, number];
  lines: Array<{
    key: string;
    color: string;
    dot?: boolean | object;
    strokeDasharray?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter' | 'basis' | 'basisOpen' | 'basisClosed' | 'natural';
  }>;
  referenceLines?: Array<{
    y: number;
    stroke: string;
    strokeDasharray?: string;
    label?: string;
  }>;
}

const BaseIndicatorChart: React.FC<BaseIndicatorChartProps> = ({
  data,
  height = 300,
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  domain,
  lines,
  referenceLines,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis 
          tick={{ fontSize: 12 }} 
          domain={domain}
        />
        <Tooltip />
        <Legend />
        
        {referenceLines && referenceLines.map((refLine, index) => (
          <ReferenceLine 
            key={`refLine-${index}`}
            y={refLine.y} 
            stroke={refLine.stroke} 
            strokeDasharray={refLine.strokeDasharray || "3 3"} 
            label={refLine.label}
          />
        ))}
        
        {lines.map((line) => (
          <Line 
            key={line.key}
            type={line.type || "monotone"} 
            dataKey={line.key} 
            stroke={line.color} 
            dot={line.dot === undefined ? false : line.dot} 
            strokeDasharray={line.strokeDasharray}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BaseIndicatorChart;
