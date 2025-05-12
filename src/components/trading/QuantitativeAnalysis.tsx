import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe?: string;
}

interface AnalysisData {
  correlations: {
    value: number;
    description: string;
  }[];
  momentum: {
    rsi: number;
    macd: number;
    adx: number;
    interpretation: string;
  }[];
  volatility: {
    atr: number;
    bbands: string;
    interpretation: string;
  }[];
  efficiency: {
    sharpe: number;
    sortino: number;
    calmar: number;
    interpretation: string;
  }[];
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({ coinId, timeframe = "1D" }) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate fetching data from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockData: AnalysisData = {
          correlations: [
            { value: 0.75, description: "Positive correlation with Bitcoin" },
            { value: 0.62, description: "Positive correlation with Ethereum" },
            { value: 0.50, description: "Moderate correlation with S&P 500" },
          ],
          momentum: [
            { rsi: 68, macd: 42, adx: 30, interpretation: "Bullish momentum" },
            { rsi: 32, macd: -25, adx: 20, interpretation: "Bearish momentum" },
            { rsi: 50, macd: 5, adx: 45, interpretation: "Neutral momentum" },
          ],
          volatility: [
            { atr: 3.5, bbands: "Wide", interpretation: "High volatility" },
            { atr: 1.2, bbands: "Narrow", interpretation: "Low volatility" },
            { atr: 2.0, bbands: "Normal", interpretation: "Moderate volatility" },
          ],
          efficiency: [
            { sharpe: 1.2, sortino: 1.5, calmar: 0.8, interpretation: "Efficient performance" },
            { sharpe: 0.8, sortino: 0.9, calmar: 0.4, interpretation: "Average performance" },
            { sharpe: 0.5, sortino: 0.6, calmar: 0.2, interpretation: "Poor performance" },
          ],
        };

        setData(mockData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coinId, timeframe]);

  if (isLoading) {
    return <div>Loading analysis...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Correlations</h3>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.correlations?.[0]?.value || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.correlations?.[0]?.description || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ethereum Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.correlations?.[1]?.value || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.correlations?.[1]?.description || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>S&P 500 Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.correlations?.[2]?.value || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.correlations?.[2]?.description || "No data available"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Momentum Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>RSI (14)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.momentum?.[0]?.rsi || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.momentum?.[0]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>MACD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.momentum?.[1]?.macd || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.momentum?.[1]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>ADX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.momentum?.[2]?.adx || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.momentum?.[2]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Volatility</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ATR (14)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.volatility?.[0]?.atr || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.volatility?.[0]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bollinger Bands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.volatility?.[1]?.bbands || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.volatility?.[1]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implied Volatility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.volatility?.[2]?.atr || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.volatility?.[2]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Efficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sharpe Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.efficiency?.[0]?.sharpe || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.efficiency?.[0]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sortino Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.efficiency?.[1]?.sortino || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.efficiency?.[1]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calmar Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.efficiency?.[2]?.calmar || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {data?.efficiency?.[2]?.interpretation || "No data available"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuantitativeAnalysis;
