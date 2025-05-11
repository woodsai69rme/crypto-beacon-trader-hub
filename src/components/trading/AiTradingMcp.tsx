import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, ChevronDown, ChevronUp, Settings, Play, Pause, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { CoinOption } from '@/types/trading';

// Define necessary types from scratch
interface AiTradingProps {
  botId?: string;
  strategyId?: string;
  strategyName?: string;
}

interface TradingBot {
  id: string;
  name: string;
  description: string;
  isRunning: boolean;
  lastTrade?: string;
  stats: {
    tradesExecuted: number;
    lastTradeTime?: string;
    profitLoss: number;
  };
}

interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  indicators: string[];
}

interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  totalValue: number;
  total: number;
  timestamp: string;
  currency: "USD" | "AUD" | "EUR" | "GBP";
  botGenerated: boolean;
  strategyId: string;
}

// Mock data
const tradingStrategies: TradingStrategy[] = [
  {
    id: "strategy-1",
    name: "MACD Crossover",
    description: "Buys when MACD crosses above signal line, sells when it crosses below",
    timeframe: "1h",
    indicators: ["MACD", "Signal Line"]
  },
  {
    id: "strategy-2",
    name: "RSI Overbought/Oversold",
    description: "Buys when RSI is below 30, sells when RSI is above 70",
    timeframe: "4h",
    indicators: ["RSI"]
  },
  {
    id: "strategy-3",
    name: "Moving Average Crossover",
    description: "Buys when 50 MA crosses above 200 MA, sells when it crosses below",
    timeframe: "1d",
    indicators: ["50 MA", "200 MA"]
  },
  {
    id: "strategy-4",
    name: "Bollinger Band Squeeze",
    description: "Buys when price breaks upper band after squeeze, sells when it breaks lower band",
    timeframe: "30m",
    indicators: ["Bollinger Bands", "Volume"]
  },
];

