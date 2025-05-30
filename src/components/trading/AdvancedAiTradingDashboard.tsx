
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, Activity, Settings, Play, Pause } from "lucide-react";
import { openRouterService } from '@/services/openRouterService';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AIBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    profit: number;
    trades: number;
    winRate: number;
  };
}

const AdvancedAiTradingDashboard: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>([
    {
      id: '1',
      name: 'Trend Follower',
      strategy: 'Trend Following',
      status: 'active',
      performance: { profit: 2340, trades: 45, winRate: 67 }
    },
    {
      id: '2',
      name: 'Mean Reversion Bot',
      strategy: 'Mean Reversion',
      status: 'paused',
      performance: { profit: -120, trades: 23, winRate: 43 }
    },
    {
      id: '3',
      name: 'AI Sentiment Trader',
      strategy: 'Sentiment Analysis',
      status: 'active',
      performance: { profit: 1890, trades: 34, winRate: 72 }
    }
  ]);

  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: marketData } = useRealTimeData(['bitcoin', 'ethereum', 'cardano', 'solana']);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    generateAIPredictions();
  }, [marketData]);

  const generateAIPredictions = async () => {
    if (!openRouterService.hasApiKey()) return;
    
    setLoading(true);
    try {
      const predictions = [];
      for (const coin of marketData.slice(0, 4)) {
        const prediction = await openRouterService.generateMarketPrediction({
          asset: coin.symbol,
          historicalData: Array.from({length: 10}, () => Math.random() * 1000 + coin.price),
          technicalIndicators: { rsi: 65, macd: 0.8, bb_upper: coin.price * 1.05 },
          timeframe: '1h',
          predictionHorizon: '24h'
        });
        predictions.push({ ...prediction, symbol: coin.symbol, name: coin.name });
      }
      setAiPredictions(predictions);
    } catch (error) {
      console.error('Failed to generate AI predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBot = (botId: string) => {
    setBots(prevBots => 
      prevBots.map(bot => 
        bot.id === botId 
          ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' }
          : bot
      )
    );
  };

  const totalProfit = bots.reduce((sum, bot) => sum + bot.performance.profit, 0);
  const activeBots = bots.filter(bot => bot.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total AI Profit</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalProfit)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{activeBots}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">
                  {bots.reduce((sum, bot) => sum + bot.performance.trades, 0)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bots" className="w-full">
        <TabsList>
          <TabsTrigger value="bots">AI Bots</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          {bots.map(bot => (
            <Card key={bot.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Bot className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-semibold ${bot.performance.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(bot.performance.profit)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bot.performance.trades} trades • {bot.performance.winRate}% win rate
                      </p>
                    </div>
                    
                    <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleBot(bot.id)}
                    >
                      {bot.status === 'active' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Generating AI predictions...</p>
              </CardContent>
            </Card>
          ) : aiPredictions.length > 0 ? (
            aiPredictions.map((prediction, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{prediction.name || prediction.symbol}</h3>
                      <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(prediction.priceTarget)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {(prediction.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                        <Badge variant={prediction.riskLevel === 'high' ? 'destructive' : 'default'}>
                          {prediction.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {openRouterService.hasApiKey() 
                    ? "No predictions available" 
                    : "Configure OpenRouter API key to see AI predictions"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Bot Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Global Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure default risk levels, position sizes, and trading hours for all AI bots.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">OpenRouter Integration</h4>
                <p className="text-sm text-muted-foreground">
                  AI predictions and strategy generation powered by OpenRouter.
                  {!openRouterService.hasApiKey() && " Please configure your API key to enable AI features."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAiTradingDashboard;
