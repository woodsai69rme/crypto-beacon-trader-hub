
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CoinOption } from '@/types/trading';
import { mockCoinData } from '@/utils/mockData';

interface PriceAlertFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [coin, setCoin] = useState(initialData?.coin || '');
  const [condition, setCondition] = useState(initialData?.condition || 'above');
  const [price, setPrice] = useState(initialData?.price || '');
  const [repeat, setRepeat] = useState(initialData?.repeat || false);
  const [email, setEmail] = useState(initialData?.email || true);
  const [push, setPush] = useState(initialData?.push || true);
  
  // Get the selected coin's current price for reference
  const selectedCoin = mockCoinData.find(c => c.id === coin);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        type: 'price',
        coin,
        condition,
        price: parseFloat(price),
        repeat,
        notifications: {
          email,
          push
        },
        createdAt: new Date().toISOString()
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coin">Cryptocurrency</Label>
        <Select 
          value={coin} 
          onValueChange={setCoin}
          required
        >
          <SelectTrigger id="coin">
            <SelectValue placeholder="Select a cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {mockCoinData.map(coin => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.symbol.toUpperCase()} - {coin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select 
            value={condition} 
            onValueChange={setCondition}
            required
          >
            <SelectTrigger id="condition">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Price Above</SelectItem>
              <SelectItem value="below">Price Below</SelectItem>
              <SelectItem value="percent-increase">% Increase</SelectItem>
              <SelectItem value="percent-decrease">% Decrease</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.00000001"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
      </div>
      
      {selectedCoin && selectedCoin.price && (
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Current price:</span>
          <span className="font-mono">${selectedCoin.price.toLocaleString()}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="repeat">Repeat Alert</Label>
          <Switch id="repeat" checked={repeat} onCheckedChange={setRepeat} />
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled, this alert will continue to trigger whenever conditions are met.
        </p>
      </div>
      
      <div className="border rounded-md p-3 space-y-2">
        <h3 className="text-sm font-medium">Notification Methods</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notification" className="cursor-pointer">Email Notification</Label>
          <Switch id="email-notification" checked={email} onCheckedChange={setEmail} />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notification" className="cursor-pointer">Push Notification</Label>
          <Switch id="push-notification" checked={push} onCheckedChange={setPush} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Create Alert</Button>
      </div>
    </form>
  );
};

export default PriceAlertForm;
