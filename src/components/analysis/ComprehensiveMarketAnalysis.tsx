
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CoinOption, CryptoData } from "@/types/trading";
import { 
  BarChart3, 
  LineChart, 
  Candlestick, 
  TrendingUp, 
  Calendar, 
  RefreshCw, 
  Download,
  Share2
} from "lucide-react";
import MarketCorrelations from '../MarketCorrelations';
import FibonacciAnalysis from '../trading/FibonacciAnalysis';
import HyblockLiquidityMap from '../trading/HyblockLiquidityMap';
import PatternRecognition from '../trading/PatternRecognition';

interface ComprehensiveMarketAnalysisProps {
  initialCoin?: CoinOption;
  initialTimeframe?: string;
}

const ComprehensiveMarketAnalysis: React.FC<ComprehensiveMarketAnalysisProps> = ({ 
  initialCoin,
  initialTimeframe = '1D'
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoin?.id || 'bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(initialTimeframe);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const timeframes = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '4h', label: '4 hours' },
    { value: '1D', label: '1 day' },
    { value: '1W', label: '1 week' },
    { value: '1M', label: '1 month' }
  ];
  
  const symbols = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'solana', label: 'Solana (SOL)' },
    { value: 'cardano', label: 'Cardano (ADA)' },
    { value: 'ripple', label: 'XRP (XRP)' },
    { value: 'polkadot', label: 'Polkadot (DOT)' }
  ];
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  const handleDownload = () => {
    alert('Analysis report download started');
  };
  
  const handleShare = () => {
    alert('Sharing options opened');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Comprehensive Market Analysis
        </CardTitle>
        <CardDescription>
          Deep analytical insights to inform your trading decisions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1 min-w-[180px] flex-1">
            <label className="text-sm font-medium">Trading Pair</label>
            <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbols.map(symbol => (
                  <SelectItem key={symbol.value} value={symbol.value}>
                    {symbol.label}
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
                {timeframes.map(timeframe => (
                  <SelectItem key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Candlestick className="h-4 w-4" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="correlations" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Correlations
            </TabsTrigger>
            <TabsTrigger value="market-levels" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Market Levels
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Technical Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Trend Direction</div>
                        <div className="text-xl font-semibold text-green-500">Bullish</div>
                        <div className="text-xs text-muted-foreground">Multiple timeframe alignment</div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">Trend Strength</div>
                        <div className="text-xl font-semibold">72%</div>
                        <div className="text-xs text-muted-foreground">Above average strength</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Key Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">RSI (14)</span>
                          <span className="text-sm font-medium">62 - Neutral</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">MACD</span>
                          <span className="text-sm font-medium text-green-500">Bullish Crossover</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Moving Averages</span>
                          <span className="text-sm font-medium text-green-500">9 Buy, 3 Sell</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Bollinger Bands</span>
                          <span className="text-sm font-medium">Neutral</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Volume Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">24h Volume</span>
                          <span className="text-sm font-medium">$3.8B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Volume MA (20)</span>
                          <span className="text-sm font-medium text-green-500">+18.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">OBV Trend</span>
                          <span className="text-sm font-medium text-green-500">Rising</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Support & Resistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Key Resistance Levels</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">R3: $64,800</span>
                          <div className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Strong</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">R2: $63,200</span>
                          <div className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded">Medium</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">R1: $62,500</span>
                          <div className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded">Medium</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-green-50 dark:bg-green-900/20">
                      <h4 className="text-sm font-medium mb-2">Current Price</h4>
                      <div className="text-xl font-bold">$62,150.45</div>
                      <div className="text-xs text-green-700 dark:text-green-400">Between S1 and R1</div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Key Support Levels</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">S1: $61,800</span>
                          <div className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded">Medium</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">S2: $60,500</span>
                          <div className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Strong</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">S3: $58,900</span>
                          <div className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Strong</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Pivot Points</h4>
                      <div className="text-sm">Current Pivot: $61,950</div>
                      <div className="text-xs text-muted-foreground mt-1">Daily pivot point calculation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-6">
            <PatternRecognition />
          </TabsContent>
          
          <TabsContent value="correlations" className="space-y-6">
            <MarketCorrelations />
          </TabsContent>
          
          <TabsContent value="market-levels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FibonacciAnalysis symbol={`${symbols.find(s => s.value === selectedCoinId)?.label?.split(' ')[0]}/USD`} timeframe={selectedTimeframe} />
              <HyblockLiquidityMap symbol={`${symbols.find(s => s.value === selectedCoinId)?.label?.split(' ')[0]}/USD`} timeframe={selectedTimeframe} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveMarketAnalysis;
