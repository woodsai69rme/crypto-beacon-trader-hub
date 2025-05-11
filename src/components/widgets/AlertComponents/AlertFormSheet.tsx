
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFormData } from '@/hooks/use-alert-form';
import { COIN_OPTIONS } from './AlertTypes';

interface AlertFormSheetProps {
  formData: AlertFormData;
  onFormChange: (formData: AlertFormData) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({ 
  formData, 
  onFormChange, 
  onSubmit 
}) => {
  const handleChange = (field: keyof AlertFormData, value: any) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-medium">Create Price Alert</h3>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="coin-select">Select Coin</Label>
          <Select 
            value={formData.coinId}
            onValueChange={(value) => {
              const coin = COIN_OPTIONS[value];
              if (coin) {
                handleChange('coinId', coin.id);
                handleChange('coinName', coin.name);
                handleChange('coinSymbol', coin.symbol);
              }
            }}
          >
            <SelectTrigger id="coin-select">
              <SelectValue placeholder="Select a coin" />
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
        
        <div className="space-y-2">
          <Label htmlFor="alert-price">Alert Price (USD)</Label>
          <Input 
            id="alert-price"
            type="number" 
            value={formData.targetPrice || ''} 
            onChange={(e) => handleChange('targetPrice', parseFloat(e.target.value))}
            placeholder="Enter price"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Alert Condition</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button"
                variant={formData.isAbove ? "default" : "outline"}
                onClick={() => handleChange('isAbove', true)}
                className="w-full"
              >
                Above
              </Button>
              <Button 
                type="button"
                variant={!formData.isAbove ? "default" : "outline"}
                onClick={() => handleChange('isAbove', false)}
                className="w-full"
              >
                Below
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring-alert">Recurring</Label>
              <Switch 
                id="recurring-alert" 
                checked={formData.recurring} 
                onCheckedChange={(value) => handleChange('recurring', value)} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Trigger every time the condition is met
            </p>
          </div>
        </div>
        
        <Button 
          type="button" 
          className="w-full" 
          onClick={onSubmit}
        >
          Create Alert
        </Button>
      </div>
    </div>
  );
};
