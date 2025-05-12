
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PriceAlertFormData, COIN_OPTIONS } from './AlertComponents/AlertTypes';

interface PriceAlertFormProps {
  formData: PriceAlertFormData;
  onSubmit?: () => void;
  onFormChange: (updatedData: PriceAlertFormData) => void;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({ 
  formData, 
  onSubmit,
  onFormChange
}) => {
  const coins = COIN_OPTIONS;

  const handleChange = (field: keyof PriceAlertFormData, value: any) => {
    const updatedData = { ...formData, [field]: value };
    onFormChange(updatedData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coin">Cryptocurrency</Label>
        <Select 
          value={formData.coinId} 
          onValueChange={(value) => {
            const selectedCoin = coins.find(c => c.id === value);
            handleChange('coinId', value);
            handleChange('coinName', selectedCoin?.name || '');
            handleChange('coinSymbol', selectedCoin?.symbol || '');
            handleChange('currentPrice', selectedCoin?.price || 0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coin" />
          </SelectTrigger>
          <SelectContent>
            {coins.map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Alert Condition</Label>
        <RadioGroup 
          value={formData.isAbove ? 'above' : 'below'} 
          onValueChange={(value) => handleChange('isAbove', value === 'above')}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="above" id="above" />
            <Label htmlFor="above">Price Above</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="below" id="below" />
            <Label htmlFor="below">Price Below</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetPrice">Target Price (USD)</Label>
        <Input
          id="targetPrice"
          type="number"
          step="0.01"
          value={formData.targetPrice}
          onChange={(e) => handleChange('targetPrice', parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          placeholder="Add any notes about this alert"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      {onSubmit && (
        <Button 
          className="w-full mt-4" 
          onClick={onSubmit}
          disabled={!formData.coinId || !formData.targetPrice}
        >
          Create Alert
        </Button>
      )}
    </div>
  );
};

export default PriceAlertForm;
