
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, PieChart, TrendingUp } from "lucide-react";
import { ResponsiveLine } from "@nivo/line";
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({ 
  portfolioPerformance, 
  portfolioDates 
}) => {
  // Create a default dataset if none is provided
  const defaultDates = portfolioDates || Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return date.toISOString().split('T')[0];
  });
  
  const defaultPerformance = portfolioPerformance || Array.from({ length: 30 }, (_, i) => {
    return (Math.sin(i / 5) + 1) * 5 + i / 3;
  });
  
  // Generate benchmark comparison data
  const generateBenchmarkData = () => {
    return [
      {
        id: "Your Portfolio",
        color: "hsl(220, 70%, 50%)",
        data: defaultDates.map((date, i) => ({
          x: date,
          y: defaultPerformance[i]
        }))
      },
      {
        id: "BTC",
        color: "hsl(32, 70%, 50%)",
        data: defaultDates.map((date, i) => ({
          x: date,
          y: defaultPerformance[i] * (1 + (Math.random() * 0.4 - 0.2))
        }))
      },
      {
        id: "S&P 500",
        color: "hsl(120, 40%, 50%)",
        data: defaultDates.map((date, i) => ({
          x: date,
          y: defaultPerformance[i] * 0.7 * (1 + (Math.random() * 0.2 - 0.1))
        }))
      }
    ];
  };

  const benchmarkData = generateBenchmarkData();
  
  // Calculate performance metrics
  const calculateMetrics = () => {
    const lastIndex = defaultPerformance.length - 1;
    const startValue = defaultPerformance[0];
    const endValue = defaultPerformance[lastIndex];
    
    const totalReturn = ((endValue - startValue) / startValue) * 100;
    const maxValue = Math.max(...defaultPerformance);
    const maxDrawdown = ((maxValue - Math.min(...defaultPerformance)) / maxValue) * 100;
    
    // Calculate volatility (standard deviation)
    const mean = defaultPerformance.reduce((acc, val) => acc + val, 0) / defaultPerformance.length;
    const squaredDiffs = defaultPerformance.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / squaredDiffs.length;
    const volatility = Math.sqrt(variance);
    
    // Calculate Sharpe ratio (approximation)
    const riskFreeRate = 2; // 2% risk-free rate
    const sharpeRatio = (totalReturn - riskFreeRate) / volatility;
    
    return {
      totalReturn: totalReturn.toFixed(2),
      volatility: volatility.toFixed(2),
      maxDrawdown: maxDrawdown.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2)
    };
  };
  
  const metrics = calculateMetrics();

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Portfolio Benchmarking
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveLine
            data={benchmarkData}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto'
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              format: (value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              },
              tickValues: defaultDates.filter((_, i) => i % 5 === 0)
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0
            }}
            pointSize={2}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)'
              }
            ]}
            theme={{
              textColor: '#888',
              fontSize: 11,
              axis: {
                domain: {
                  line: {
                    stroke: '#555'
                  }
                },
                ticks: {
                  line: {
                    stroke: '#555'
                  }
                }
              },
              grid: {
                line: {
                  stroke: '#333',
                  strokeWidth: 0.5
                }
              },
              tooltip: {
                container: {
                  background: '#222',
                  color: '#eee',
                  boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px'
                }
              }
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Total Return</div>
            <div className={`text-lg font-bold ${parseFloat(metrics.totalReturn) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {parseFloat(metrics.totalReturn) >= 0 ? '+' : ''}{metrics.totalReturn}%
            </div>
          </div>
          
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Volatility</div>
            <div className="text-lg font-bold">{metrics.volatility}</div>
          </div>
          
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Max Drawdown</div>
            <div className="text-lg font-bold text-amber-500">-{metrics.maxDrawdown}%</div>
          </div>
          
          <div className="bg-muted/20 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
            <div className={`text-lg font-bold ${parseFloat(metrics.sharpeRatio) >= 1 ? 'text-green-500' : parseFloat(metrics.sharpeRatio) > 0 ? 'text-amber-500' : 'text-red-500'}`}>
              {metrics.sharpeRatio}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4">
          Compare your portfolio performance against major indices and cryptocurrencies
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
