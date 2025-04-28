
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { CoinOption } from "@/types/trading";
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";

interface RealTimeTraderProps {
  marketData: CoinOption[];
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
}

const RealTimeTrader: React.FC<RealTimeTraderProps> = ({ 
  marketData, 
  selectedCoinId,
  onSelectCoin
}) => {
  const [amount, setAmount] = useState<string>("0");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [executing, setExecuting] = useState<boolean>(false);
  
  const selectedCoin = marketData.find(coin => coin.id === selectedCoinId);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setAmount(value);
    }
  };
  
  const handleTradeSubmit = () => {
    if (!selectedCoin) {
      toast({
        title: "Error",
        description: "Please select a cryptocurrency first",
        variant: "destructive"
      });
      return;
    }
    
    if (Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    setExecuting(true);
    
    // Simulate trade execution
    setTimeout(() => {
      toast({
        title: "Trade Executed",
        description: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedCoin.symbol} at $${selectedCoin.price.toFixed(2)}`,
      });
      
      setExecuting(false);
      setAmount("0");
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Real-Time Trading
        </CardTitle>
        <CardDescription>
          Execute trades based on real-time market data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedCoin ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-medium text-lg">{selectedCoin.name}</div>
              <div className="text-sm text-muted-foreground">{selectedCoin.symbol}</div>
            </div>
            <div className="text-lg font-medium">${selectedCoin.price.toFixed(2)}</div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Select a cryptocurrency to trade
          </div>
        )}
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="coin-select">Select Cryptocurrency</Label>
            <Select 
              value={selectedCoinId}
              onValueChange={(value) => onSelectCoin(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {marketData.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trade-type">Trade Type</Label>
            <div className="flex space-x-2">
              <Button
                variant={tradeType === 'buy' ? "default" : "outline"}
                className={`w-full ${tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                onClick={() => setTradeType('buy')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Buy
              </Button>
              <Button
                variant={tradeType === 'sell' ? "default" : "outline"}
                className={`w-full ${tradeType === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                onClick={() => setTradeType('sell')}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Sell
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex space-x-2">
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
              />
              <div className="bg-muted flex items-center justify-center px-3 rounded-md">
                {selectedCoin?.symbol || "---"}
              </div>
            </div>
            
            {selectedCoin && (
              <div className="text-sm text-muted-foreground">
                Value: ${(Number(amount) * selectedCoin.price).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedCoin || Number(amount) <= 0 || executing}
          onClick={handleTradeSubmit}
        >
          {executing ? "Executing..." : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCoin?.symbol || ""}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RealTimeTrader;