const availableCoins: CoinOption[] = [
  {
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 58352.12, 
    priceChange: 1245.32, 
    changePercent: 2.18, 
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 48941516789,
    marketCap: 1143349097968,
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  {
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3105.78, 
    priceChange: 65.43, 
    changePercent: 2.15, 
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    volume: 21891456789,
    marketCap: 373952067386,
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  {
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.45, 
    priceChange: -0.01, 
    changePercent: -2.17, 
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    volume: 467891234,
    marketCap: 15893456789,
    value: "cardano",
    label: "Cardano (ADA)"
  },
  {
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 152.37, 
    priceChange: 5.23, 
    changePercent: 3.55, 
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    volume: 3578912345,
    marketCap: 67891234567,
    value: "solana",
    label: "Solana (SOL)"
  }
];

const AiTradingMcp: React.FC<AiTradingProps> = () => {
  const [activeBots, setActiveBots] = useState<TradingBot[]>([
    {
      id: "bot-1",
      name: "Bitcoin Scalper",
      description: "Short-term BTC trading bot using RSI and MACD indicators",
      isRunning: false,
      stats: {
        tradesExecuted: 0,
        profitLoss: 0
      }
    },
    {
      id: "bot-2",
      name: "ETH Swing Trader",
      description: "Medium-term ETH trading bot using moving averages",
      isRunning: false,
      stats: {
        tradesExecuted: 0,
        profitLoss: 0
      }
    }
  ]);
  
  const [selectedBot, setSelectedBot] = useState<string | null>("bot-1");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>("strategy-1");
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  
  const startBot = (botId: string, strategyId: string) => {
    // Create a simulated bot trading
    const bot = activeBots.find(b => b.id === botId);
    const strategy = tradingStrategies.find(s => s.id === strategyId);
    
    if (!bot || !strategy) return;
    
    // Set bot to running state
    const updatedBots = activeBots.map(b => 
      b.id === botId ? {...b, isRunning: true, lastTrade: new Date().toISOString()} : b
    );
    setActiveBots(updatedBots);
    
    // Simulate a trade after a random delay
    const delay = Math.random() * 20000 + 5000; // 5-25 seconds
    setTimeout(() => {
      const randomCoin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
      const tradeType = Math.random() > 0.5 ? "buy" : "sell";
      const amount = parseFloat((Math.random() * 2).toFixed(3));
      const totalValue = amount * randomCoin.price;
      
      const trade = {
        id: `trade-${Date.now()}`,
        coinId: randomCoin.id,
        coinName: randomCoin.name,
        coinSymbol: randomCoin.symbol,
        type: tradeType as "buy" | "sell",
        amount,
        price: randomCoin.price,
        totalValue,
        total: totalValue,
        timestamp: new Date().toISOString(),
        currency: "USD" as const,
        botGenerated: true,
        strategyId: strategy.id
      };
      
      // Update bot stats
      const newStats = {
        tradesExecuted: bot.stats.tradesExecuted + 1,
        lastTradeTime: new Date().toISOString(),
        profitLoss: bot.stats.profitLoss + (Math.random() > 0.6 ? 1 : -1) * Math.random() * 100
      };
      
      const updatedBotsWithStats = activeBots.map(b => 
        b.id === botId ? {...b, stats: newStats, isRunning: true, lastTrade: new Date().toISOString()} : b
      );
      setActiveBots(updatedBotsWithStats);
      
      // Add the trade to history
      setTradeHistory(prev => [...prev, trade]);
      
      // If bot is still running, schedule another trade
      const isStillRunning = updatedBotsWithStats.find(b => b.id === botId)?.isRunning;
      if (isStillRunning) {
        startBot(botId, strategyId);
      }
    }, delay);
  };
  
  const stopBot = (botId: string) => {
    const updatedBots = activeBots.map(b => 
      b.id === botId ? {...b, isRunning: false} : b
    );
    setActiveBots(updatedBots);
    
    toast({
      title: "Trading Bot Stopped",
      description: "The trading bot has been stopped successfully"
    });
  };
  
  const addBot = () => {
    const newBot: TradingBot = {
      id: `bot-${activeBots.length + 1}`,
      name: `New Trading Bot ${activeBots.length + 1}`,
      description: "Configure this bot with a trading strategy",
      isRunning: false,
      stats: {
        tradesExecuted: 0,
        profitLoss: 0
      }
    };
    
    setActiveBots([...activeBots, newBot]);
    setSelectedBot(newBot.id);
    
    toast({
      title: "Trading Bot Created",
      description: "A new trading bot has been added to your collection"
    });
  };
  
  const deleteBot = (botId: string) => {
    const updatedBots = activeBots.filter(b => b.id !== botId);
    setActiveBots(updatedBots);
    
    if (selectedBot === botId && updatedBots.length > 0) {
      setSelectedBot(updatedBots[0].id);
    } else if (updatedBots.length === 0) {
      setSelectedBot(null);
    }
    
    toast({
      title: "Trading Bot Deleted",
      description: "The trading bot has been removed from your collection"
    });
  };
  
  const selectedBotData = selectedBot ? activeBots.find(b => b.id === selectedBot) : null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          AI Trading Bots
        </CardTitle>
        <CardDescription>
          Configure and deploy automated trading bots powered by AI strategies
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bot Selection Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Bots</h3>
              <Button variant="outline" size="sm" onClick={addBot}>
                Add Bot
              </Button>
            </div>
            
            <div className="space-y-2">
              {activeBots.map(bot => (
                <div
                  key={bot.id}
                  className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${
                    selectedBot === bot.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedBot(bot.id)}
                >
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-xs text-muted-foreground">{bot.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={bot.isRunning ? "default" : "outline"}>
                      {bot.isRunning ? "Active" : "Inactive"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBot(bot.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {activeBots.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No bots available</p>
                  <Button className="mt-4" onClick={addBot}>
                    Create Your First Bot
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Bot Configuration Panel */}
          <div className="space-y-4">
            {selectedBotData ? (
              <>
                <h3 className="text-lg font-medium">Configure Bot</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bot-name">Bot Name</Label>
                    <input
                      id="bot-name"
                      className="w-full p-2 border rounded"
                      value={selectedBotData.name}
                      onChange={(e) => {
                        const updatedBots = activeBots.map(b => 
                          b.id === selectedBot ? {...b, name: e.target.value} : b
                        );
                        setActiveBots(updatedBots);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strategy">Trading Strategy</Label>
                    <Select 
                      value={selectedStrategy || ''} 
                      onValueChange={(value) => setSelectedStrategy(value)}
                    >
                      <SelectTrigger id="strategy">
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradingStrategies.map(strategy => (
                          <SelectItem key={strategy.id} value={strategy.id}>
                            {strategy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedStrategy && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {tradingStrategies.find(s => s.id === selectedStrategy)?.description}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active" className="cursor-pointer">Bot Status</Label>
                    <div className="flex items-center space-x-2">
                      {selectedBotData.isRunning ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => stopBot(selectedBotData.id)}
                          className="flex items-center"
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Stop Bot
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            if (selectedStrategy) {
                              startBot(selectedBotData.id, selectedStrategy);
                            } else {
                              toast({
                                title: "Strategy Required",
                                description: "Please select a trading strategy first",
                                variant: "destructive"
                              });
                            }
                          }}
                          className="flex items-center"
                          disabled={!selectedStrategy}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start Bot
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      Advanced Settings
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Select a bot from the list</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Or create a new bot to get started
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Bot Performance Panel */}
          <div className="space-y-4">
            {selectedBotData ? (
              <>
                <h3 className="text-lg font-medium">Bot Performance</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={selectedBotData.isRunning ? "default" : "outline"}>
                      {selectedBotData.isRunning ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trades Executed</span>
                      <span className="font-medium">{selectedBotData.stats.tradesExecuted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Profit/Loss</span>
                      <span className={`font-medium ${selectedBotData.stats.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${Math.abs(selectedBotData.stats.profitLoss).toFixed(2)}
                        {selectedBotData.stats.profitLoss >= 0 ? ' profit' : ' loss'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Trade</span>
                      <span className="font-medium">
                        {selectedBotData.lastTrade 
                          ? new Date(selectedBotData.lastTrade).toLocaleTimeString() 
                          : 'No trades yet'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Recent Trades</h4>
                  </div>
                  
                  {tradeHistory.filter(t => t.strategyId === selectedStrategy).length > 0 ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {tradeHistory
                        .filter(t => t.strategyId === selectedStrategy)
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((trade) => (
                          <div key={trade.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div>
                              <div className="font-medium">{trade.coinSymbol}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(trade.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                                {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.amount} {trade.coinSymbol}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${trade.price} per coin
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">
                        No trades executed yet
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Select a bot to view performance</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingMcp;
