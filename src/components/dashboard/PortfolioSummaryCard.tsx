
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, ArrowUp, ArrowDown, DollarSign } from "lucide-react";
import { ResponsiveLine } from "@nivo/line";

interface PortfolioSummaryCardProps {
  totalValue: number;
  change24h: number;
  changePercent: number;
}

// Mock data for the chart
const generateChartData = () => {
  const data = [];
  const date = new Date();
  date.setDate(date.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    date.setDate(date.getDate() + 1);
    data.push({
      x: date.toISOString().split('T')[0],
      y: 30000 + Math.random() * 10000
    });
  }
  
  return [
    {
      id: "portfolio",
      data
    }
  ];
};

const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({
  totalValue,
  change24h,
  changePercent
}) => {
  const isPositive = change24h >= 0;
  const chartData = generateChartData();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Portfolio Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <h2 className="text-3xl font-bold">${totalValue.toLocaleString()}</h2>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="font-bold">${Math.abs(change24h).toLocaleString()}</span>
              <span className="text-sm">({changePercent.toFixed(2)}%)</span>
            </div>
            <p className="text-xs text-muted-foreground">24h Change</p>
          </div>
        </div>
        
        {/* Portfolio Chart */}
        <div className="h-[200px] mt-4">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto'
            }}
            curve="monotoneX"
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: 5,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: value => `$${value.toLocaleString()}`,
              tickValues: 5,
            }}
            lineWidth={3}
            pointSize={0}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableGridX={false}
            colors={[isPositive ? '#10b981' : '#ef4444']}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
            gridYValues={5}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 10,
                  }
                }
              },
              grid: {
                line: {
                  stroke: '#e2e8f0',
                  strokeWidth: 1,
                  strokeDasharray: '4 4'
                }
              },
              tooltip: {
                container: {
                  background: 'white',
                  color: 'black',
                  fontSize: 12,
                  borderRadius: 4,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }
              }
            }}
            tooltip={({ point }) => {
              return (
                <div className="bg-card border p-2 rounded-md shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">${Number(point.data.y).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{point.data.x}</div>
                </div>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummaryCard;
