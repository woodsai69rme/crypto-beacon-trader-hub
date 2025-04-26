
import React from "react";
import BaseIndicatorChart from "./BaseIndicatorChart";

interface BollingerBandsChartProps {
  data: any[];
  color?: string;
}

const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({ data, color = "#4f46e5" }) => {
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
          key: "Upper",
          color: "#8884d8",
          dot: false,
          strokeDasharray: "5 5",
        },
        {
          key: "Middle",
          color: color,
          dot: false,
        },
        {
          key: "Lower",
          color: "#8884d8",
          dot: false,
          strokeDasharray: "5 5",
        },
      ]}
    />
  );
};

export default BollingerBandsChart;
