
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchTechnicalIndicators } from "@/services/enhancedCryptoApi";
import { handleError } from "@/utils/errorHandling";
import ChartSkeleton from "./charts/indicators/ChartSkeleton";
import RSIChart from "./charts/indicators/RSIChart";
import MACDChart from "./charts/indicators/MACDChart";
import BollingerBandsChart from "./charts/indicators/BollingerBandsChart";
import MovingAverageChart from "./charts/indicators/MovingAverageChart";

interface TechnicalIndicatorChartProps {
  coinId: string;
  coinName: string;
  indicator: "RSI" | "MACD" | "Bollinger Bands" | "Moving Average";
  timeRange?: number; // In days
  color?: string;
}

const TechnicalIndicatorChart: React.FC<TechnicalIndicatorChartProps> = ({
  coinId,
  coinName,
  indicator,
  timeRange = 14,
  color = "#4f46e5"
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<number>(timeRange);
  
  // Description of each indicator
  const indicatorDescriptions = useMemo(() => ({
    "RSI": "Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. Values over 70 indicate overbought conditions, while values under 30 indicate oversold conditions.",
    "MACD": "Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.",
    "Bollinger Bands": "Bollinger Bands consist of a middle band being a moving average, and two outer bands that are standard deviations away from the middle band. They help identify volatility and potential overbought/oversold conditions.",
    "Moving Average": "Moving Averages smooth out price data to create a single flowing line, making it easier to identify the direction of the trend. They lag behind current price action, helping to confirm trends and potential support/resistance levels."
  }), []);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTechnicalIndicators(coinId, indicator);
        
        if (result && result.Data) {
          // Format data for chart based on indicator type
          let formattedData;
          
          switch (indicator) {
            case "RSI":
              formattedData = formatRsiData(result.Data);
              break;
            case "MACD":
              formattedData = formatMacdData(result.Data);
              break;
            case "Bollinger Bands":
              formattedData = formatBollingerData(result.Data);
              break;
            case "Moving Average":
              formattedData = formatMovingAverageData(result.Data);
              break;
            default:
              formattedData = [];
          }
          
          setData(formattedData.slice(-selectedRange));
        } else {
          setData([]);
        }
      } catch (error) {
        handleError(error, "error", "Technical Indicator");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [coinId, indicator, selectedRange]);
  
  // Format RSI data
  const formatRsiData = (rawData: any[]): any[] => {
    return rawData.map(item => ({
      date: new Date(item.time * 1000).toLocaleDateString(),
      RSI: item.RSI,
      overbought: 70,
      oversold: 30
    }));
  };
  
  // Format MACD data
  const formatMacdData = (rawData: any[]): any[] => {
    return rawData.map(item => ({
      date: new Date(item.time * 1000).toLocaleDateString(),
      MACD: item.MACD,
      Signal: item.Signal,
      Histogram: item.Histogram
    }));
  };
  
  // Format Bollinger Bands data
  const formatBollingerData = (rawData: any[]): any[] => {
    return rawData.map(item => ({
      date: new Date(item.time * 1000).toLocaleDateString(),
      Upper: item.UpperBand,
      Middle: item.MiddleBand,
      Lower: item.LowerBand,
      Price: item.Real
    }));
  };
  
  // Format Moving Average data
  const formatMovingAverageData = (rawData: any[]): any[] => {
    return rawData.map(item => ({
      date: new Date(item.time * 1000).toLocaleDateString(),
      Price: item.close,
      "MA7": item.MovingAverage7,
      "MA25": item.MovingAverage25,
      "MA99": item.MovingAverage99
    }));
  };
  
  const renderChart = () => {
    if (isLoading) {
      return <ChartSkeleton height={300} />;
    }
    
    if (data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available for {indicator}
        </div>
      );
    }
    
    switch (indicator) {
      case "RSI":
        return <RSIChart data={data} color={color} />;
      case "MACD":
        return <MACDChart data={data} color={color} />;
      case "Bollinger Bands":
        return <BollingerBandsChart data={data} color={color} />;
      case "Moving Average":
        return <MovingAverageChart data={data} color={color} />;
      default:
        return <div>Unsupported indicator</div>;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{indicator} - {coinName}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={selectedRange === 7 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedRange(7)}
            >
              7D
            </Button>
            <Button 
              variant={selectedRange === 14 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedRange(14)}
            >
              14D
            </Button>
            <Button 
              variant={selectedRange === 30 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedRange(30)}
            >
              30D
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {indicatorDescriptions[indicator] || "Technical indicator analysis"}
        </p>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicatorChart;
