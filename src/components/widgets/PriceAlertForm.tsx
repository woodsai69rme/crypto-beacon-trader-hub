
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CoinOption } from '@/types/trading';
import { mockCoinData } from '@/utils/mockData';

export interface PriceAlertFormData {
  coin: string;
  condition: string;
  price: string;
  repeat: boolean;
  email: boolean;
  push: boolean;
}

interface PriceAlertFormProps {
  initialData?: PriceAlertFormData;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  // Added props for form controlled from parent
  formData?: PriceAlertFormData;
  onFormChange?: (data: PriceAlertFormData) => void;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  formData,
  onFormChange
}) => {
  // Initialize state with formData if it exists, otherwise use initialData or defaults
  const [internalFormData, setInternalFormData] = useState<PriceAlertFormData>({
    coin: initialData?.coin || '',
    condition: initialData?.condition || 'above',
    price: initialData?.price || '',
    repeat: initialData?.repeat || false,
    email: initialData?.email || true,
    push: initialData?.push || true,
  });

  // Handle external or internal form control
  const isExternallyControlled = formData !== undefined && onFormChange !== undefined;
  const currentFormData = isExternallyControlled ? formData : internalFormData;
  
  // When formData changes externally, update internal state
  useEffect(() => {
    if (isExternallyControlled && formData) {
      setInternalFormData(formData);
    }
  }, [isExternallyControlled, formData]);
  
  const handleChange = (field: keyof PriceAlertFormData, value: any) => {
    if (isExternallyControlled && onFormChange) {
      onFormChange({ ...currentFormData, [field]: value });
    } else {
      setInternalFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Get the selected coin's current price for reference
  const selectedCoin = mockCoinData.find(c => c.id === currentFormData.coin);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        type: 'price',
        ...currentFormData,
        price: parseFloat(currentFormData.price),
        notifications: {
          email: currentFormData.email,
          push: currentFormData.push
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
          value={currentFormData.coin} 
          onValueChange={(value) => handleChange('coin', value)}
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
            value={currentFormData.condition} 
            onValueChange={(value) => handleChange('condition', value)}
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
            value={currentFormData.price}
            onChange={e => handleChange('price', e.target.value)}
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
          <Switch 
            id="repeat" 
            checked={currentFormData.repeat} 
            onCheckedChange={(checked) => handleChange('repeat', checked)} 
          />
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled, this alert will continue to trigger whenever conditions are met.
        </p>
      </div>
      
      <div className="border rounded-md p-3 space-y-2">
        <h3 className="text-sm font-medium">Notification Methods</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notification" className="cursor-pointer">Email Notification</Label>
          <Switch 
            id="email-notification" 
            checked={currentFormData.email} 
            onCheckedChange={(checked) => handleChange('email', checked)} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notification" className="cursor-pointer">Push Notification</Label>
          <Switch 
            id="push-notification" 
            checked={currentFormData.push} 
            onCheckedChange={(checked) => handleChange('push', checked)} 
          />
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
