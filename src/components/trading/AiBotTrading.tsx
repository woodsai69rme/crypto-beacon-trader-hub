
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Play, Pause, Settings, TrendingUp, AlertCircle } from "lucide-react";
import AiBotCreator from './AiBotCreator';
import { useAiTrading } from '@/contexts/AiTradingContext';

const AiBotTrading: React.FC = () => {
  const { bots, toggleBot, getBotPerformance } = useAiTrading();
  const [showCreator, setShowCreator] = useState(false);

  const mockBots = [
    {
      id: 'bot-1',
      name: 'BTC Trend Follower',
      strategy: 'trend-following',
      status: 'active',
      performance: { totalReturn: 15.4, winRate: 68, trades: 42 },
      model: 'deepseek/deepseek-r1'
    },
    {
      id: 'bot-2', 
      name: 'ETH Mean Reversion',
      strategy: 'mean-reversion',
      status: 'paused',
      performance: { totalReturn: -2.1, winRate: 45, trades: 23 },
      model: 'google/gemini-2.0-flash-exp'
    },
    {
      id: 'bot-3',
      name: 'Multi-Asset Momentum',
      strategy: 'momentum',
      status: 'active',
      performance: { totalReturn: 8.7, winRate: 62, trades: 31 },
      model: 'deepseek/deepseek-r1'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Trading Bots</h2>
        <Button onClick={() => setShowCreator(!showCreator)}>
          <Bot className="h-4 w-4 mr-2" />
          Create New Bot
        </Button>
      </div>

      {showCreator && (
        <div className="mb-6">
          <AiBotCreator />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBots.map((bot) => (
          <Card key={bot.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{bot.name}</CardTitle>
                <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                  {bot.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {bot.strategy.replace('-', ' ')} • {bot.model.split('/')[1]}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className={`text-lg font-bold ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {bot.performance.totalReturn > 0 ? '+' : ''}{bot.performance.totalReturn}%
                    </p>
                    <p className="text-xs text-muted-foreground">Total Return</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{bot.performance.winRate}%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{bot.performance.trades}</p>
                    <p className="text-xs text-muted-foreground">Trades</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className={`w-2 h-2 rounded-full ${bot.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">
                    {bot.status === 'active' ? 'Running' : 'Paused'}
                  </span>
                  {bot.status === 'active' && (
                    <TrendingUp className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <Button
                    variant={bot.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleBot(bot.id)}
                  >
                    {bot.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Alerts */}
                {bot.performance.totalReturn < -5 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-700">High losses detected</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bot Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Bot Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">+7.3%</p>
              <p className="text-sm text-muted-foreground">Combined Return</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">96</p>
              <p className="text-sm text-muted-foreground">Total Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">61%</p>
              <p className="text-sm text-muted-foreground">Avg Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Active Bots</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiBotTrading;
