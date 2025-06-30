
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
  const [paperTradingEnabled, setPaperTradingEnabled] = useState(true);
  const [selectedAssets, setSelectedAssets] = useState(['BTC', 'ETH', 'SOL']);
  const [activeFilters, setActiveFilters] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { marketData, loading, error } = useRealTimeMarketData(selectedAssets);

  const handleFiltersChange = (filters: any) => {
    const filterCount = Object.values(filters).filter(value => {
      if (typeof value === 'string') return value !== '' && value !== 'all';
      if (typeof value === 'object') return JSON.stringify(value) !== JSON.stringify({ min: 0, max: 100000 });
      return false;
    }).length;
    setActiveFilters(filterCount);
  };

  if (isMobile) {
    return (
      <MobileOptimizedInterface>
        <EnhancedFakeTradingContent 
          paperTradingEnabled={paperTradingEnabled}
          setPaperTradingEnabled={setPaperTradingEnabled}
          marketData={marketData}
          loading={loading}
          selectedAssets={selectedAssets}
          setSelectedAssets={setSelectedAssets}
        />
      </MobileOptimizedInterface>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Paper Trading</h1>
          <p className="text-muted-foreground">Practice trading with real market data - no risk involved</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={paperTradingEnabled} 
              onCheckedChange={setPaperTradingEnabled}
            />
            <span className="text-sm font-medium">Paper Trading Mode</span>
          </div>
          <Badge variant={paperTradingEnabled ? "default" : "destructive"}>
            {paperTradingEnabled ? "PAPER" : "LIVE"}
          </Badge>
        </div>
      </div>

      <AdvancedSortingFilters 
        onFiltersChange={handleFiltersChange}
        activeFilters={activeFilters}
      />

      <EnhancedFakeTradingContent 
        paperTradingEnabled={paperTradingEnabled}
        setPaperTradingEnabled={setPaperTradingEnabled}
        marketData={marketData}
        loading={loading}
        selectedAssets={selectedAssets}
        setSelectedAssets={setSelectedAssets}
      />
    </div>
  );
};

interface EnhancedFakeTradingContentProps {
  paperTradingEnabled: boolean;
  setPaperTradingEnabled: (enabled: boolean) => void;
  marketData: any[];
  loading: boolean;
  selectedAssets: string[];
  setSelectedAssets: (assets: string[]) => void;
}

const EnhancedFakeTradingContent: React.FC<EnhancedFakeTradingContentProps> = ({
  paperTradingEnabled,
  marketData,
  loading,
  selectedAssets
}) => {
  const [portfolio, setPortfolio] = useState({
    balance: 50000,
    assets: [
      { symbol: 'BTC', amount: 0.5, value: 32500 },
      { symbol: 'ETH', amount: 8.2, value: 16400 }
    ]
  });

  return (
    <Tabs defaultValue="trading" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="bots">AI Bots</TabsTrigger>
      </TabsList>

      <TabsContent value="trading" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Overview
                  {loading && <Badge variant="secondary">Loading...</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketData.map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{asset.symbol}</h3>
                        <p className="text-sm text-muted-foreground">${asset.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">Buy</Button>
                          <Button size="sm" variant="outline">Sell</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Balance:</span>
                    <span className="font-semibold">${portfolio.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assets Value:</span>
                    <span className="font-semibold">
                      ${portfolio.assets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total P&L:</span>
                    <span className="font-semibold text-green-600">+$2,347</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">
                  <Bot className="h-4 w-4 mr-2" />
                  Start AI Bot
                </Button>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Risk Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="portfolio" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio.assets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{asset.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{asset.amount} coins</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${asset.value.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+5.2%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Return:</span>
                  <span className="font-semibold text-green-600">+4.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Drawdown:</span>
                  <span className="font-semibold text-red-600">-2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Sharpe Ratio:</span>
                  <span className="font-semibold">1.8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Risk Level:</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Diversification:</span> Good
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Volatility:</span> Moderate
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Correlation:</span> Low
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="bots" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available AI Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Grid Bot', 'Trend Follower', 'Mean Reversion'].map((botName) => (
                  <div key={botName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{botName}</h4>
                      <p className="text-sm text-muted-foreground">Ready to deploy</p>
                    </div>
                    <Button size="sm">Deploy</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Bots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active bots</p>
                <Button className="mt-4">Create Your First Bot</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedFakeTrading;
