import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { AITradingStrategy } from "@/types/trading";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Play, Pause, BarChart3, Settings2, CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

const AiTradingDashboard: React.FC = () => {
  const [isTrading, setIsTrading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  const [tradingAccount, setTradingAccount] = useState<TradingAccount>({
    id: "account-1",
    name: "Main Account",
    balance: 10000,
    currency: "USD"
  });

  const handleStartTrading = () => {
    if (!selectedStrategy) {
      toast({
        title: "No Strategy Selected",
        description: "Please select a strategy to start trading.",
        variant: "destructive"
      });
      return;
    }

    setIsTrading(true);
    toast({
      title: "Trading Started",
      description: `AI trading bot started with ${selectedStrategy.name} strategy.`,
    });
  };

  const handleStopTrading = () => {
    setIsTrading(false);
    toast({
      title: "Trading Stopped",
      description: "AI trading bot has been stopped.",
    });
  };

  const handleStrategySelect = (strategy: AITradingStrategy) => {
    setSelectedStrategy(strategy);
    toast({
      title: "Strategy Selected",
      description: `${strategy.name} strategy has been selected.`,
    });
  };

  const handleSimulateTrade = () => {
    if (!selectedStrategy) {
      toast({
        title: "No Strategy Selected",
        description: "Please select a strategy to simulate a trade.",
        variant: "destructive"
      });
      return;
    }

    // Simulate a trade
    const tradeResult = Math.random() > 0.5 ? "profit" : "loss";
    const tradeAmount = Math.random() * 100;
    const newBalance = tradeResult === "profit" ? tradingAccount.balance + tradeAmount : tradingAccount.balance - tradeAmount;

    setTradingAccount({ ...tradingAccount, balance: newBalance });

    toast({
      title: "Trade Simulated",
      description: `Simulated trade resulted in a ${tradeResult} of $${tradeAmount.toFixed(2)}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          AI Trading Dashboard
        </CardTitle>
        <CardDescription>
          Manage and monitor your AI trading bots
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Account Summary</h3>
          <p className="text-muted-foreground">
            Account: {tradingAccount.name}
            <br />
            Balance: ${tradingAccount.balance.toFixed(2)} {tradingAccount.currency}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Strategy Selection</h3>
          <p className="text-muted-foreground">
            Select a strategy to deploy your AI trading bot
          </p>
          {/* Strategy Selection UI */}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Trading Status</h3>
          <p className="text-muted-foreground">
            Status: {isTrading ? "Active" : "Inactive"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateTrade}
            disabled={isTrading}
          >
            <Info className="h-4 w-4 mr-2" />
            Simulate Trade
          </Button>
        </div>
        {isTrading ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleStopTrading}
          >
            <Pause className="h-4 w-4 mr-2" />
            Stop Trading
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleStartTrading}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Trading
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AiTradingDashboard;
