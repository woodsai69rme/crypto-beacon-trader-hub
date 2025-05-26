
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
  title?: string;
  data: any[];
  height?: number;
  margin?: { top: number; right: number; left: number; bottom: number };
  domain?: [number, number];
  dataKey?: string;
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
  title,
  data,
  height = 300,
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  domain,
  dataKey = "date",
  lines,
  referenceLines,
}) => {
  return (
    <div>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} />
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
    </div>
  );
};

export default BaseIndicatorChart;
