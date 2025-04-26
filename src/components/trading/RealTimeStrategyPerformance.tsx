
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpDown, 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Timer, 
  BarChart4, 
  Clock 
} from "lucide-react";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface StrategyPerformance {
  id: string;
  name: string;
  type: string;
  active: boolean;
  balance: number;
  initialBalance: number;
  trades: {
    total: number;
    wins: number;
    losses: number;
  };
  roi: number;
  todayRoi: number;
  lastTrade: string;
  chartData: {
    time: string;
    value: number;
  }[];
}

const RealTimeStrategyPerformance = () => {
  const { formatValue } = useCurrencyConverter();
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("24h");
  
  const [strategies, setStrategies] = useState<StrategyPerformance[]>([
    {
      id: "strategy-1",
      name: "AI Momentum",
      type: "Momentum",
      active: true,
      balance: 5243.87,
      initialBalance: 5000,
      trades: { total: 24, wins: 16, losses: 8 },
      roi: 4.88,
      todayRoi: 1.2,
      lastTrade: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      chartData: Array(24).fill(0).map((_, i) => ({
        time: `${i}h`,
        value: 5000 + Math.random() * 300 * (i / 4)
      }))
    },
    {
      id: "strategy-2",
      name: "Neural Trend Follower",
      type: "Trend",
      active: true,
      balance: 4875.35,
      initialBalance: 5000,
      trades: { total: 18, wins: 11, losses: 7 },
      roi: -2.49,
      todayRoi: -1.05,
      lastTrade: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      chartData: Array(24).fill(0).map((_, i) => ({
        time: `${i}h`,
        value: 5000 - Math.random() * 200 * (i / 5)
      }))
    },
    {
      id: "strategy-3",
      name: "ML Breakout Detector",
      type: "Breakout",
      active: true,
      balance: 6124.52,
      initialBalance: 5000,
      trades: { total: 32, wins: 24, losses: 8 },
      roi: 22.49,
      todayRoi: 3.41,
      lastTrade: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      chartData: Array(24).fill(0).map((_, i) => ({
        time: `${i}h`,
        value: 5000 + Math.random() * 400 * (i / 3)
      }))
    },
  ]);
  
  // Simulate real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStrategies(prevStrategies => 
        prevStrategies.map(strategy => {
          if (!strategy.active) return strategy;
          
          // Only sometimes make a trade
          const makeTrade = Math.random() > 0.7;
          if (!makeTrade) return strategy;
          
          // Simulate trade result
          const isWin = Math.random() > 0.4;
          const tradeAmount = strategy.balance * (Math.random() * 0.03 + 0.01);
          const tradeResult = isWin ? tradeAmount : -tradeAmount;
          const newBalance = strategy.balance + tradeResult;
          
          // Update chart data
          const newChartData = [...strategy.chartData];
          if (newChartData.length > 23) newChartData.shift();
          newChartData.push({
            time: new Date().getHours() + 'h',
            value: newBalance
          });
          
          // Calculate new metrics
          const newRoi = ((newBalance - strategy.initialBalance) / strategy.initialBalance) * 100;
          const newTrades = {
            total: strategy.trades.total + 1,
            wins: isWin ? strategy.trades.wins + 1 : strategy.trades.wins,
            losses: isWin ? strategy.trades.losses : strategy.trades.losses + 1
          };
          
          return {
            ...strategy,
            balance: newBalance,
            roi: newRoi,
            todayRoi: strategy.todayRoi + (isWin ? Math.random() * 0.8 : -Math.random() * 0.5),
            trades: newTrades,
            lastTrade: new Date().toISOString(),
            chartData: newChartData
          };
        })
      );
      
      setLastUpdated(new Date());
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  const getStrategyPerformance = (roi: number) => {
    if (roi >= 10) return "text-green-600 font-medium";
    if (roi > 0) return "text-green-500";
    if (roi > -10) return "text-red-500";
    return "text-red-600 font-medium";
  };
  
  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'Momentum': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Trend': return 'bg-purple-50 text-purple-700 border-purple-200'; 
      case 'Breakout': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ML': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const calculateWinRate = (wins: number, total: number) => {
    return total > 0 ? (wins / total) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5" />
              Strategy Performance
            </CardTitle>
            <CardDescription>
              Real-time performance monitoring of active AI strategies
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="text-xs flex items-center text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Updates every {refreshInterval}s
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead className="text-right">Today</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map(strategy => (
                  <TableRow key={strategy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{strategy.name}</div>
                        <Badge className={`mt-1 ${getBadgeColor(strategy.type)}`}>
                          {strategy.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatValue(strategy.balance)}
                    </TableCell>
                    <TableCell className={`text-right ${getStrategyPerformance(strategy.roi)}`}>
                      {strategy.roi >= 0 ? '+' : ''}{strategy.roi.toFixed(2)}%
                    </TableCell>
                    <TableCell className={`text-right ${strategy.todayRoi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {strategy.todayRoi >= 0 ? '+' : ''}{strategy.todayRoi.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {calculateWinRate(strategy.trades.wins, strategy.trades.total).toFixed(1)}%
                      <div className="text-xs text-muted-foreground">
                        ({strategy.trades.wins}/{strategy.trades.total})
                      </div>
                    </TableCell>
                    <TableCell>
                      {strategy.active ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Paused</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="charts">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Performance Tracking</h3>
                <div className="flex">
                  {['24h', '7d', '30d', 'all'].map((period) => (
                    <Button 
                      key={period}
                      variant={selectedTimeframe === period ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setSelectedTimeframe(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              
              {strategies.map(strategy => (
                <div key={strategy.id} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-medium">{strategy.name}</h4>
                      <div className="flex gap-2 items-center">
                        <Badge className={getBadgeColor(strategy.type)}>
                          {strategy.type}
                        </Badge>
                        <span className={`text-sm ${getStrategyPerformance(strategy.roi)}`}>
                          {strategy.roi >= 0 ? '+' : ''}{strategy.roi.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{formatValue(strategy.balance)}</div>
                      <div className="text-xs text-muted-foreground">
                        Last trade: {new Date(strategy.lastTrade).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={strategy.chartData}>
                        <defs>
                          <linearGradient id={`gradient-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop 
                              offset="5%" 
                              stopColor={strategy.roi >= 0 ? "#10B981" : "#EF4444"} 
                              stopOpacity={0.3}
                            />
                            <stop 
                              offset="95%" 
                              stopColor={strategy.roi >= 0 ? "#10B981" : "#EF4444"} 
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10 }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10 }} 
                          domain={['dataMin - 100', 'dataMax + 100']}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Balance']}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value"
                          stroke={strategy.roi >= 0 ? "#10B981" : "#EF4444"} 
                          fillOpacity={1}
                          fill={`url(#gradient-${strategy.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trades">
            <div className="space-y-2">
              {strategies.flatMap(strategy => 
                Array(3).fill(0).map((_, idx) => {
                  const minutesAgo = Math.floor(Math.random() * 60) + 1;
                  const isWin = Math.random() > 0.3;
                  const amount = (Math.random() * 0.005 + 0.001).toFixed(6);
                  const price = Math.floor(Math.random() * 5000) + 80000;
                  const coin = ['BTC', 'ETH', 'SOL'][Math.floor(Math.random() * 3)];
                  
                  return {
                    id: `trade-${strategy.id}-${idx}`,
                    strategyName: strategy.name,
                    strategyType: strategy.type,
                    coin,
                    type: isWin ? 'buy' : 'sell',
                    amount,
                    price,
                    timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
                    result: isWin ? 'win' : 'loss',
                    profit: isWin ? (Math.random() * 120 + 20).toFixed(2) : (-Math.random() * 80 - 10).toFixed(2)
                  };
                })
              )
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 10)
              .map(trade => (
                <div 
                  key={trade.id} 
                  className="bg-muted/40 p-3 rounded-md border"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={getBadgeColor(trade.strategyType)}>
                          {trade.strategyName}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={trade.type === 'buy' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                        >
                          {trade.type === 'buy' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {trade.type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="mt-1 text-sm">
                        {trade.amount} {trade.coin} @ ${trade.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={trade.result === 'win' ? 'text-green-600' : 'text-red-600'}>
                        {trade.result === 'win' ? '+' : ''}{trade.profit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <div className="flex gap-1">
            {[10, 30, 60].map(interval => (
              <Button 
                key={interval} 
                size="sm"
                variant={refreshInterval === interval ? "default" : "outline"}
                className="h-6 text-xs px-2"
                onClick={() => setRefreshInterval(interval)}
              >
                {interval}s
              </Button>
            ))}
          </div>
        </div>
        <div>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RealTimeStrategyPerformance;
