
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriceAlertFormData, AlertFrequency } from "@/types/alerts";
import { COIN_OPTIONS } from './AlertTypes';

interface PriceAlertFormProps {
  formData: PriceAlertFormData;
  setFormData: React.Dispatch<React.SetStateAction<PriceAlertFormData>>;
  onSubmit?: () => void;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({ 
  formData, 
  setFormData,
  onSubmit
}) => {
  const handleCoinChange = (value: string) => {
    const selectedCoin = COIN_OPTIONS.find(coin => coin.id === value);
    if (selectedCoin) {
      setFormData({
        ...formData,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol
      });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      targetPrice: isNaN(value) ? 0 : value
    });
  };

  const handleDirectionChange = (value: string) => {
    setFormData({
      ...formData,
      isAbove: value === 'above'
    });
  };

  const handleRecurringChange = (checked: boolean) => {
    setFormData({
      ...formData,
      recurring: checked
    });
  };

  const handleFrequencyChange = (value: string) => {
    setFormData({
      ...formData,
      frequency: value as AlertFrequency
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coin-select">Cryptocurrency</Label>
        <Select 
          value={formData.coinId} 
          onValueChange={handleCoinChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coin" />
          </SelectTrigger>
          <SelectContent>
            {COIN_OPTIONS.map(coin => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target-price">Target Price</Label>
        <Input 
          id="target-price"
          type="number"
          value={formData.targetPrice || ''}
          onChange={handlePriceChange}
          placeholder="Enter target price"
          step="any"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="direction">Price Direction</Label>
        <Select 
          value={formData.isAbove ? 'above' : 'below'} 
          onValueChange={handleDirectionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="above">Price Above</SelectItem>
            <SelectItem value="below">Price Below</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="recurring"
          checked={formData.recurring} 
          onCheckedChange={handleRecurringChange}
        />
        <Label htmlFor="recurring" className="cursor-pointer">
          Repeat alert
        </Label>
      </div>
      
      {formData.recurring && (
        <div className="space-y-2">
          <Label htmlFor="frequency">Alert Frequency</Label>
          <Select 
            value={formData.frequency} 
            onValueChange={handleFrequencyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {onSubmit && (
        <Button type="submit" className="w-full mt-4">
          Create Price Alert
        </Button>
      )}
    </form>
  );
};

export default PriceAlertForm;
