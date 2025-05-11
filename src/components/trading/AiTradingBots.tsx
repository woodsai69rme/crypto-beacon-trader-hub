
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Plus, Play, Pause } from "lucide-react";
import { AITradingStrategy } from "@/types/trading";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";

interface AiTradingBotsProps {
  onSelectBot?: (botId: string) => void;
  onCreateBot?: () => void;
}

interface TradingBot {
  id: string;
  name: string;
  strategyId: string;
  strategyType: string;
  active: boolean;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    winRate: number;
    totalTrades: number;
  };
  lastActive: string;
}

const AiTradingBots: React.FC<AiTradingBotsProps> = ({ onSelectBot, onCreateBot }) => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Sample bots data
  const [bots, setBots] = useState<TradingBot[]>([
    {
      id: 'bot-1',
      name: 'BTC Trend Follower',
      strategyId: 'strategy-rsi-mean-reversion',
      strategyType: 'trend-following',
      active: true,
      performance: {
        daily: 1.2,
        weekly: 3.5,
        monthly: 12.3,
        winRate: 67,
        totalTrades: 125
      },
      lastActive: '2 minutes ago'
    },
    {
      id: 'bot-2',
      name: 'ETH Swing Trader',
      strategyId: 'strategy-macd-trend',
      strategyType: 'trend-following',
      active: true,
      performance: {
        daily: -0.8,
        weekly: 2.5,
        monthly: 9.7,
        winRate: 58,
        totalTrades: 86
      },
      lastActive: '15 minutes ago'
    },
    {
      id: 'bot-3',
      name: 'SOL Breakout Bot',
      strategyId: 'strategy-bb-breakout',
      strategyType: 'breakout',
      active: false,
      performance: {
        daily: 0,
        weekly: 0,
        monthly: 4.5,
        winRate: 52,
        totalTrades: 43
      },
      lastActive: '2 days ago'
    },
    {
      id: 'bot-4',
      name: 'ADA Momentum',
      strategyId: 'strategy-ma-crossover',
      strategyType: 'trend-following',  // Changed from 'momentum' to 'trend-following'
      active: false,
      performance: {
        daily: 0,
        weekly: 0,
        monthly: -2.3,
        winRate: 45,
        totalTrades: 62
      },
      lastActive: '5 days ago'
    }
  ]);
  
  const toggleBotStatus = (botId: string) => {
    setBots(prevBots => prevBots.map(bot => 
      bot.id === botId 
        ? { ...bot, active: !bot.active, lastActive: bot.active ? bot.lastActive : 'just now' } 
        : bot
    ));
  };
  
  const activeBots = bots.filter(bot => bot.active);
  const inactiveBots = bots.filter(bot => !bot.active);
  
  // Find strategy by ID
  const getStrategyById = (id: string): AITradingStrategy | undefined => {
    return predefinedStrategies.find(strategy => strategy.id === id);
  };
  
  const renderBotCard = (bot: TradingBot) => {
    const strategy = getStrategyById(bot.strategyId);
    
    return (
      <div 
        key={bot.id} 
        className="border rounded-lg p-4 transition-colors hover:border-primary/50 cursor-pointer"
        onClick={() => onSelectBot && onSelectBot(bot.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Bot className={`h-5 w-5 ${bot.active ? 'text-green-500' : 'text-gray-400'}`} />
            <h3 className="font-medium">{bot.name}</h3>
          </div>
          <Button 
            variant={bot.active ? "outline" : "default"} 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleBotStatus(bot.id);
            }}
          >
            {bot.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="text-xs bg-muted px-2 py-1 rounded-full">
            {strategy?.type || bot.strategyType}
          </div>
          {strategy?.timeframe && (
            <div className="text-xs bg-muted px-2 py-1 rounded-full">
              {strategy.timeframe}
            </div>
          )}
          <div className="text-xs bg-muted px-2 py-1 rounded-full">
            {bot.performance.totalTrades} trades
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Daily</div>
            <div className={`text-sm font-medium ${bot.performance.daily > 0 ? 'text-green-500' : bot.performance.daily < 0 ? 'text-red-500' : ''}`}>
              {bot.performance.daily > 0 ? '+' : ''}{bot.performance.daily.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Weekly</div>
            <div className={`text-sm font-medium ${bot.performance.weekly > 0 ? 'text-green-500' : bot.performance.weekly < 0 ? 'text-red-500' : ''}`}>
              {bot.performance.weekly > 0 ? '+' : ''}{bot.performance.weekly.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-sm font-medium">
              {bot.performance.winRate}%
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          {bot.active ? 'Active - Last trade ' : 'Inactive since '}{bot.lastActive}
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Trading Bots</CardTitle>
          <Button size="sm" onClick={onCreateBot}>
            <Plus className="h-4 w-4 mr-1" />
            New Bot
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">
              Active ({activeBots.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({inactiveBots.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Bots ({bots.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {activeBots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBots.map(renderBotCard)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active bots. Start a bot to begin trading.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            {inactiveBots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inactiveBots.map(renderBotCard)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No inactive bots.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bots.map(renderBotCard)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
