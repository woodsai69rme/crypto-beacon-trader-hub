
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Trade, FakeTradingFormProps } from '@/types/trading';
import { toast } from '@/hooks/use-toast';

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ 
  onTrade, 
  selectedCoin, 
  onAddTrade,
  advancedMode = false 
}) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPrice = selectedCoin?.price || 50000;
  const totalValue = parseFloat(amount) * currentPrice || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin || !amount) return;

    setIsSubmitting(true);

    try {
      const trade: Trade = {
        id: `trade-${Date.now()}`,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol,
        symbol: selectedCoin.symbol,
        type: tradeType,
        amount: parseFloat(amount),
        quantity: parseFloat(amount),
        price: currentPrice,
        totalValue: totalValue,
        total: totalValue,
        timestamp: new Date().toISOString(),
        currency: 'AUD'
      };

      onTrade(trade);
      if (onAddTrade) {
        onAddTrade(trade);
      }

      toast({
        title: "Trade Executed",
        description: `Successfully ${tradeType} ${amount} ${selectedCoin.symbol} for $${totalValue.toLocaleString()}`,
      });

      // Reset form
      setAmount('');
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Paper Trading
        </CardTitle>
        <CardDescription>
          Practice trading with virtual funds - no real money involved
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedCoin && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedCoin.image && (
                    <img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <h3 className="font-medium">{selectedCoin.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCoin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${currentPrice.toLocaleString()}</p>
                  {selectedCoin.changePercent && (
                    <Badge variant={selectedCoin.changePercent > 0 ? 'default' : 'destructive'}>
                      {selectedCoin.changePercent > 0 ? '+' : ''}{selectedCoin.changePercent.toFixed(2)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={tradeType === 'buy' ? 'default' : 'outline'}
              onClick={() => setTradeType('buy')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Buy
            </Button>
            <Button
              type="button"
              variant={tradeType === 'sell' ? 'default' : 'outline'}
              onClick={() => setTradeType('sell')}
              className="flex items-center gap-2"
            >
              <TrendingDown className="h-4 w-4" />
              Sell
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({selectedCoin?.symbol || 'BTC'})</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              placeholder="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {amount && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{amount} {selectedCoin?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per unit:</span>
                <span>${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Value:</span>
                <span>${totalValue.toLocaleString()}</span>
              </div>
            </div>
          )}

          {advancedMode && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Advanced Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    placeholder="45000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    placeholder="55000"
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedCoin || !amount || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `${tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} ${selectedCoin?.symbol || 'Asset'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FakeTradingForm;
