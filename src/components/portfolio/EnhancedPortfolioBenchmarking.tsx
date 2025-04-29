
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveLine } from '@nivo/line';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioPerformance,
  portfolioDates
}) => {
  // Format data for the chart
  const chartData = [
    {
      id: 'Portfolio',
      color: 'hsl(var(--primary))',
      data: portfolioPerformance.map((value, index) => ({
        x: portfolioDates[index] || `Day ${index + 1}`,
        y: value
      }))
    },
    {
      id: 'BTC',
      color: '#F7931A',
      data: portfolioDates.map((date, index) => ({
        x: date,
        y: Math.random() * 100 - 20 // Random benchmark data
      }))
    },
    {
      id: 'S&P 500',
      color: '#0066CC',
      data: portfolioDates.map((date, index) => ({
        x: date,
        y: Math.random() * 30 // Random benchmark data
      }))
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance Benchmarking</CardTitle>
        <CardDescription>
          Compare your portfolio performance against major benchmarks
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendOffset: 45,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Return (%)',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            lineWidth={2}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: 'var(--text-primary)'
                  }
                },
                legend: {
                  text: {
                    fill: 'var(--text-primary)'
                  }
                }
              },
              grid: {
                line: {
                  stroke: 'var(--border-color)',
                  strokeWidth: 1
                }
              },
              legends: {
                text: {
                  fill: 'var(--text-primary)'
                }
              },
              tooltip: {
                container: {
                  background: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                }
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
