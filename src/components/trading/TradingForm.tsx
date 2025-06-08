
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TradingFormProps, Trade } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

const TradingForm: React.FC<TradingFormProps> = ({
  mode,
  onSubmit,
  selectedCoin,
  balance = 10000,
  availableCoins = [],
  onTrade
}) => {
  const { toast } = useToast();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCoin || !quantity) {
      toast({
        title: "Invalid Order",
        description: "Please select a coin and enter quantity",
        variant: "destructive"
      });
      return;
    }

    const orderPrice = orderType === 'market' ? selectedCoin.price : parseFloat(price);
    const orderQuantity = parseFloat(quantity);
    const totalValue = orderPrice * orderQuantity;

    if (side === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds for this order",
        variant: "destructive"
      });
      return;
    }

    const trade: Trade = {
      id: Date.now().toString(),
      symbol: selectedCoin.symbol,
      type: side,
      quantity: orderQuantity,
      price: orderPrice,
      totalValue,
      timestamp: new Date().toISOString(),
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol
    };

    if (onTrade) {
      onTrade(trade);
    }

    onSubmit({
      ...trade,
      mode,
      orderType
    });

    toast({
      title: "Order Placed",
      description: `${side.toUpperCase()} order for ${quantity} ${selectedCoin.symbol} placed successfully`,
    });

    // Reset form
    setQuantity('');
    setPrice('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const estimatedTotal = selectedCoin && quantity ? 
    (orderType === 'market' ? selectedCoin.price : parseFloat(price || '0')) * parseFloat(quantity || '0') : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Trading Form
          <Badge variant={mode === 'paper' ? 'secondary' : 'default'}>
            {mode === 'paper' ? 'Paper Trading' : 'Live Trading'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selected Coin Display */}
          {selectedCoin && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{selectedCoin.symbol}</h4>
                  <p className="text-sm text-muted-foreground">{selectedCoin.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(selectedCoin.price)}</div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Side</Label>
              <Select value={side} onValueChange={(value: 'buy' | 'sell') => setSide(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.00001"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {orderType === 'limit' && (
            <div className="space-y-2">
              <Label htmlFor="price">Limit Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter limit price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}

          {/* Order Summary */}
          {selectedCoin && quantity && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity} {selectedCoin.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>{formatCurrency(orderType === 'market' ? selectedCoin.price : parseFloat(price || '0'))}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available Balance:</span>
              <span className="font-medium">{formatCurrency(balance)}</span>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedCoin || !quantity}
            >
              Place {side.toUpperCase()} Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
