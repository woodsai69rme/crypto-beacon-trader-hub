
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AiTradingBotMetricsProps {
  botId: string;
  isRunning: boolean;
}

const AiTradingBotMetrics: React.FC<AiTradingBotMetricsProps> = ({ botId, isRunning }) => {
  const [metrics, setMetrics] = useState({
    accuracy: 68,
    winRate: 72,
    profitFactor: 1.85,
    sharpeRatio: 1.42,
    maxDrawdown: 12,
    totalTrades: 124,
    avgProfit: 2.8
  });
  
  const [monthlyPerformance, setMonthlyPerformance] = useState([
    { month: 'Jan', profit: 2.8 },
    { month: 'Feb', profit: -1.2 },
    { month: 'Mar', profit: 4.5 },
    { month: 'Apr', profit: 3.2 },
    { month: 'May', profit: -2.1 },
    { month: 'Jun', profit: 5.6 },
  ]);
  
  useEffect(() => {
    if (!isRunning) return;
    
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        accuracy: Math.min(100, prev.accuracy + (Math.random() * 2 - 1)),
        winRate: Math.min(100, prev.winRate + (Math.random() * 2 - 1)),
        profitFactor: Math.max(1, prev.profitFactor + (Math.random() * 0.2 - 0.1)),
        totalTrades: prev.totalTrades + 1
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Prediction Accuracy</div>
                <div className="text-sm">{metrics.accuracy.toFixed(1)}%</div>
              </div>
              <Progress value={metrics.accuracy} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Win Rate</div>
                <div className="text-sm">{metrics.winRate.toFixed(1)}%</div>
              </div>
              <Progress value={metrics.winRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Profit Factor</div>
                <div className="text-sm">{metrics.profitFactor.toFixed(2)}</div>
              </div>
              <Progress value={metrics.profitFactor * 20} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Sharpe Ratio</div>
                <div className="text-sm">{metrics.sharpeRatio.toFixed(2)}</div>
              </div>
              <Progress value={metrics.sharpeRatio * 20} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-xs text-muted-foreground">Total Trades</div>
                <div className="text-2xl font-bold">{metrics.totalTrades}</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-xs text-muted-foreground">Avg. Profit</div>
                <div className="text-2xl font-bold text-green-500">+{metrics.avgProfit}%</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Monthly Performance</div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value > 0 ? '+' : ''}${value.toFixed(1)}%`, 'Profit']}
                    labelFormatter={(label: string) => `Month: ${label}`}
                  />
                  <Bar dataKey="profit">
                    {monthlyPerformance.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.profit >= 0 ? '#10B981' : '#EF4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-xs text-muted-foreground text-center pt-2">
              Past performance is not indicative of future results
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotMetrics;
