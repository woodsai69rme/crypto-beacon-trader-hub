
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { CoinOption } from "@/types/trading";
import { formatCurrency } from "@/utils/formatters";

interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onExecuteTrade: (type: 'buy' | 'sell', coinId: string, amount: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: 'USD' | 'AUD';
  onCurrencyChange: (currency: 'USD' | 'AUD') => void;
  conversionRate: number;
}

const TradingForm = ({ 
  balance, 
  availableCoins, 
  onExecuteTrade, 
  getOwnedCoinAmount, 
  activeCurrency,
  onCurrencyChange,
  conversionRate
}: TradingFormProps) => {
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

    // Use the appropriate price based on the active currency
    const price = activeCurrency === 'AUD' && coinData.priceAUD
      ? coinData.priceAUD
      : activeCurrency === 'AUD'
        ? coinData.price * conversionRate
        : coinData.price;
        
    const totalValue = amount * price;

    // Validate trade
    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrencyValue(totalValue)} but only have ${formatCurrencyValue(balance)} available`,
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

  const formatCurrencyValue = (value: number): string => {
    return formatCurrency(value, activeCurrency);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Execute Trade</h3>
        <Select 
          value={activeCurrency} 
          onValueChange={(val) => onCurrencyChange(val as 'USD' | 'AUD')}
        >
          <SelectTrigger className="w-24 h-8 text-xs">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="AUD">AUD</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
                {selectedCoin ? (
                  <>
                    {activeCurrency === 'USD' ? (
                      getSelectedCoinData()?.price ? formatCurrencyValue(getSelectedCoinData()!.price) : 'Loading...'
                    ) : (
                      getSelectedCoinData()?.priceAUD ? 
                        formatCurrencyValue(getSelectedCoinData()!.priceAUD) : 
                        formatCurrencyValue(getSelectedCoinData()!.price * conversionRate)
                    )}
                  </>
                ) : (
                  'Select a coin'
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Total Value</label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground flex items-center font-medium">
                {selectedCoin && amount > 0 ? (
                  activeCurrency === 'USD' ? (
                    formatCurrencyValue(amount * (getSelectedCoinData()?.price || 0))
                  ) : (
                    getSelectedCoinData()?.priceAUD ?
                      formatCurrencyValue(amount * (getSelectedCoinData()?.priceAUD || 0)) :
                      formatCurrencyValue(amount * (getSelectedCoinData()?.price || 0) * conversionRate)
                  )
                ) : (
                  formatCurrencyValue(0)
                )}
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
