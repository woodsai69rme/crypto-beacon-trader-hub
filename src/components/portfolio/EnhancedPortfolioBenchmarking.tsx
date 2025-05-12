
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart2, ArrowRight, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { EnhancedPortfolioBenchmarkingProps, TradingAccount } from "@/types/trading";

const mockBenchmarks = [
  { id: "btc", name: "Bitcoin (BTC)" },
  { id: "eth", name: "Ethereum (ETH)" },
  { id: "total_market", name: "Total Market Cap" },
  { id: "s&p500", name: "S&P 500" },
  { id: "nasdaq", name: "NASDAQ" },
  { id: "gold", name: "Gold" }
];

const mockTimeframes = [
  { id: "7d", name: "7 Days" },
  { id: "30d", name: "30 Days" },
  { id: "90d", name: "90 Days" },
  { id: "180d", name: "180 Days" },
  { id: "1y", name: "1 Year" },
  { id: "all", name: "All Time" }
];

const mockPerformanceData = {
  portfolio: {
    name: "My Portfolio",
    performance: {
      "7d": 8.4,
      "30d": 15.2,
      "90d": 28.7,
      "180d": 42.1,
      "1y": 86.5,
      "all": 124.8
    },
    volatility: 0.12,
    maxDrawdown: 0.18,
    sharpeRatio: 1.8
  },
  benchmarks: {
    "btc": {
      name: "Bitcoin",
      performance: {
        "7d": 5.2,
        "30d": 12.8,
        "90d": 22.1,
        "180d": 38.4,
        "1y": 78.9,
        "all": 118.6
      },
      volatility: 0.18,
      maxDrawdown: 0.25,
      sharpeRatio: 1.5
    },
    "eth": {
      name: "Ethereum",
      performance: {
        "7d": 9.1,
        "30d": 16.7,
        "90d": 31.2,
        "180d": 47.5,
        "1y": 92.3,
        "all": 132.1
      },
      volatility: 0.21,
      maxDrawdown: 0.28,
      sharpeRatio: 1.6
    },
    "total_market": {
      name: "Total Market",
      performance: {
        "7d": 4.8,
        "30d": 11.5,
        "90d": 19.7,
        "180d": 32.8,
        "1y": 68.4,
        "all": 104.2
      },
      volatility: 0.15,
      maxDrawdown: 0.22,
      sharpeRatio: 1.4
    },
    "s&p500": {
      name: "S&P 500",
      performance: {
        "7d": 1.2,
        "30d": 2.8,
        "90d": 6.5,
        "180d": 12.4,
        "1y": 18.9,
        "all": 65.8
      },
      volatility: 0.06,
      maxDrawdown: 0.09,
      sharpeRatio: 1.1
    },
    "nasdaq": {
      name: "NASDAQ",
      performance: {
        "7d": 1.8,
        "30d": 3.5,
        "90d": 9.2,
        "180d": 15.7,
        "1y": 22.3,
        "all": 78.2
      },
      volatility: 0.08,
      maxDrawdown: 0.12,
      sharpeRatio: 1.2
    },
    "gold": {
      name: "Gold",
      performance: {
        "7d": 0.9,
        "30d": 2.2,
        "90d": 5.1,
        "180d": 8.4,
        "1y": 12.7,
        "all": 42.6
      },
      volatility: 0.04,
      maxDrawdown: 0.06,
      sharpeRatio: 0.9
    }
  }
};

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({ 
  portfolio, 
  benchmark = "btc",
  timeframe = "30d"
}) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState(benchmark);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  const portfolioPerformance = mockPerformanceData.portfolio.performance[selectedTimeframe as keyof typeof mockPerformanceData.portfolio.performance];
  const benchmarkData = mockPerformanceData.benchmarks[selectedBenchmark as keyof typeof mockPerformanceData.benchmarks];
  const benchmarkPerformance = benchmarkData.performance[selectedTimeframe as keyof typeof benchmarkData.performance];
  const performanceDifference = portfolioPerformance - benchmarkPerformance;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Portfolio Performance Benchmarking
        </CardTitle>
        <CardDescription>
          Compare your portfolio performance against market benchmarks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1 min-w-[180px] flex-1">
            <label className="text-sm font-medium">Benchmark</label>
            <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockBenchmarks.map(benchmark => (
                  <SelectItem key={benchmark.id} value={benchmark.id}>
                    {benchmark.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 min-w-[150px]">
            <label className="text-sm font-medium">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockTimeframes.map(timeframe => (
                  <SelectItem key={timeframe.id} value={timeframe.id}>
                    {timeframe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="icon" onClick={handleRefreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="h-60 border rounded-lg p-4 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center">
              <LineChart className="h-12 w-12 mb-2" />
              <p>Performance chart will render here</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Your Portfolio</div>
              <div className="text-2xl font-bold text-primary mt-1">
                {portfolioPerformance > 0 ? '+' : ''}{portfolioPerformance.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {mockPerformanceData.portfolio.name}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{benchmarkData.name}</div>
              <div className="text-2xl font-bold text-primary mt-1">
                {benchmarkPerformance > 0 ? '+' : ''}{benchmarkPerformance.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Selected benchmark
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Outperformance</div>
              <div className={`text-2xl font-bold mt-1 ${performanceDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {performanceDifference > 0 ? '+' : ''}{performanceDifference.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center">
                {performanceDifference >= 0 ? (
                  <><TrendingUp className="h-3 w-3 text-green-500 mr-1" /> Outperforming</>
                ) : (
                  <><TrendingDown className="h-3 w-3 text-red-500 mr-1" /> Underperforming</>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Risk (Volatility)</div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <div className="text-sm font-medium">Portfolio: {mockPerformanceData.portfolio.volatility * 100}%</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="text-sm font-medium">{benchmarkData.name}: {benchmarkData.volatility * 100}%</div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Max Drawdown</div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <div className="text-sm font-medium">Portfolio: {mockPerformanceData.portfolio.maxDrawdown * 100}%</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="text-sm font-medium">{benchmarkData.name}: {benchmarkData.maxDrawdown * 100}%</div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <div className="text-sm font-medium">Portfolio: {mockPerformanceData.portfolio.sharpeRatio.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="text-sm font-medium">{benchmarkData.name}: {benchmarkData.sharpeRatio.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Detailed Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPortfolioBenchmarking;
