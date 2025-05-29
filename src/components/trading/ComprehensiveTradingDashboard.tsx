
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, Shield, Bot, Workflow, AlertTriangle } from "lucide-react";
import AiBotTrading from './AiBotTrading';
import EnhancedExchangeIntegration from './EnhancedExchangeIntegration';
import N8NWorkflowManager from '../n8n/N8NWorkflowManager';
import { useTradingContext } from '@/contexts/TradingContext';
import { marketDataService } from '@/services/api/marketDataService';
import { openRouterService } from '@/services/openRouterService';
import { riskManagementService } from '@/services/trading/riskManagementService';
import { n8nService } from '@/services/n8nService';
import { websocketService } from '@/services/websocket/websocketService';

const ComprehensiveTradingDashboard: React.FC = () => {
  const { activeAccount } = useTradingContext();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [fearGreedIndex, setFearGreedIndex] = useState<{ value: number; classification: string }>({ value: 50, classification: 'Neutral' });
  const [riskMetrics, setRiskMetrics] = useState<any>(null);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDashboardData();
    setupWebSocketConnections();
    const interval = setInterval(loadDashboardData, 60000);
    return () => {
      clearInterval(interval);
      websocketService.disconnectAll();
    };
  }, [activeAccount]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load market data
      const marketDataResult = await marketDataService.getMarketData(['bitcoin', 'ethereum', 'cardano', 'solana']);
      setMarketData(marketDataResult);
      
      // Load Fear & Greed Index
      const fearGreedResult = await marketDataService.getFearGreedIndex();
      setFearGreedIndex(fearGreedResult);
      
      // Load risk metrics if account is available
      if (activeAccount) {
        const metrics = riskManagementService.calculateRiskMetrics(activeAccount);
        setRiskMetrics(metrics);
        
        const alerts = riskManagementService.generateRiskAlerts(activeAccount);
        setRiskAlerts(alerts);
      }
      
      // Load AI sentiment analysis
      const mockNewsItems = [
        { title: 'Bitcoin reaches new highs', content: 'Bitcoin price surge continues', source: 'CryptoNews' },
        { title: 'Ethereum upgrade successful', content: 'Latest Ethereum upgrade improves efficiency', source: 'ETH Today' }
      ];
      
      const sentiment = await openRouterService.performSentimentAnalysis({
        newsItems: mockNewsItems,
        socialPosts: [],
        timeframe: '24h'
      });
      setSentimentData(sentiment);
      
      // Generate AI predictions for major assets
      const predictions = [];
      for (const asset of marketData.slice(0, 4)) {
        try {
          const prediction = await openRouterService.generateMarketPrediction({
            asset: asset.symbol,
            historicalData: Array.from({length: 10}, () => Math.random() * 1000 + asset.price),
            technicalIndicators: { rsi: 65, macd: 0.8, bb_upper: asset.price * 1.05 },
            timeframe: '1h',
            predictionHorizon: '24h'
          });
          predictions.push({ ...prediction, symbol: asset.symbol });
        } catch (error) {
          console.error(`Failed to generate prediction for ${asset.symbol}:`, error);
        }
      }
      setAiPredictions(predictions);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocketConnections = () => {
    // Setup price stream for major cryptocurrencies
    websocketService.connectToPriceStream(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT']);
    
    // Subscribe to price updates
    const unsubscribe = websocketService.subscribe('price-update', (data) => {
      setMarketData(prevData => 
        prevData.map(item => 
          item.symbol === data.symbol.replace('USDT', '') 
            ? { ...item, price: data.price, changePercent: data.change24h }
            : item
        )
      );
    });

    // Monitor connection status
    const statusInterval = setInterval(() => {
      setConnectionStatus(websocketService.getAllConnectionStatuses());
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  };

  const mockPerformanceData = {
    totalValue: 125000,
    dailyChange: 2340,
    dailyChangePercent: 1.9,
    weeklyChange: -1230,
    weeklyChangePercent: -0.98
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">${mockPerformanceData.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className={`flex items-center ${mockPerformanceData.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {mockPerformanceData.dailyChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                ${Math.abs(mockPerformanceData.dailyChange).toLocaleString()} ({mockPerformanceData.dailyChangePercent.toFixed(2)}%) today
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1" />
              2 profitable, 1 learning
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fear & Greed Index</p>
                <p className="text-2xl font-bold">{fearGreedIndex.value}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Badge variant={
                fearGreedIndex.value <= 25 ? 'destructive' :
                fearGreedIndex.value <= 45 ? 'secondary' :
                fearGreedIndex.value <= 55 ? 'outline' :
                fearGreedIndex.value <= 75 ? 'default' : 'destructive'
              }>
                {fearGreedIndex.classification}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      {riskAlerts && riskAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">{alert.message}</span>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Trading Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Bots</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Data */}
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.slice(0, 4).map((coin, index) => (
                    <div key={coin.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                          {coin.symbol}
                        </div>
                        <div>
                          <p className="font-medium">{coin.name}</p>
                          <p className="text-sm text-muted-foreground">${coin.price?.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${coin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent?.toFixed(2)}%
                        </p>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            connectionStatus[`binance-prices`] === 'connected' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-xs text-muted-foreground">Live</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Market Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiPredictions.slice(0, 4).map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{prediction.symbol || `Asset ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${prediction.priceTarget?.toFixed(2)}</p>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-xs text-muted-foreground">
                            {(prediction.confidence * 100)?.toFixed(0)}% conf.
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Analysis */}
          {sentimentData && (
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{(sentimentData.overallSentiment * 100).toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold capitalize">{sentimentData.sentimentTrend}</p>
                    <p className="text-sm text-muted-foreground">Trend Direction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{sentimentData.keyTopics?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Key Topics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-bots">
          <AiBotTrading />
        </TabsContent>

        <TabsContent value="exchanges">
          <EnhancedExchangeIntegration />
        </TabsContent>

        <TabsContent value="automation">
          <N8NWorkflowManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveTradingDashboard;
