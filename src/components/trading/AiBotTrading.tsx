
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiTrading } from "@/contexts/AiTradingContext";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";
import { toast } from "@/components/ui/use-toast";
import { Bot, TrendingUp, ArrowUpDown, PlayCircle, StopCircle } from "lucide-react";
import BotAccountConnector from "./BotAccountConnector";

interface AiBotTradingProps {
  botId: string;
  strategyId: string;
  strategyName: string;
}

const AVAILABLE_COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" }
];

const AiBotTrading: React.FC<AiBotTradingProps> = ({ botId, strategyId, strategyName }) => {
  const { executeAiTrade, getConnectedAccount, isProcessing } = useAiTrading();
  const { accounts } = useTradingAccounts();
  
  const [isActive, setIsActive] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  const connectedAccountId = getConnectedAccount(botId);
  const connectedAccount = accounts.find(a => a.id === connectedAccountId);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  const startTrading = () => {
    if (!connectedAccountId || isActive) return;
    
    setIsActive(true);
    toast({
      title: "AI Bot Trading Started",
      description: `${strategyName} is now actively trading on your account`
    });
    
    // Set up interval to simulate AI trading
    const id = window.setInterval(() => {
      if (!connectedAccountId) return;
      
      const randomCoin = AVAILABLE_COINS[Math.floor(Math.random() * AVAILABLE_COINS.length)];
      const isBuy = Math.random() > 0.5;
      const amount = parseFloat((Math.random() * 0.5).toFixed(6));
      const price = isBuy ? 
        parseFloat((Math.random() * 500 + 500).toFixed(2)) : 
        parseFloat((Math.random() * 1000 + 1000).toFixed(2));
      
      const success = executeAiTrade({
        botId,
        strategyId,
        accountId: connectedAccountId,
        coinId: randomCoin.id,
        type: isBuy ? 'buy' : 'sell',
        amount,
        price
      });
      
      if (success) {
        setLastAction(`${isBuy ? 'Bought' : 'Sold'} ${amount} ${randomCoin.symbol} at $${price}`);
      }
    }, 20000); // Execute a trade every 20 seconds
    
    setIntervalId(id);
  };
  
  const stopTrading = () => {
    if (!isActive || !intervalId) return;
    
    clearInterval(intervalId);
    setIntervalId(null);
    setIsActive(false);
    
    toast({
      title: "AI Bot Trading Stopped",
      description: `${strategyName} has stopped trading on your account`
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <Bot className="h-5 w-5 mr-2" />
            <CardTitle className="text-lg">{strategyName}</CardTitle>
          </div>
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription>
          Connect this AI bot to your trading account to begin automated trading
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <BotAccountConnector 
            botId={botId} 
            botName={strategyName} 
          />
          
          {connectedAccountId && (
            <div className="pt-2">
              {isActive ? (
                <Button 
                  onClick={stopTrading}
                  variant="destructive"
                  disabled={!isActive || isProcessing}
                  className="w-full"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Trading
                </Button>
              ) : (
                <Button 
                  onClick={startTrading}
                  disabled={!connectedAccountId || isProcessing}
                  className="w-full"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Trading
                </Button>
              )}
            </div>
          )}
          
          {lastAction && (
            <div className="text-xs text-muted-foreground pt-2">
              <span className="font-medium">Last action:</span> {lastAction}
            </div>
          )}
          
          {isActive && (
            <div className="flex items-center justify-center pt-2">
              <div className="relative">
                <ArrowUpDown className="h-4 w-4 animate-pulse text-green-500" />
                <div className="absolute top-0 left-0 w-full h-full">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-25"></span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground ml-2">Trading in progress...</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {connectedAccount && (
        <CardFooter className="border-t pt-2 flex-col items-start">
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>Account: {connectedAccount.name}</span>
            <span>Balance: ${connectedAccount.balance.toLocaleString()}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AiBotTrading;
