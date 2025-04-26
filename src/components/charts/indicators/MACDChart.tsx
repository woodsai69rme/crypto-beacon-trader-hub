
import React from "react";
import BaseIndicatorChart from "./BaseIndicatorChart";

interface MACDChartProps {
  data: any[];
  color?: string;
}

const MACDChart: React.FC<MACDChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <BaseIndicatorChart
      data={data}
      lines={[
        {
          key: "MACD",
          color: color,
          dot: { r: 8 },
        },
        {
          key: "Signal",
          color: "#ff7300",
          dot: false,
        },
        {
          key: "Histogram",
          color: "#82ca9d",
          dot: false,
        },
      ]}
    />
  );
};

export default MACDChart;
