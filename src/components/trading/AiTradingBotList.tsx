
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TrendingUp, TrendingDown, BarChart2, Activity, Play, Pause, Settings, MoreHorizontal } from "lucide-react";
import { AITradingStrategy } from "@/types/trading";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface BotListProps {
  onSelectBot?: (bot: AITradingStrategy) => void;
  onStartBot?: (botId: string) => void;
  onStopBot?: (botId: string) => void;
  onEditBot?: (botId: string) => void;
  activeBots?: string[];
}

const AiTradingBotList: React.FC<BotListProps> = ({
  onSelectBot,
  onStartBot,
  onStopBot,
  onEditBot,
  activeBots = []
}) => {
  const [strategies, setStrategies] = useState<AITradingStrategy[]>([]);
  const [filter, setFilter] = useState<'all' | 'ai-predictive' | 'hybrid' | 'traditional'>('all');

  useEffect(() => {
    // In a real app, this would fetch from an API
    setStrategies(predefinedStrategies);
  }, []);

  const filteredStrategies = filter === 'all' 
    ? strategies 
    : strategies.filter(strategy => strategy.type === filter);
    
  const handleStartBot = (botId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onStartBot) {
      onStartBot(botId);
      toast({
        title: "Bot Started",
        description: "The trading bot has been activated successfully.",
      });
    }
  };
  
  const handleStopBot = (botId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onStopBot) {
      onStopBot(botId);
      toast({
        title: "Bot Stopped",
        description: "The trading bot has been deactivated.",
      });
    }
  };
  
  const handleEditBot = (botId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditBot) {
      onEditBot(botId);
    }
  };
  
  const getBotStatusIcon = (bot: AITradingStrategy) => {
    const isActive = activeBots.includes(bot.id);
    
    if (isActive) {
      return <div className="flex items-center text-green-500 gap-1">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
        <span>Active</span>
      </div>;
    }
    
    return <div className="flex items-center text-muted-foreground gap-1">
      <div className="relative flex h-3 w-3">
        <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
      </div>
      <span>Inactive</span>
    </div>;
  };
  
  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'secondary';
      case 'medium':
        return 'outline';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getStrategyTypeIcon = (type?: string) => {
    switch (type) {
      case 'ai-predictive':
        return <Bot className="h-4 w-4 text-purple-500" />;
      case 'hybrid':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'traditional':
        return <BarChart2 className="h-4 w-4 text-green-500" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Trading Bots
        </CardTitle>
        <CardDescription>
          Select and manage AI-powered trading strategies
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="all" className="px-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
          <TabsTrigger value="ai-predictive" onClick={() => setFilter('ai-predictive')}>AI Predictive</TabsTrigger>
          <TabsTrigger value="hybrid" onClick={() => setFilter('hybrid')}>Hybrid</TabsTrigger>
          <TabsTrigger value="traditional" onClick={() => setFilter('traditional')}>Traditional</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <CardContent className="pt-6">
        {filteredStrategies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p>No trading bots available for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStrategies.map((strategy) => (
              <Card 
                key={strategy.id}
                className={`hover:border-primary cursor-pointer transition-colors ${
                  activeBots.includes(strategy.id) ? 'border-green-500' : ''
                }`}
                onClick={() => onSelectBot?.(strategy)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-base">{strategy.name}</h3>
                        <Badge variant={getRiskBadgeVariant(strategy.riskLevel)}>
                          {strategy.riskLevel} risk
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        {getStrategyTypeIcon(strategy.type)}
                        <span>{strategy.type === 'ai-predictive' 
                          ? 'AI Prediction' 
                          : strategy.type === 'hybrid' 
                            ? 'AI-Traditional Hybrid' 
                            : 'Traditional Algorithm'
                        }</span>
                        <span className="text-xs">•</span>
                        <span>Timeframe: {strategy.timeframe}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {strategy.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {getBotStatusIcon(strategy)}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => handleEditBot(strategy.id, e)}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Edit Strategy</span>
                            </DropdownMenuItem>
                            {activeBots.includes(strategy.id) ? (
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={(e) => handleStopBot(strategy.id, e)}
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                <span>Stop Bot</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-500"
                                onClick={(e) => handleStartBot(strategy.id, e)}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                <span>Start Bot</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {strategy.backtestResults && (
                        <div className="bg-muted px-2 py-1 rounded-md text-xs">
                          Win Rate: {(strategy.backtestResults.winRate * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {strategy.indicators.slice(0, 3).map((indicator, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                    {strategy.indicators.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{strategy.indicators.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTradingBotList;
