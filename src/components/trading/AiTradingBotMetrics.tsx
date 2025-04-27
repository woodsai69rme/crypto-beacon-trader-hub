
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart, LineChart, PieChart } from "lucide-react";

interface AiTradingBotMetricsProps {
  botId: string;
  isRunning: boolean;
}

const AiTradingBotMetrics: React.FC<AiTradingBotMetricsProps> = ({ botId, isRunning }) => {
  const [metrics, setMetrics] = useState({
    winRate: 68,
    profitFactor: 1.85,
    sharpeRatio: 1.42,
    maxDrawdown: 15,
    totalTrades: 125,
    profitableTrades: 85,
    losingTrades: 40,
    avgProfit: 3.2,
    avgLoss: 1.8,
    performance: 42,
  });
  
  useEffect(() => {
    // Simulate metrics updates when bot is running
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setMetrics(prevMetrics => {
          // Generate small random fluctuations to simulate live updates
          const winRateChange = (Math.random() * 4) - 2; // -2 to +2
          const newWinRate = Math.max(50, Math.min(85, prevMetrics.winRate + (winRateChange * 0.2)));
          
          // Recalculate derived metrics
          const profitableTrades = Math.round((prevMetrics.totalTrades * newWinRate) / 100);
          const losingTrades = prevMetrics.totalTrades - profitableTrades;
          
          return {
            ...prevMetrics,
            winRate: parseFloat(newWinRate.toFixed(1)),
            profitFactor: parseFloat((prevMetrics.profitFactor + (Math.random() * 0.1 - 0.05)).toFixed(2)),
            sharpeRatio: parseFloat((prevMetrics.sharpeRatio + (Math.random() * 0.1 - 0.05)).toFixed(2)),
            maxDrawdown: parseFloat((prevMetrics.maxDrawdown + (Math.random() * 0.5 - 0.25)).toFixed(1)),
            profitableTrades,
            losingTrades,
            performance: Math.min(100, Math.max(0, prevMetrics.performance + (Math.random() * 4 - 2))),
          };
        });
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  if (!botId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select an AI bot to view metrics
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Bot Performance</div>
                    <div className="text-2xl font-bold">+{metrics.performance.toFixed(1)}%</div>
                  </div>
                  <div>
                    <LineChart className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <Progress value={metrics.performance} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-lg font-medium">{metrics.winRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Profit Factor</div>
                    <div className="text-lg font-medium">{metrics.profitFactor}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    <div className="text-2xl font-bold text-amber-500">-{metrics.maxDrawdown}%</div>
                  </div>
                  <div>
                    <Activity className="h-10 w-10 text-amber-500" />
                  </div>
                </div>
                
                <Progress value={metrics.maxDrawdown} className="h-2 bg-amber-100" />
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    <div className="text-lg font-medium">{metrics.sharpeRatio}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Risk Status</div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 mt-1">
                      Low Risk
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Performance Chart</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Chart placeholder */}
                <div className="h-[200px] w-full bg-muted/20 rounded-md relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Trading performance chart</div>
                  </div>
                  
                  {/* Simple mock chart line */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M0,150 C50,120 100,180 150,100 C200,80 250,130 300,70 C350,50 400,90 450,30 C500,20 550,60 600,10"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trades">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Trade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-4">
                  <PieChart className="h-20 w-20 text-primary" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-green-500">{metrics.profitableTrades}</div>
                    <div className="text-sm text-muted-foreground">Profitable</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-red-500">{metrics.losingTrades}</div>
                    <div className="text-sm text-muted-foreground">Losing</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Win/Loss Ratio</div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(metrics.profitableTrades / metrics.totalTrades) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>Win: {((metrics.profitableTrades / metrics.totalTrades) * 100).toFixed(1)}%</div>
                    <div>Loss: {((metrics.losingTrades / metrics.totalTrades) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit/Loss Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Profit</div>
                    <div className="text-lg font-medium text-green-500">+{metrics.avgProfit}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Loss</div>
                    <div className="text-lg font-medium text-red-500">-{metrics.avgLoss}%</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Average Profit/Loss Ratio</div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {(metrics.avgProfit / metrics.avgLoss).toFixed(2)}:1 ratio
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Trade Duration</div>
                  <div className="flex justify-between">
                    <Badge variant="outline">Short (38%)</Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary">Medium (48%)</Badge>
                    <Badge variant="outline">Long (14%)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-2 bg-muted/50 text-sm font-medium">
                    <div>Time</div>
                    <div>Pair</div>
                    <div>Type</div>
                    <div>Size</div>
                    <div className="text-right">P/L</div>
                  </div>
                  
                  <div className="max-h-[200px] overflow-y-auto">
                    {[...Array(5)].map((_, i) => {
                      const isProfit = Math.random() > 0.3;
                      const pair = ["BTC/USD", "ETH/USD", "SOL/USD"][Math.floor(Math.random() * 3)];
                      const type = Math.random() > 0.5 ? "BUY" : "SELL";
                      const profit = isProfit 
                        ? (Math.random() * 3 + 0.5).toFixed(2) 
                        : (-Math.random() * 2 - 0.2).toFixed(2);
                      return (
                        <div key={i} className="grid grid-cols-5 p-2 border-t">
                          <div className="text-xs text-muted-foreground">
                            {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                          </div>
                          <div>{pair}</div>
                          <div className={type === "BUY" ? "text-green-500" : "text-red-500"}>{type}</div>
                          <div>0.{Math.floor(Math.random() * 9) + 1} {pair.split('/')[0]}</div>
                          <div className={`text-right ${isProfit ? "text-green-500" : "text-red-500"}`}>
                            {isProfit ? "+" : ""}{profit}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="risk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Drawdown Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Drawdown</div>
                      <div className="text-lg font-medium">-{(metrics.maxDrawdown * 0.6).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Max Drawdown</div>
                      <div className="text-lg font-medium">-{metrics.maxDrawdown}%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Drawdown Timeline</div>
                    <div className="h-[150px] w-full bg-muted/20 rounded-md relative overflow-hidden">
                      {/* Simple mock chart for drawdown */}
                      <svg className="absolute inset-0 w-full h-full">
                        <path
                          d="M0,10 C50,30 100,50 150,70 C200,100 250,120 300,80 C350,60 400,40 450,90 C500,110 550,90 600,70"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-medium">Recovery Time</div>
                      <div className="text-muted-foreground">4.2 days</div>
                    </div>
                    <div>
                      <div className="font-medium">Avg Drawdown</div>
                      <div className="text-muted-foreground">-5.8%</div>
                    </div>
                    <div>
                      <div className="font-medium">Drawdowns</div>
                      <div className="text-muted-foreground">8 total</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      <div className="text-lg font-medium">{metrics.sharpeRatio}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Sortino Ratio</div>
                      <div className="text-lg font-medium">2.1</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Calmar Ratio</div>
                      <div className="text-lg font-medium">1.8</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Beta</div>
                      <div className="text-lg font-medium">0.75</div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2">Risk Assessment</div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '65%' }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs">Low Risk</div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Good
                      </Badge>
                      <div className="text-xs">High Risk</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Management Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">Max Trade Size</div>
                    <div className="text-lg">5% <span className="text-xs text-muted-foreground">of balance</span></div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">Stop Loss</div>
                    <div className="text-lg">2.5% <span className="text-xs text-muted-foreground">per trade</span></div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">Take Profit</div>
                    <div className="text-lg">5% <span className="text-xs text-muted-foreground">per trade</span></div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">Max Open Positions</div>
                    <div className="text-lg">5 <span className="text-xs text-muted-foreground">simultaneous</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiTradingBotMetrics;
