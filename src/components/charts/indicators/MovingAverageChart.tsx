
import React from "react";
import BaseIndicatorChart from "./BaseIndicatorChart";

interface MovingAverageChartProps {
  data: any[];
  color?: string;
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ data, color = "#4f46e5" }) => {
  return (
    <BaseIndicatorChart
      data={data}
      lines={[
        {
          key: "Price",
          color: "#ff7300",
          dot: false,
        },
        {
          key: "MA7",
          color: "#8884d8",
          dot: false,
        },
        {
          key: "MA25",
          color: color,
          dot: false,
        },
        {
          key: "MA99",
          color: "#82ca9d",
          dot: false,
        },
      ]}
    />
  );
};

export default MovingAverageChart;
