
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import useRealTimeMarketData from '@/hooks/useRealTimeMarketData';
import AdvancedSortingFilters from './AdvancedSortingFilters';
import MobileOptimizedInterface from '@/components/mobile/MobileOptimizedInterface';
import { advancedOpenRouterService } from '@/services/ai/advancedOpenRouterService';
import { TrendingUp, TrendingDown, Bot, Zap, Target, AlertTriangle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

const EnhancedFakeTrading: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [tradingMode, setTradingMode] = useState<'manual' | 'ai'>('manual');
  const [aiSignals, setAiSignals] = useState<any[]>([]);
  const [isGeneratingSignals, setIsGeneratingSignals] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data: marketData, isConnected, lastUpdate } = useRealTimeMarketData({
    symbols: ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'chainlink'],
    updateInterval: 5000,
    enableWebSocket: true
  });

  const sortOptions = [
    { key: 'price', label: 'Price', type: 'number' as const },
    { key: 'changePercent', label: 'Change %', type: 'number' as const },
    { key: 'volume', label: 'Volume', type: 'number' as const },
    { key: 'marketCap', label: 'Market Cap', type: 'number' as const },
    { key: 'name', label: 'Name', type: 'string' as const }
  ];

  const filterOptions = [
    {
      key: 'price',
      label: 'Price Range',
      type: 'range' as const,
      min: 0,
      max: 100000
    },
    {
      key: 'changePercent',
      label: 'Change %',
      type: 'range' as const,
      min: -50,
      max: 50
    },
    {
      key: 'marketCap',
      label: 'Market Cap',
      type: 'range' as const,
      min: 0,
      max: 3000000000000
    }
  ];

  useEffect(() => {
    if (tradingMode === 'ai' && marketData.length > 0) {
      generateAISignals();
    }
  }, [tradingMode, marketData]);

  const generateAISignals = async () => {
    setIsGeneratingSignals(true);
    try {
      const signals = [];
      for (const asset of marketData.slice(0, 3)) {
        const signal = await advancedOpenRouterService.generateAdvancedTradingSignal(
          {
            symbol: asset.symbol,
            price: asset.price,
            volume: asset.volume,
            priceChange: asset.changePercent || 0,
            rsi: 45 + Math.random() * 20,
            macd: (Math.random() - 0.5) * 2
          },
          'trend-following',
          { riskTolerance: 'MEDIUM' }
        );
        signals.push({ ...signal, asset: asset.symbol });
      }
      setAiSignals(signals);
    } catch (error) {
      console.error('Failed to generate AI signals:', error);
    } finally {
      setIsGeneratingSignals(false);
    }
  };

  const handleDataChange = (newData: any[]) => {
    setFilteredData(newData);
  };

  const executeTrade = (signal: any) => {
    const amount = portfolioValue * 0.1; // Use 10% of portfolio
    console.log(`Executing ${signal.signal} trade for ${signal.asset} with $${amount}`);
    
    // Simulate portfolio change
    const change = signal.signal === 'BUY' ? amount * 0.02 : -amount * 0.02;
    setPortfolioValue(prev => prev + change);
  };

  if (isMobile) {
    return <MobileOptimizedInterface />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Portfolio Status */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Paper Trading</h2>
          <p className="text-muted-foreground">
            Practice trading with {portfolioValue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })} virtual funds
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Trading Mode:</span>
            <Switch
              checked={tradingMode === 'ai'}
              onCheckedChange={(checked) => setTradingMode(checked ? 'ai' : 'manual')}
            />
            <span className="text-sm">{tradingMode === 'ai' ? 'AI Assisted' : 'Manual'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">{isConnected ? 'Live Data' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* AI Trading Signals */}
      {tradingMode === 'ai' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Trading Signals
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={generateAISignals}
                disabled={isGeneratingSignals}
              >
                {isGeneratingSignals ? 'Generating...' : 'Refresh Signals'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {aiSignals.map((signal, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{signal.asset}</span>
                        <Badge variant={
                          signal.signal === 'BUY' ? 'default' : 
                          signal.signal === 'SELL' ? 'destructive' : 'secondary'
                        }>
                          {signal.signal}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className="font-medium">{(signal.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Entry:</span>
                          <span>${signal.entryPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target:</span>
                          <span className="text-green-500">${signal.targetPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stop Loss:</span>
                          <span className="text-red-500">${signal.stopLoss?.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {signal.reasoning}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => executeTrade(signal)}
                        disabled={signal.signal === 'HOLD'}
                      >
                        Execute Trade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Data with Advanced Filtering */}
      <Card>
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedSortingFilters
            data={marketData}
            sortOptions={sortOptions}
            filterOptions={filterOptions}
            onDataChange={handleDataChange}
            searchPlaceholder="Search cryptocurrencies..."
          />
          
          <div className="mt-6 space-y-4">
            {(filteredData.length > 0 ? filteredData : marketData).map((coin) => (
              <div
                key={coin.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAsset === coin.id ? 'bg-primary/5 border-primary' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAsset(coin.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">{coin.symbol}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{coin.name}</h4>
                    <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold">${coin.price?.toFixed(2) || '0.00'}</p>
                  <div className={`flex items-center gap-1 text-sm ${
                    (coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(coin.changePercent || 0) >= 0 ? 
                      <TrendingUp className="h-4 w-4" /> : 
                      <TrendingDown className="h-4 w-4" />
                    }
                    <span>{(coin.changePercent || 0).toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="text-right text-sm text-muted-foreground">
                  <p>Vol: {(coin.volume || 0).toLocaleString()}</p>
                  <p>MCap: ${(coin.marketCap || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Interface */}
      <Tabs defaultValue="spot" className="w-full">
        <TabsList>
          <TabsTrigger value="spot">Spot Trading</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="spot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spot Trading - {selectedAsset.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Enhanced trading interface will be implemented here with real-time charts,
                order books, and advanced order types.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle>Trading Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Strategy builder and backtesting tools will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold">
                  {portfolioValue.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
                </h3>
                <p className="text-muted-foreground">Total Portfolio Value</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastUpdate && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default EnhancedFakeTrading;
