
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Info, Settings, Zap } from "lucide-react";
import AiTradingBotDetail from "./AiTradingBotDetail";
import { AITradingStrategy } from "@/types/trading";

const EXAMPLE_BOTS = [
  {
    id: "btc-momentum",
    name: "BTC Momentum",
    description: "Leverages momentum indicators to trade Bitcoin",
    status: "active",
    performance: 12.4,
    lastUpdated: "2 hours ago",
    creator: "CryptoSystem",
    riskLevel: "medium",
  },
  {
    id: "eth-trend",
    name: "ETH Trend Follower",
    description: "Follows long-term Ethereum trends with moving averages",
    status: "paused",
    performance: 8.7,
    lastUpdated: "1 day ago",
    creator: "TradingAI",
    riskLevel: "low",
  },
  {
    id: "multi-indicator",
    name: "Multi-Indicator Strategy",
    description: "Combines 5+ technical indicators for diversified trading",
    status: "active",
    performance: 15.2,
    lastUpdated: "4 hours ago",
    creator: "QuantBlock",
    riskLevel: "high",
  },
  {
    id: "volatility-capture",
    name: "Volatility Capture",
    description: "Exploits high volatility periods across multiple assets",
    status: "inactive",
    performance: -2.3,
    lastUpdated: "5 days ago",
    creator: "CryptoSystem",
    riskLevel: "high",
  },
];

const EXAMPLE_STRATEGIES: AITradingStrategy[] = [
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Follows established market trends using moving averages",
    riskLevel: "medium",
    timeframe: "4h",
    performance: 8.4,
    tags: ["technical", "momentum", "popular"]
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Capitalizes on price reversions to the mean",
    riskLevel: "medium",
    timeframe: "1h",
    performance: 6.7,
    tags: ["technical", "oscillator"]
  },
  {
    id: "breakout",
    name: "Breakout Trading",
    description: "Enters positions when price breaks key levels",
    riskLevel: "high",
    timeframe: "15m",
    performance: 12.5,
    tags: ["technical", "volume", "momentum"]
  }
];

interface BotDetailProps {
  botId: string;
  strategyId: string;
  strategyName: string;
}

const BotDetail: React.FC<BotDetailProps> = ({ botId, strategyId, strategyName }) => {
  return (
    <div>
      <h3>Bot: {botId}</h3>
      <p>Strategy: {strategyName} ({strategyId})</p>
    </div>
  );
};

const AiTradingBots = () => {
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredBots = EXAMPLE_BOTS.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleBotSelect = (botId: string) => {
    setSelectedBot(botId === selectedBot ? null : botId);
  };
  
  const handleStartBot = (botId: string) => {
    console.log(`Starting bot: ${botId}`);
    // In a real implementation, this would call an API to start the bot
  };
  
  const handlePauseBot = (botId: string) => {
    console.log(`Pausing bot: ${botId}`);
    // In a real implementation, this would call an API to pause the bot
  };
  
  const handleDeleteBot = (botId: string) => {
    console.log(`Deleting bot: ${botId}`);
    // In a real implementation, this would call an API to delete the bot
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bot className="mr-2" />
              AI Trading Bots
            </CardTitle>
            <CardDescription>
              Automated trading strategies powered by artificial intelligence
            </CardDescription>
          </div>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="active">Active Bots</TabsTrigger>
              <TabsTrigger value="all">All Bots</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
            </TabsList>
            <Input
              placeholder="Search bots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <TabsContent value="active">
            <div className="space-y-4">
              {filteredBots
                .filter(bot => bot.status === "active")
                .map(bot => (
                <Card key={bot.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4" onClick={() => handleBotSelect(bot.id)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base flex items-center">
                          {bot.name}
                          <Badge variant="outline" className="ml-2 text-xs font-normal">
                            {bot.riskLevel}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{bot.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className={
                        bot.performance >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }>
                        {bot.performance >= 0 ? "+" : ""}{bot.performance}%
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {selectedBot === bot.id && (
                    <CardContent className="border-t pt-4">
                      <AiTradingBotDetail 
                        botId={bot.id}
                        strategyId="trend-following"
                        strategyName="Trend Following"
                      />
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => handlePauseBot(bot.id)}>
                          Pause Bot
                        </Button>
                        <Button variant="outline">
                          <Info className="h-4 w-4 mr-2" />
                          Performance
                        </Button>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {filteredBots.map(bot => (
                <Card key={bot.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4" onClick={() => handleBotSelect(bot.id)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <CardTitle className="text-base">{bot.name}</CardTitle>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {bot.status}
                          </Badge>
                        </div>
                        <CardDescription>{bot.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className={
                        bot.performance >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }>
                        {bot.performance >= 0 ? "+" : ""}{bot.performance}%
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  {selectedBot === bot.id && (
                    <CardContent className="border-t pt-4">
                      <AiTradingBotDetail 
                        botId={bot.id}
                        strategyId="trend-following"
                        strategyName="Trend Following"
                      />
                      <div className="flex gap-2 mt-4">
                        {bot.status === "active" ? (
                          <Button variant="outline" onClick={() => handlePauseBot(bot.id)}>
                            Pause Bot
                          </Button>
                        ) : (
                          <Button onClick={() => handleStartBot(bot.id)}>
                            Start Bot
                          </Button>
                        )}
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="destructive" onClick={() => handleDeleteBot(bot.id)}>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="strategies">
            <div className="space-y-4">
              {EXAMPLE_STRATEGIES.map(strategy => (
                <Card key={strategy.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4" onClick={() => setSelectedStrategy(strategy.id === selectedStrategy ? null : strategy.id)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <CardTitle className="text-base">{strategy.name}</CardTitle>
                          <Badge variant={
                            strategy.riskLevel === "low" ? "outline" :
                            strategy.riskLevel === "medium" ? "secondary" : "default"
                          } className="ml-2 text-xs">
                            {strategy.riskLevel}
                          </Badge>
                        </div>
                        <CardDescription>{strategy.description}</CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {strategy.timeframe} timeframe
                      </div>
                    </div>
                  </CardHeader>
                  
                  {selectedStrategy === strategy.id && (
                    <CardContent className="border-t pt-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Performance</div>
                          <div className="text-2xl font-bold text-green-400">+{strategy.performance}%</div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Tags</div>
                          <div className="flex flex-wrap gap-2">
                            {strategy.tags?.map(tag => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button>
                            Use Strategy
                          </Button>
                          <Button variant="outline">
                            View Backtest
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingBots;
