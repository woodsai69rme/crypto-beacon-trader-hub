
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import type { CoinOption } from "@/types/trading";
import PriceDisplay from "./PriceDisplay";

type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onExecuteTrade: (type: 'buy' | 'sell', coinId: string, amount: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
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
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");
  const [tradeAmount, setTradeAmount] = useState<string>("");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);
  const ownedAmount = selectedCoinId ? getOwnedCoinAmount(selectedCoinId) : 0;

  const handleExecuteTrade = () => {
    if (!selectedCoin || !tradeAmount) {
      toast({
        title: "Invalid Trade",
        description: "Please select a coin and enter an amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive"
      });
      return;
    }

    const price = activeCurrency === 'AUD' && selectedCoin.priceAUD 
      ? selectedCoin.priceAUD 
      : selectedCoin.price;
    const totalValue = amount * price;

    if (tradeType === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this trade",
        variant: "destructive"
      });
      return;
    }

    if (tradeType === 'sell' && amount > ownedAmount) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins for this trade",
        variant: "destructive"
      });
      return;
    }

    onExecuteTrade(tradeType, selectedCoinId, amount);
    setTradeAmount("");
  };

  const formatValue = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Execute Trade</h3>
          <Select value={activeCurrency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="AUD">AUD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={tradeType === 'buy' ? 'default' : 'outline'}
            onClick={() => setTradeType('buy')}
            className="w-full"
          >
            Buy
          </Button>
          <Button
            variant={tradeType === 'sell' ? 'default' : 'outline'}
            onClick={() => setTradeType('sell')}
            className="w-full"
          >
            Sell
          </Button>
        </div>

        <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a coin" />
          </SelectTrigger>
          <SelectContent>
            {availableCoins.map(coin => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCoin && (
          <PriceDisplay
            price={activeCurrency === 'AUD' && selectedCoin.priceAUD 
              ? selectedCoin.priceAUD 
              : selectedCoin.price}
            symbol={selectedCoin.symbol}
            currency={activeCurrency}
            formatValue={formatValue}
          />
        )}

        <div className="space-y-2">
          <Input
            type="number"
            placeholder={`Enter ${tradeType === 'buy' ? 'purchase' : 'sell'} amount`}
            value={tradeAmount}
            onChange={(e) => setTradeAmount(e.target.value)}
          />
          {selectedCoin && tradeAmount && !isNaN(parseFloat(tradeAmount)) && (
            <p className="text-sm text-muted-foreground">
              Total: {formatValue(parseFloat(tradeAmount) * (
                activeCurrency === 'AUD' && selectedCoin.priceAUD 
                  ? selectedCoin.priceAUD 
                  : selectedCoin.price
              ))}
            </p>
          )}
        </div>

        <Button 
          className="w-full" 
          onClick={handleExecuteTrade}
          disabled={!selectedCoinId || !tradeAmount || isNaN(parseFloat(tradeAmount))}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol || 'Coin'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
