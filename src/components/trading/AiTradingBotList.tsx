
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AITradingBot } from '@/types/trading';
import { Bot, Play, Pause, Trash, Settings, ChevronRight } from 'lucide-react';

interface AiTradingBotListProps {
  bots: AITradingBot[];
  onSelectBot: (botId: string) => void;
  onStartBot?: (botId: string) => void;
  onStopBot?: (botId: string) => void;
  onPauseBot?: (botId: string) => void;
  onDeleteBot?: (botId: string) => void;
}

// Create demo bots for testing
const demoBots: AITradingBot[] = [
  {
    id: "bot-1",
    name: "Trend Follower",
    description: "A bot that follows market trends",
    status: "active",
    strategy: {
      id: "strategy-1",
      name: "Simple Trend Following",
      description: "Follows market trends using moving averages",
      type: "trend_following",
      riskLevel: "medium",
      timeframe: "4h",
      parameters: {}, // Add empty parameters object to fix the error
    },
    createdAt: new Date().toISOString(),
    profitLoss: 145.23,
    totalTrades: 24,
    performance: {
      winRate: 68,
      trades: 24,
      profit: 145.23,
    }
  },
  {
    id: "bot-2",
    name: "Breakout Trader",
    description: "Identifies and trades breakout patterns",
    status: "paused",
    strategy: {
      id: "strategy-2",
      name: "Volatility Breakout",
      description: "Trades breakouts from periods of low volatility",
      type: "breakout",
      riskLevel: "high",
      timeframe: "1h",
      parameters: {}, // Add empty parameters object to fix the error
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    profitLoss: -23.45,
    totalTrades: 18,
    performance: {
      winRate: 55,
      trades: 18,
      profit: -23.45,
    }
  },
  {
    id: "bot-3",
    name: "DCA Bitcoin",
    description: "Dollar-cost averaging into Bitcoin",
    status: "stopped",
    strategy: {
      id: "strategy-3",
      name: "Dollar Cost Averaging",
      description: "Regularly buys a fixed amount regardless of price",
      type: "dca",
      riskLevel: "low",
      timeframe: "1d",
      parameters: {}, // Add empty parameters object to fix the error
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    profitLoss: 320.18,
    totalTrades: 30,
    performance: {
      winRate: 80,
      trades: 30,
      profit: 320.18,
    }
  },
];

const AiTradingBotList: React.FC<AiTradingBotListProps> = ({
  bots = demoBots,
  onSelectBot,
  onStartBot,
  onStopBot,
  onPauseBot,
  onDeleteBot
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const filteredBots = selectedStatus === "all" 
    ? bots 
    : bots.filter(bot => bot.status === selectedStatus);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500">Paused</Badge>;
      case "stopped":
        return <Badge className="bg-red-500">Stopped</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  const formatProfitLoss = (profitLoss: number | undefined) => {
    if (profitLoss === undefined) return "N/A";
    return profitLoss > 0
      ? `+$${profitLoss.toFixed(2)}`
      : `-$${Math.abs(profitLoss).toFixed(2)}`;
  };
  
  const getProfitLossClass = (profitLoss: number | undefined) => {
    if (profitLoss === undefined) return "";
    return profitLoss > 0 ? "text-green-500" : "text-red-500";
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Trading Bots
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("all")}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("active")}
            >
              Active
            </Button>
            <Button
              variant={selectedStatus === "paused" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("paused")}
            >
              Paused
            </Button>
            <Button
              variant={selectedStatus === "stopped" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("stopped")}
            >
              Stopped
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBots.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No bots found</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {selectedStatus === "all" 
                  ? "You haven't created any trading bots yet."
                  : `You don't have any ${selectedStatus} bots.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBots.map(bot => (
                <div 
                  key={bot.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {bot.name}
                        {getStatusBadge(bot.status)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {bot.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectBot(bot.id)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Strategy</div>
                      <div className="font-medium">{bot.strategy.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">P&L</div>
                      <div className={`font-medium ${getProfitLossClass(bot.profitLoss)}`}>
                        {formatProfitLoss(bot.profitLoss)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Trades</div>
                      <div className="font-medium">{bot.totalTrades || 0}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {bot.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPauseBot && onPauseBot(bot.id)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStartBot && onStartBot(bot.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {bot.status !== "stopped" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStopBot && onStopBot(bot.id)}
                      >
                        Stop
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBot && onDeleteBot(bot.id)}
                      className="ml-auto text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingBotList;
