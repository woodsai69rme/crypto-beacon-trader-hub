
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Trade, CoinOption, FakeTradingFormProps } from '@/types/trading';
import { useCurrency } from '@/contexts/CurrencyContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({
  onAddTrade,
  advancedMode = false
}) => {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(50000);
  const [coins] = useState<CoinOption[]>([
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 50000,
      priceChange: 1200,
      changePercent: 2.45,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)',
      image: ''
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3200,
      priceChange: 85,
      changePercent: 2.73,
      value: 'ethereum',
      label: 'Ethereum (ETH)',
      image: ''
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.65,
      priceChange: 0.02,
      changePercent: 3.17,
      value: 'cardano',
      label: 'Cardano (ADA)',
      image: ''
    }
  ]);

  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const coin = coins.find(c => c.id === selectedCoin);
    if (coin) {
      setCurrentPrice(coin.price);
    }
  }, [selectedCoin, coins]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trade amount",
        variant: "destructive"
      });
      return;
    }

    const coin = coins.find(c => c.id === selectedCoin);
    if (!coin) return;

    const trade: Trade = {
      id: uuidv4(),
      coinId: selectedCoin,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      type: tradeType,
      amount: amount,
      price: currentPrice,
      totalValue: amount * currentPrice,
      total: amount * currentPrice,
      timestamp: new Date().toISOString(),
      currency: 'AUD'
    };

    if (onAddTrade) {
      onAddTrade(trade);
    }

    toast({
      title: "Trade Executed",
      description: `${tradeType.toUpperCase()} order for ${amount} ${coin.symbol} at ${formatCurrency(currentPrice)}`,
    });

    // Reset form
    setAmount(0);
  };

  const selectedCoinData = coins.find(c => c.id === selectedCoin);
  const totalValue = amount * currentPrice;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {advancedMode ? 'Advanced Trading' : 'Paper Trading'}
        </CardTitle>
        <CardDescription>
          Practice trading with virtual AUD funds
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trade Type Selection */}
          <div className="space-y-2">
            <Label>Trade Type</Label>
            <RadioGroup
              value={tradeType}
              onValueChange={(value) => setTradeType(value as 'buy' | 'sell')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy" id="buy" />
                <Label htmlFor="buy" className="cursor-pointer flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Buy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sell" id="sell" />
                <Label htmlFor="sell" className="cursor-pointer flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Sell
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Coin Selection */}
          <div className="space-y-2">
            <Label htmlFor="coin">Select Cryptocurrency</Label>
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a coin" />
              </SelectTrigger>
              <SelectContent>
                {coins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{coin.name} ({coin.symbol})</span>
                      <span className="ml-2">{formatCurrency(coin.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Price Display */}
          {selectedCoinData && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-semibold">{formatCurrency(selectedCoinData.price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <div className="flex items-center gap-1">
                    <Badge variant={selectedCoinData.changePercent >= 0 ? "default" : "destructive"}>
                      {selectedCoinData.changePercent >= 0 ? '+' : ''}{selectedCoinData.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount ({selectedCoinData?.symbol})
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00000000"
            />
          </div>

          {/* Advanced Mode Features */}
          {advancedMode && (
            <div className="space-y-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium">Advanced Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="5.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit (%)</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="10.0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Total Value Display */}
          {amount > 0 && (
            <div className="p-3 bg-primary/5 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Value:</span>
                <span className="text-lg font-bold">{formatCurrency(totalValue)}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={amount <= 0}
            variant={tradeType === 'buy' ? 'default' : 'destructive'}
          >
            {tradeType === 'buy' ? (
              <TrendingUp className="h-4 w-4 mr-2" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-2" />
            )}
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoinData?.symbol}
          </Button>

          {/* Trading Info */}
          <div className="text-xs text-muted-foreground text-center">
            Paper trading uses virtual funds. No real money is involved.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FakeTradingForm;
