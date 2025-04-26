
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { CoinOption } from "@/types/trading";
import { formatCurrency } from "@/utils/formatters";
import TradeTypeSelector from "./TradeTypeSelector";
import TradeValueDisplay from "./TradeValueDisplay";
import CurrencySelector from "./CurrencySelector";

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

  const getSelectedCoinData = () => availableCoins.find(coin => coin.id === selectedCoin);

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

    const price = activeCurrency === 'AUD' && coinData.priceAUD
      ? coinData.priceAUD
      : activeCurrency === 'AUD'
        ? coinData.price * conversionRate
        : coinData.price;

    const totalValue = amount * price;

    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${formatCurrency(totalValue, activeCurrency)} but only have ${formatCurrency(balance, activeCurrency)} available`,
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
    setTimeout(() => {
      onExecuteTrade(tradeType, selectedCoin, amount);
      setAmount(0);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrencyValue = (value: number): string => {
    return formatCurrency(value, activeCurrency);
  };

  const selectedCoinData = getSelectedCoinData();
  const price = selectedCoinData ? (
    activeCurrency === 'AUD' && selectedCoinData.priceAUD
      ? formatCurrencyValue(selectedCoinData.priceAUD)
      : activeCurrency === 'AUD'
        ? formatCurrencyValue(selectedCoinData.price * conversionRate)
        : formatCurrencyValue(selectedCoinData.price)
  ) : 'Select a coin';

  const totalValue = selectedCoin && amount > 0 ? (
    activeCurrency === 'AUD' && selectedCoinData?.priceAUD
      ? formatCurrencyValue(amount * selectedCoinData.priceAUD)
      : activeCurrency === 'AUD'
        ? formatCurrencyValue(amount * (selectedCoinData?.price || 0) * conversionRate)
        : formatCurrencyValue(amount * (selectedCoinData?.price || 0))
  ) : formatCurrencyValue(0);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Execute Trade</h3>
        <CurrencySelector
          activeCurrency={activeCurrency}
          onCurrencyChange={onCurrencyChange}
        />
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <TradeTypeSelector
            tradeType={tradeType}
            onTypeChange={setTradeType}
          />
          
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
            <TradeValueDisplay label="Price" value={price} />
            <TradeValueDisplay label="Total Value" value={totalValue} />
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
