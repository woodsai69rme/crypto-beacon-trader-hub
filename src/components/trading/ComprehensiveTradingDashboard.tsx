
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

const ComprehensiveTradingDashboard: React.FC = () => {
  const { activeAccount } = useTradingContext();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [fearGreedIndex, setFearGreedIndex] = useState<{ value: number; classification: string }>({ value: 50, classification: 'Neutral' });
  const [riskMetrics, setRiskMetrics] = useState<any>(null);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 60000);
    return () => clearInterval(interval);
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
      for (const asset of marketDataResult.slice(0, 3)) {
        try {
          const prediction = await openRouterService.generateMarketPrediction({
            asset: asset.id,
            historicalData: [],
            technicalIndicators: {
              RSI: 50 + Math.random() * 40,
              MACD: Math.random() * 2 - 1,
              'Price vs MA50': Math.random() * 0.2 - 0.1
            },
            timeframe: '1d',
            predictionHorizon: '7d'
          });
          predictions.push({ asset: asset.id, ...prediction });
        } catch (error) {
          console.error(`Failed to get prediction for ${asset.id}:`, error);
        }
      }
      setAiPredictions(predictions);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoRebalance = async () => {
    if (!activeAccount || !activeAccount.assets) return;
    
    try {
      const portfolioData = {
        currentAllocation: activeAccount.assets.reduce((acc, asset) => {
          acc[asset.symbol] = asset.allocation;
          return acc;
        }, {} as Record<string, number>),
        targetAllocation: { BTC: 40, ETH: 30, ADA: 15, SOL: 15 },
        rebalanceThreshold: 5
      };
      
      await n8nService.triggerPortfolioRebalance(portfolioData);
    } catch (error) {
      console.error('Failed to trigger rebalancing:', error);
    }
  };

  const handleRiskAssessment = async () => {
    if (!activeAccount) return;
    
    try {
      const portfolioValue = (activeAccount.assets || []).reduce((sum, asset) => sum + asset.value, 0) + activeAccount.balance;
      
      await n8nService.checkRiskLevels({
        portfolioValue,
        drawdown: riskMetrics?.currentDrawdown || 0,
        volatility: riskMetrics?.portfolioVaR || 0,
        correlations: { 'BTC-ETH': 0.7, 'ETH-ADA': 0.6 }
      });
    } catch (error) {
      console.error('Failed to trigger risk assessment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading comprehensive trading data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fear & Greed Index</p>
                <p className="text-2xl font-bold">{fearGreedIndex.value}</p>
                <p className="text-xs text-muted-foreground">{fearGreedIndex.classification}</p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                fearGreedIndex.value > 50 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {fearGreedIndex.value > 50 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {sentimentData && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Sentiment</p>
                  <p className="text-2xl font-bold">{(sentimentData.overallSentiment * 100).toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">{sentimentData.sentimentTrend}</p>
                </div>
                <Badge variant={sentimentData.overallSentiment > 0 ? "default" : "destructive"}>
                  {sentimentData.overallSentiment > 0 ? 'Bullish' : 'Bearish'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {riskMetrics && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-bold">{riskMetrics.riskScore.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Sharpe: {riskMetrics.sharpeRatio.toFixed(2)}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  riskMetrics.riskScore < 50 ? 'bg-green-100 text-green-600' : 
                  riskMetrics.riskScore < 75 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Shield className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Strategies</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">2 AI Bots Running</p>
              </div>
              <Bot className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.type === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${alert.type === 'critical' ? 'text-red-800' : 'text-yellow-800'}`}>
                        {alert.message}
                      </p>
                      <p className={`text-sm ${alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {alert.action}
                      </p>
                    </div>
                    <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Predictions */}
      {aiPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Market Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiPredictions.map((prediction, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{prediction.asset.toUpperCase()}</h3>
                    <Badge variant="outline">{(prediction.confidence * 100).toFixed(0)}% confidence</Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    ${prediction.priceTarget?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {prediction.timeframe} target
                  </p>
                  {prediction.keyFactors && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Key factors:</p>
                      <p className="text-xs text-muted-foreground">
                        {prediction.keyFactors.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={handleAutoRebalance} className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Auto Rebalance
            </Button>
            <Button onClick={handleRiskAssessment} variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Assessment
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Deploy AI Bot
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Market Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Trading Interface */}
      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trading">Live Trading</TabsTrigger>
          <TabsTrigger value="ai-bots">AI Trading Bots</TabsTrigger>
          <TabsTrigger value="exchanges">Exchange Integration</TabsTrigger>
          <TabsTrigger value="workflows">N8N Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((coin) => (
                    <div key={coin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {coin.image && (
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        )}
                        <div>
                          <p className="font-semibold">{coin.symbol}</p>
                          <p className="text-sm text-muted-foreground">{coin.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${coin.price?.toLocaleString() || 'N/A'} AUD
                        </p>
                        <p className={`text-sm ${coin.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent?.toFixed(2) || '0'}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {activeAccount ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Balance</span>
                      <span className="font-semibold">
                        ${((activeAccount.assets || []).reduce((sum, asset) => sum + asset.value, 0) + activeAccount.balance).toLocaleString()} AUD
                      </span>
                    </div>
                    <div className="space-y-2">
                      {(activeAccount.assets || []).map((asset) => (
                        <div key={asset.coinId} className="flex justify-between items-center">
                          <span>{asset.symbol}</span>
                          <div className="text-right">
                            <span className="font-medium">${asset.value.toLocaleString()} AUD</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({asset.allocation.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No active trading account selected</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-bots">
          <AiBotTrading />
        </TabsContent>

        <TabsContent value="exchanges">
          <EnhancedExchangeIntegration />
        </TabsContent>

        <TabsContent value="workflows">
          <N8NWorkflowManager />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Risk Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {riskMetrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Portfolio VaR</p>
                        <p className="text-lg font-semibold">${riskMetrics.portfolioVaR.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                        <p className="text-lg font-semibold">{riskMetrics.maxDrawdown.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Portfolio Beta</p>
                        <p className="text-lg font-semibold">{riskMetrics.beta.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Diversification</p>
                        <p className="text-lg font-semibold">{(riskMetrics.diversificationRatio * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Risk metrics unavailable</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correlation Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>BTC-ETH Correlation</span>
                    <span className="font-medium">0.72</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ETH-ADA Correlation</span>
                    <span className="font-medium">0.68</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BTC-SOL Correlation</span>
                    <span className="font-medium">0.55</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Correlation</span>
                    <span className="font-medium">0.63</span>
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

export default ComprehensiveTradingDashboard;
