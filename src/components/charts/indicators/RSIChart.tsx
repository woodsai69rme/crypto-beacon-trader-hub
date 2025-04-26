
import React from "react";
import BaseIndicatorChart from "./BaseIndicatorChart";

interface RSIChartProps {
  data: any[];
  color?: string;
}

const RSIChart: React.FC<RSIChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <BaseIndicatorChart
      data={data}
      domain={[0, 100]}
      lines={[
        {
          key: "RSI",
          color: color,
          dot: { r: 8 },
        },
      ]}
      referenceLines={[
        {
          y: 70,
          stroke: "red",
          strokeDasharray: "3 3",
        },
        {
          y: 30,
          stroke: "green",
          strokeDasharray: "3 3",
        },
      ]}
    />
  );
};

export default RSIChart;
