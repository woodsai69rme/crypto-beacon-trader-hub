
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trade, TradingFormProps } from '@/types/trading';

const TradingForm: React.FC<TradingFormProps> = ({
  onSubmit,
  availableCoins,
  formatCurrency,
  mode = 'paper',
  onTrade,
  selectedCoin,
  balance = 10000
}) => {
  const [formData, setFormData] = useState({
    symbol: selectedCoin?.symbol || '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    orderType: 'market'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const coin = availableCoins.find(c => c.symbol === formData.symbol);
    if (!coin) return;

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      type: formData.type,
      amount: parseFloat(formData.quantity),
      price: coin.price,
      totalValue: parseFloat(formData.quantity) * coin.price,
      timestamp: new Date().toISOString(),
      currency: 'AUD'
    };

    if (onTrade) {
      onTrade(trade);
    }
    onSubmit(trade);
    
    // Reset form
    setFormData({
      ...formData,
      quantity: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Asset</label>
        <Select value={formData.symbol} onValueChange={(value) => setFormData({...formData, symbol: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select asset" />
          </SelectTrigger>
          <SelectContent>
            {availableCoins.map((coin) => (
              <SelectItem key={coin.id} value={coin.symbol}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Order Type</label>
        <Select value={formData.type} onValueChange={(value: 'buy' | 'sell') => setFormData({...formData, type: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <Input
          type="number"
          step="0.00001"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          placeholder="0.001"
        />
      </div>

      <Button type="submit" className="w-full">
        {formData.type === 'buy' ? 'Buy' : 'Sell'} {formData.symbol}
      </Button>
    </form>
  );
};

export default TradingForm;
