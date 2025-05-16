
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, BarChart, Trash, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AITradingBot } from '@/types/trading';

// Mock AITradingBot data with the corrected properties
const mockBots: AITradingBot[] = [
  {
    id: "bot1",
    name: "BTC Trend Follower",
    description: "Follows Bitcoin trends with moving average crossovers",
    strategy: {
      id: "strategy1",
      name: "MA Crossover",
      description: "Moving Average Crossover Strategy",
      type: "trend-following",
      riskLevel: "medium",
      parameters: {
        shortMA: 9,
        longMA: 21
      }
    },
    pair: "BTC/USDT", // Added as per error
    status: "active",
    createdAt: "2023-05-15T10:30:00Z",
    lastRun: "2023-09-21T14:45:00Z",
    profitLoss: 1250.75, // Added as per error
    totalTrades: 42, // Added as per error
    performance: {
      winRate: 0.68,
      trades: 42,
      profit: 1250.75
    }
  },
  {
    id: "bot2",
    name: "ETH Scalper",
    description: "Short-term Ethereum scalping with RSI",
    strategy: {
      id: "strategy2",
      name: "RSI Scalper",
      description: "RSI-based Scalping Strategy",
      type: "scalping",
      riskLevel: "high",
      parameters: {
        rsiPeriod: 14,
        rsiOverbought: 70,
        rsiOversold: 30
      }
    },
    pair: "ETH/USDT",
    status: "paused",
    createdAt: "2023-06-10T08:15:00Z",
    lastRun: "2023-09-20T11:30:00Z",
    profitLoss: 780.25,
    totalTrades: 128,
    performance: {
      winRate: 0.62,
      trades: 128,
      profit: 780.25
    }
  },
  {
    id: "bot3",
    name: "SOL Grid Trader",
    description: "Solana grid trading with price ranges",
    strategy: {
      id: "strategy3",
      name: "Grid Trading",
      description: "Grid Trading Strategy",
      type: "grid",
      riskLevel: "medium",
      parameters: {
        upperLimit: 200,
        lowerLimit: 150,
        gridLevels: 5
      }
    },
    pair: "SOL/USDT",
    status: "stopped",
    createdAt: "2023-07-22T16:20:00Z",
    lastRun: "2023-09-19T09:15:00Z",
    profitLoss: 320.50,
    totalTrades: 56,
    performance: {
      winRate: 0.75,
      trades: 56,
      profit: 320.50
    }
  }
];

const AiTradingBotList: React.FC = () => {
  const [bots, setBots] = React.useState<AITradingBot[]>(mockBots);
  const [activeTab, setActiveTab] = React.useState('all');
  
  const handleStartBot = (botId: string) => {
    setBots(prev => 
      prev.map(bot => 
        bot.id === botId ? { ...bot, status: 'active' } : bot
      )
    );
    
    toast({
      title: "Bot Started",
      description: "The trading bot is now running",
    });
  };
  
  const handleStopBot = (botId: string) => {
    setBots(prev => 
      prev.map(bot => 
        bot.id === botId ? { ...bot, status: 'stopped' } : bot
      )
    );
    
    toast({
      title: "Bot Stopped",
      description: "The trading bot has been stopped",
    });
  };
  
  const handlePauseBot = (botId: string) => {
    setBots(prev => 
      prev.map(bot => 
        bot.id === botId ? { ...bot, status: 'paused' } : bot
      )
    );
    
    toast({
      title: "Bot Paused",
      description: "The trading bot has been paused",
    });
  };
  
  const handleDeleteBot = (botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId));
    
    toast({
      title: "Bot Deleted",
      description: "The trading bot has been removed",
      variant: "destructive"
    });
  };
  
  const filteredBots = activeTab === 'all' 
    ? bots 
    : bots.filter(bot => bot.status === activeTab);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI Trading Bots</CardTitle>
            <CardDescription>Manage your automated trading strategies</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Bot
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Bots ({bots.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({bots.filter(b => b.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({bots.filter(b => b.status === 'paused').length})</TabsTrigger>
            <TabsTrigger value="stopped">Stopped ({bots.filter(b => b.status === 'stopped').length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="m-0">
            <div className="space-y-4">
              {filteredBots.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No bots found in this category</p>
                </div>
              ) : (
                filteredBots.map(bot => (
                  <Card key={bot.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <Badge variant={bot.status === 'active' ? "success" : bot.status === 'paused' ? "warning" : "destructive"}>
                            {bot.status === 'active' ? 'Running' : bot.status === 'paused' ? 'Paused' : 'Stopped'}
                          </Badge>
                          <Badge variant="outline">{bot.pair}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {bot.status === 'active' ? (
                            <Button variant="outline" size="sm" onClick={() => handlePauseBot(bot.id)}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleStartBot(bot.id)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteBot(bot.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{bot.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Strategy</p>
                          <p className="text-sm font-medium">{bot.strategy.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Profit/Loss</p>
                          <p className={`text-sm font-medium ${bot.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {bot.profitLoss >= 0 ? '+' : ''}{bot.profitLoss?.toFixed(2)} USDT
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Win Rate</p>
                          <p className="text-sm font-medium">{(bot.performance.winRate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Trades</p>
                          <p className="text-sm font-medium">{bot.totalTrades}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-1 ${bot.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`} 
                            style={{ width: `${bot.performance.winRate * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotList;
