
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertFormData } from '@/types/alerts';
import { COIN_OPTIONS } from './AlertTypes';

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
  const handleInputChange = (field: keyof AlertFormData, value: any) => {
    onFormChange({ ...formData, [field]: value });
  };

  const toggleNotificationMethod = (method: 'email' | 'push' | 'app') => {
    const currentMethods = formData.notifyVia || [];
    if (currentMethods.includes(method)) {
      handleInputChange('notifyVia', currentMethods.filter(m => m !== method));
    } else {
      handleInputChange('notifyVia', [...currentMethods, method]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Alert Type</Label>
        <Select
          value={formData.type || 'price'}
          onValueChange={(value: any) => handleInputChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price Alert</SelectItem>
            <SelectItem value="volume">Volume Alert</SelectItem>
            <SelectItem value="pattern">Pattern Alert</SelectItem>
            <SelectItem value="technical">Technical Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Cryptocurrency</Label>
        <Select
          value={formData.coinId || ''}
          onValueChange={(value) => {
            const coin = COIN_OPTIONS[value];
            if (coin) {
              handleInputChange('coinId', coin.id);
              handleInputChange('coinName', coin.name);
              handleInputChange('coinSymbol', coin.symbol);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(COIN_OPTIONS).map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {formData.type === 'price' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Condition</Label>
              <Select
                value={formData.isAbove ? 'above' : 'below'}
                onValueChange={(value) => handleInputChange('isAbove', value === 'above')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Price</Label>
              <Input
                type="number"
                value={formData.targetPrice || ''}
                onChange={(e) => handleInputChange('targetPrice', parseFloat(e.target.value))}
                placeholder="Enter price"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="recurring">Recurring Alert</Label>
            <Switch
              id="recurring"
              checked={formData.recurring || false}
              onCheckedChange={(checked) => handleInputChange('recurring', checked)}
            />
          </div>
          
          {formData.recurring && (
            <div>
              <Label>Percentage Change</Label>
              <Input
                type="number"
                value={formData.percentageChange || ''}
                onChange={(e) => handleInputChange('percentageChange', parseFloat(e.target.value))}
                placeholder="Enter percentage"
              />
            </div>
          )}
        </>
      )}
      
      <div>
        <Label className="mb-2 block">Notification Methods</Label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="app-notification"
              checked={formData.notifyVia?.includes('app') || false}
              onCheckedChange={() => toggleNotificationMethod('app')}
            />
            <Label htmlFor="app-notification">App</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-notification"
              checked={formData.notifyVia?.includes('email') || false}
              onCheckedChange={() => toggleNotificationMethod('email')}
            />
            <Label htmlFor="email-notification">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push-notification"
              checked={formData.notifyVia?.includes('push') || false}
              onCheckedChange={() => toggleNotificationMethod('push')}
            />
            <Label htmlFor="push-notification">Push</Label>
          </div>
        </div>
      </div>
      
      <Button onClick={onSubmit} className="w-full">
        {formData.id ? 'Update Alert' : 'Create Alert'}
      </Button>
    </div>
  );
};
