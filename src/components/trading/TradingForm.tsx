
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradingFormProps, Trade } from '@/types/trading';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

const TradingForm: React.FC<TradingFormProps> = ({
  balance,
  availableCoins,
  onTrade,
  getOwnedCoinAmount,
  activeCurrency,
  onCurrencyChange,
  conversionRate
}) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const selectedCoinData = availableCoins.find(coin => coin.id === selectedCoin);
  const ownedAmount = selectedCoin ? getOwnedCoinAmount(selectedCoin) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoinData || !amount || !price) return;

    const tradeAmount = parseFloat(amount);
    const tradePrice = parseFloat(price);
    const totalValue = tradeAmount * tradePrice;

    const trade: Partial<Trade> = {
      coinId: selectedCoinData.id,
      coinName: selectedCoinData.name,
      coinSymbol: selectedCoinData.symbol,
      type: tradeType,
      amount: tradeAmount,
      price: tradePrice,
      totalValue,
      currency: activeCurrency,
      total: totalValue,
      timestamp: new Date().toISOString(),
      fees: totalValue * 0.001 // 0.1% fee
    };

    onTrade(trade);
    
    // Reset form
    setAmount('');
    setPrice('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Trading Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trade Type Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={tradeType === 'buy' ? 'default' : 'outline'}
              onClick={() => setTradeType('buy')}
              className={tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy
            </Button>
            <Button
              type="button"
              variant={tradeType === 'sell' ? 'default' : 'outline'}
              onClick={() => setTradeType('sell')}
              className={tradeType === 'sell' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell
            </Button>
          </div>

          {/* Coin Selection */}
          <div>
            <Label htmlFor="coin">Cryptocurrency</Label>
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">
              Amount {selectedCoinData ? `(${selectedCoinData.symbol})` : ''}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            {tradeType === 'sell' && selectedCoin && (
              <div className="text-sm text-muted-foreground mt-1">
                Available: {ownedAmount.toFixed(8)} {selectedCoinData?.symbol}
              </div>
            )}
          </div>

          {/* Price Input */}
          <div>
            <Label htmlFor="price">Price ({activeCurrency})</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
            {selectedCoinData && (
              <div className="text-sm text-muted-foreground mt-1">
                Market price: ${selectedCoinData.price.toFixed(2)}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {selectedCoinData && amount && price && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span>{activeCurrency} {(parseFloat(amount) * parseFloat(price)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees (0.1%):</span>
                  <span>{activeCurrency} {(parseFloat(amount) * parseFloat(price) * 0.001).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{activeCurrency} {(parseFloat(amount) * parseFloat(price) * 1.001).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedCoin || !amount || !price}>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoinData?.symbol || 'Crypto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
