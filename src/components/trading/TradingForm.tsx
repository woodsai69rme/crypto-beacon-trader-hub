
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeftRight, TrendingDown, TrendingUp } from "lucide-react";
import { CoinOption } from "@/types/trading";

interface TradingFormProps {
  availableCoins: CoinOption[];
  balance: number;
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
}

const TradingForm: React.FC<TradingFormProps> = ({ availableCoins, balance, onTrade }) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(availableCoins[0]?.id || "");
  const [amount, setAmount] = useState<string>("");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  
  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);
  const totalValue = selectedCoin ? Number(amount) * selectedCoin.price : 0;
  
  const handleAmountChange = (value: string) => {
    // Allow only numbers and a decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleTradeSubmit = () => {
    if (!selectedCoin) {
      toast({
        title: "Error",
        description: "Please select a cryptocurrency",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${totalValue.toFixed(2)} but have $${balance.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }
    
    onTrade(selectedCoin.id, tradeType, Number(amount), selectedCoin.price);
    setAmount("");
  };
  
  const handleQuickBuy = (percentage: number) => {
    if (!selectedCoin) return;
    
    const maxAmount = balance / selectedCoin.price;
    const calculatedAmount = (maxAmount * percentage / 100).toFixed(8);
    setAmount(calculatedAmount);
    setTradeType('buy');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Execute Trade
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Select Cryptocurrency</div>
          <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              {availableCoins.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedCoin && (
          <div className="space-y-1">
            <div className="text-sm font-medium">Current Price</div>
            <div className="text-lg font-semibold">${selectedCoin.price.toLocaleString()}</div>
            <div className={`text-xs ${selectedCoin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {selectedCoin.changePercent >= 0 ? '▲' : '▼'} {Math.abs(selectedCoin.changePercent).toFixed(2)}% (24h)
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Trade Type</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={tradeType === 'buy' ? "default" : "outline"}
              onClick={() => setTradeType('buy')}
              className={tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy
            </Button>
            <Button
              type="button"
              variant={tradeType === 'sell' ? "default" : "outline"}
              onClick={() => setTradeType('sell')}
              className={tradeType === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Amount</div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            <div className="bg-muted flex items-center justify-center px-3 rounded-md">
              {selectedCoin?.symbol || "---"}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Total Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickBuy(25)}>25%</Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickBuy(50)}>50%</Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickBuy(75)}>75%</Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickBuy(100)}>100%</Button>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full" 
            onClick={handleTradeSubmit}
            disabled={!selectedCoin || !amount || Number(amount) <= 0}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol || ""}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
