import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trade, TradingAccount } from "@/types/trading";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { useToast } from "@/components/ui/use-toast";
import { AITradingStrategy } from "@/types/trading";
import { Play, Pause, AlertTriangle, ArrowUpDown } from "lucide-react";

// Sample trading strategies
const sampleStrategies: AITradingStrategy[] = [
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Follows established market trends using moving averages crossovers",
    type: "trend-following",
    timeframe: "4h",
    parameters: {
      fastMA: 9,
      slowMA: 21,
      volumeThreshold: 1.5,
      takeProfitPct: 5,
      stopLossPct: 3
    },
    riskLevel: "medium",
    indicators: ["MA", "Volume", "MACD"],
    creator: "System",
    tags: ["trend", "momentum", "popular"]
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Captures price movements back to the mean after extreme deviations",
    type: "mean-reversion",
    timeframe: "1h",
    parameters: {
      lookbackPeriod: 14,
      overboughtLevel: 70,
      oversoldLevel: 30,
      takeProfitPct: 3,
      stopLossPct: 2
    },
    riskLevel: "medium",
    indicators: ["RSI", "Bollinger Bands"],
    creator: "System",
    tags: ["mean-reversion", "oscillators"]
  },
  {
    id: "ai-sentiment",
    name: "AI Sentiment Analyzer",
    description: "Uses machine learning to analyze market sentiment and news",
    type: "sentiment",
    timeframe: "1d",
    parameters: {
      sentimentThreshold: 0.65,
      newsWeight: 0.6,
      socialWeight: 0.4,
      takeProfitPct: 7,
      stopLossPct: 5
    },
    riskLevel: "high",
    indicators: ["Sentiment Score", "News Analysis", "Social Media Index"],
    creator: "AI Lab",
    tags: ["ai", "sentiment", "news"]
  }
];

const AiBotTrading = () => {
  const { accounts, activeAccountId, addTradeToAccount } = useTradingAccounts();
  const { toast } = useToast();
  
  const [selectedAccount, setSelectedAccount] = useState<string>(activeAccountId || "");
  const [selectedStrategy, setSelectedStrategy] = useState<string>(sampleStrategies[0].id);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastTradeTime, setLastTradeTime] = useState<Date | null>(null);
  const [tradeInterval, setTradeInterval] = useState<NodeJS.Timeout | null>(null);
  const [tradesExecuted, setTradesExecuted] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  
  // Get the active account object
  const activeAccount = accounts.find(account => account.id === selectedAccount);
  
  // Get the selected strategy object
  const strategy = sampleStrategies.find(s => s.id === selectedStrategy);
  
  useEffect(() => {
    // Clean up interval on unmount
    return () => {
      if (tradeInterval) {
        clearInterval(tradeInterval);
      }
    };
  }, [tradeInterval]);
  
  const startBot = () => {
    if (!activeAccount || !strategy) {
      toast({
        title: "Cannot start bot",
        description: "Please select a trading account and strategy",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Bot started",
      description: `${strategy.name} is now running on ${activeAccount.name}`,
    });
    
    setIsRunning(true);
    
    // Set up interval for bot trades (every 20-40 seconds in demo)
    const interval = setInterval(() => {
      executeBotTrade(activeAccount, strategy);
    }, Math.random() * 20000 + 20000);
    
    setTradeInterval(interval);
    
    // Execute first trade immediately
    executeBotTrade(activeAccount, strategy);
  };
  
  const stopBot = () => {
    if (tradeInterval) {
      clearInterval(tradeInterval);
      setTradeInterval(null);
    }
    
    setIsRunning(false);
    
    toast({
      title: "Bot stopped",
      description: `${strategy?.name} has been stopped`,
    });
  };
  
  const executeBotTrade = (account: TradingAccount, strategy: AITradingStrategy) => {
    // Sample coins
    const coins = [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61450 + (Math.random() * 1000 - 500) },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3045 + (Math.random() * 200 - 100) },
      { id: "solana", name: "Solana", symbol: "SOL", price: 143 + (Math.random() * 10 - 5) }
    ];
    
    // Randomly select a coin
    const randomCoin = coins[Math.floor(Math.random() * coins.length)];
    
    // Determine if buy or sell (more buys than sells)
    const isBuy = Math.random() > 0.4;
    
    // Random amount (smaller for higher-priced coins)
    const amount = parseFloat((Math.random() * (10 / Math.sqrt(randomCoin.price))).toFixed(6));
    
    // Create the trade
    const trade: Trade = {
      id: Date.now().toString(),
      coinId: randomCoin.id,
      coinName: randomCoin.name,
      coinSymbol: randomCoin.symbol,
      type: isBuy ? 'buy' : 'sell',
      amount,
      price: randomCoin.price,
      totalValue: amount * randomCoin.price,
      timestamp: new Date().toISOString(),
      currency: "USD",
      botGenerated: true,
      strategyId: strategy.id
    };
    
    // Execute the trade
    addTradeToAccount(account.id, trade);
    
    // Update bot stats
    setLastTradeTime(new Date());
    setTradesExecuted(prev => prev + 1);
    
    // Update profit/loss (random for demo)
    const tradePL = (Math.random() * 20) - 5; // Between -5 and +15
    setProfitLoss(prev => prev + tradePL);
    
    // Show toast for significant trades
    if (trade.totalValue > 1000 || Math.abs(tradePL) > 10) {
      toast({
        title: `Bot ${isBuy ? "bought" : "sold"} ${randomCoin.symbol}`,
        description: `${amount.toFixed(6)} ${randomCoin.symbol} at $${randomCoin.price.toFixed(2)}`,
        variant: tradePL >= 0 ? "default" : "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trading Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Trading Account</label>
              <Select 
                value={selectedAccount} 
                onValueChange={setSelectedAccount}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} (${account.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Trading Strategy</label>
              <Select 
                value={selectedStrategy} 
                onValueChange={setSelectedStrategy}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {sampleStrategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {strategy && (
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-1">{strategy.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-xs">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-1">{strategy.type}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="ml-1">{strategy.timeframe}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Risk:</span>
                  <span className="ml-1">{strategy.riskLevel}</span>
                </div>
              </div>
            </div>
          )}
          
          {!activeAccount && !isRunning && (
            <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">No trading account selected</p>
                <p className="text-muted-foreground mt-1">Please select a trading account to start using the AI trading bot.</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            {isRunning ? (
              <Button variant="destructive" onClick={stopBot}>
                <Pause className="mr-2 h-4 w-4" />
                Stop Bot
              </Button>
            ) : (
              <Button 
                onClick={startBot} 
                disabled={!activeAccount}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Bot
              </Button>
            )}
          </div>
          
          {isRunning && (
            <div className="border rounded-md p-4 mt-4">
              <h3 className="font-medium mb-3 flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Bot Activity
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Trades Executed</p>
                  <p className="font-mono text-xl">{tradesExecuted}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit/Loss</p>
                  <p className={`font-mono text-xl ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} USD
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Trade</p>
                  <p className="text-sm">
                    {lastTradeTime ? lastTradeTime.toLocaleTimeString() : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Strategy</p>
                  <p className="text-sm">{strategy?.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiBotTrading;
