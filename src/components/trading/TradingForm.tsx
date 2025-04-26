
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { CoinOption } from "@/types/trading";

interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onExecuteTrade: (type: 'buy' | 'sell', coinId: string, amount: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
}

const TradingForm = ({ balance, availableCoins, onExecuteTrade, getOwnedCoinAmount }: TradingFormProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getSelectedCoinData = (): CoinOption | undefined => {
    return availableCoins.find(coin => coin.id === selectedCoin);
  };

  const handleExecuteTrade = () => {
    if (!selectedCoin || amount <= 0) {
      toast({
        title: "Invalid Trade",
        description: "Please select a coin and enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const coinData = getSelectedCoinData();
    if (!coinData) return;

    const totalValue = amount * coinData.price;

    // Validate trade
    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(totalValue)} but only have ${formatCurrency(balance)} available`,
        variant: "destructive",
      });
      return;
    }

    if (tradeType === 'sell' && amount > getOwnedCoinAmount(selectedCoin)) {
      toast({
        title: "Insufficient Coins",
        description: `You don't have enough ${coinData.symbol} to sell`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onExecuteTrade(tradeType, selectedCoin, amount);
      setAmount(0);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div>
      <h3 className="font-medium mb-3">Execute Trade</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">Trade Type</label>
            <div className="flex gap-2">
              <Button 
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                className={tradeType === 'buy' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1'}
                onClick={() => setTradeType('buy')}
              >
                Buy
              </Button>
              <Button 
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                className={tradeType === 'sell' ? 'flex-1 bg-red-600 hover:bg-red-700' : 'flex-1'}
                onClick={() => setTradeType('sell')}
              >
                Sell
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">Cryptocurrency</label>
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">Amount</label>
            <Input 
              type="number" 
              min="0" 
              step="0.0001"
              value={amount || ''}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Price</label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground flex items-center">
                {selectedCoin ? `$${getSelectedCoinData()?.price.toLocaleString()}` : 'Select a coin'}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Total Value</label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground flex items-center font-medium">
                {selectedCoin && amount > 0 
                  ? formatCurrency(amount * (getSelectedCoinData()?.price || 0)) 
                  : '$0.00'}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleExecuteTrade} 
            disabled={isLoading || !selectedCoin || amount <= 0}
            variant={tradeType === 'buy' ? 'default' : 'destructive'}
          >
            {isLoading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCoin ? getSelectedCoinData()?.symbol : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingForm;
