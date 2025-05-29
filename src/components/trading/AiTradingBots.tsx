
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import AiTradingStrategySelector from './AiTradingStrategySelector';
import { AITradingStrategy } from '@/types/trading';

const AiTradingBots: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("trending");
  const [activeBots, setActiveBots] = useState<AITradingStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  
  // Mock data for trending strategies
  const trendingStrategies: AITradingStrategy[] = [
    {
      id: "trend-following-1",
      name: "Trend Following v2",
      description: "Follows major market trends across multiple timeframes",
      riskLevel: "medium",
      profitPotential: "medium",
      timeframe: 24,
      type: 'trend-following',
      parameters: {},
      indicators: ["Moving Averages", "MACD", "Volume"],
      backtestResults: {
        winRate: 62,
        profitFactor: 1.8,
        maxDrawdown: 12,
        sharpeRatio: 1.4
      }
    },
    {
      id: "breakout-strategy",
      name: "Breakout Strategy",
      description: "Captures price movements after periods of consolidation",
      riskLevel: "high",
      profitPotential: "high",
      timeframe: 1,
      type: 'breakout',
      parameters: {},
      indicators: ["Bollinger Bands", "ATR", "Support/Resistance"],
      backtestResults: {
        winRate: 45,
        profitFactor: 2.1,
        maxDrawdown: 18,
        sharpeRatio: 1.2
      }
    },
    {
      id: "mean-reversion",
      name: "Mean Reversion",
      description: "Takes advantage of price returning to average levels",
      riskLevel: "low",
      profitPotential: "low",
      timeframe: 168,
      type: 'mean-reversion',
      parameters: {},
      indicators: ["RSI", "Stochastic", "Bollinger Bands"],
      backtestResults: {
        winRate: 73,
        profitFactor: 1.5,
        maxDrawdown: 8,
        sharpeRatio: 1.7
      }
    }
  ];
  
  // Function to activate a bot
  const activateBot = (bot: AITradingStrategy) => {
    setActiveBots(prev => [...prev, bot]);
    toast({
      title: "Bot Activated",
      description: `${bot.name} is now running.`,
    });
  };
  
  // Function to deactivate a bot
  const deactivateBot = (botId: string) => {
    setActiveBots(prev => prev.filter(bot => bot.id !== botId));
    toast({
      title: "Bot Deactivated",
      description: "The trading bot has been stopped.",
    });
  };
  
  // Check if a bot is active
  const isBotActive = (botId: string) => {
    return activeBots.some(bot => bot.id === botId);
  };

  // Handle strategy selection
  const handleSelectStrategy = (strategy: AITradingStrategy) => {
    setSelectedStrategy(strategy);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Trading Bots</CardTitle>
          <CardDescription>
            Deploy intelligent trading strategies powered by AI
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="space-y-4">
              {trendingStrategies.map(strategy => (
                <Card key={strategy.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/avatars/bot-${Math.floor(Math.random() * 5) + 1}.png`} alt={strategy.name} />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{strategy.name}</h3>
                            <p className="text-xs text-muted-foreground">{strategy.timeframe}h term</p>
                          </div>
                        </div>
                        
                        <Badge variant={
                          strategy.riskLevel === "low" ? "outline" :
                          strategy.riskLevel === "medium" ? "secondary" : "destructive"
                        }>
                          {strategy.riskLevel} risk
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <div className="text-muted-foreground">Win Rate</div>
                          <div className="font-medium">{strategy.backtestResults?.winRate}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Profit Factor</div>
                          <div className="font-medium">{strategy.backtestResults?.profitFactor}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Max Drawdown</div>
                          <div className="font-medium">{strategy.backtestResults?.maxDrawdown}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Sharpe Ratio</div>
                          <div className="font-medium">{strategy.backtestResults?.sharpeRatio}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        {isBotActive(strategy.id) ? (
                          <Button variant="destructive" onClick={() => deactivateBot(strategy.id)}>
                            Stop Bot
                          </Button>
                        ) : (
                          <Button onClick={() => activateBot(strategy)}>
                            Activate Bot
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="popular" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Popular strategies will be available soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any custom strategies yet.</p>
                <Button>Create Custom Strategy</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Strategy</CardTitle>
          <CardDescription>
            Design your own AI-powered trading strategy
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <AiTradingStrategySelector 
            onSelectStrategy={handleSelectStrategy}
            selectedStrategyId={selectedStrategy?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingBots;
