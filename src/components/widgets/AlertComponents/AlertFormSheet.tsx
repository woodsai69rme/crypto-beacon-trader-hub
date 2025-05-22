
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertFormData } from '@/types/alerts';

interface AlertFormSheetProps {
  formData: Partial<AlertFormData>;
  onFormChange: (data: Partial<AlertFormData>) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({ 
  formData, 
  onFormChange,
  onSubmit 
}) => {
  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.20 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150 },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.50 },
  ];

  const handleCoinChange = (coinId: string) => {
    const selectedCoin = coins.find(coin => coin.id === coinId);
    if (selectedCoin) {
      onFormChange({
        ...formData,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol,
      });
    }
  };

  const handleNotificationMethodToggle = (method: 'email' | 'push' | 'app') => {
    const currentMethods = formData.notifyVia || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    
    onFormChange({
      ...formData,
      notifyVia: newMethods,
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-1">
        <Label htmlFor="coin">Cryptocurrency</Label>
        <Select
          value={formData.coinId}
          onValueChange={handleCoinChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a coin" />
          </SelectTrigger>
          <SelectContent>
            {coins.map(coin => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="alert-type">Alert Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => onFormChange({ ...formData, type: value as 'price' | 'volume' | 'pattern' | 'technical' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alert type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price Alert</SelectItem>
            <SelectItem value="volume">Volume Alert</SelectItem>
            <SelectItem value="pattern">Pattern Alert</SelectItem>
            <SelectItem value="technical">Technical Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === 'price' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="condition">Condition</Label>
            <div className="flex gap-2">
              <Select
                value={formData.isAbove ? 'above' : 'below'}
                onValueChange={(value) => onFormChange({ ...formData, isAbove: value === 'above' })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="Price"
                value={formData.targetPrice?.toString() || ''}
                onChange={(e) => onFormChange({ ...formData, targetPrice: parseFloat(e.target.value) || 0 })}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.recurring || false}
              onCheckedChange={(checked) => onFormChange({ ...formData, recurring: checked })}
            />
            <Label htmlFor="recurring">Recurring Alert</Label>
          </div>
          
          {formData.recurring && (
            <div className="space-y-1">
              <Label htmlFor="percentage-change">Percentage Change</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Percentage"
                  value={formData.percentageChange?.toString() || ''}
                  onChange={(e) => onFormChange({ 
                    ...formData, 
                    percentageChange: parseFloat(e.target.value) || 0 
                  })}
                />
                <span>%</span>
              </div>
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <Label>Notification Methods</Label>
        
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-app"
              checked={formData.notifyVia?.includes('app') || false}
              onCheckedChange={() => handleNotificationMethodToggle('app')}
            />
            <Label htmlFor="notify-app">App</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-email"
              checked={formData.notifyVia?.includes('email') || false}
              onCheckedChange={() => handleNotificationMethodToggle('email')}
            />
            <Label htmlFor="notify-email">Email</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-push"
              checked={formData.notifyVia?.includes('push') || false}
              onCheckedChange={() => handleNotificationMethodToggle('push')}
            />
            <Label htmlFor="notify-push">Push</Label>
          </div>
        </div>
      </div>

      <Button className="mt-6 w-full" onClick={onSubmit}>
        Create Alert
      </Button>
    </div>
  );
};
