
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFrequency, TechnicalAlertFormData } from "@/types/alerts";
import { COIN_OPTIONS, TECHNICAL_INDICATORS } from './AlertTypes';
import { validateFormFields } from "@/utils/formValidation";

interface TechnicalAlertFormProps {
  formData: TechnicalAlertFormData;
  setFormData: React.Dispatch<React.SetStateAction<TechnicalAlertFormData>>;
  onSubmit?: () => void;
}

const TechnicalAlertForm: React.FC<TechnicalAlertFormProps> = ({ 
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

  const handleIndicatorChange = (value: string) => {
    setFormData({
      ...formData,
      indicator: value
    });
  };

  const handleConditionChange = (value: string) => {
    setFormData({
      ...formData,
      condition: value
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    // Validate the value is within acceptable ranges (for example, RSI between 0-100)
    const isValid = validateFormFields(value, [
      (val) => (isNaN(val) ? "Must be a number" : true),
      (val) => (val < 0 || val > 100 ? "Value must be between 0 and 100" : true)
    ]);
    
    if (isValid === true) {
      setFormData({
        ...formData,
        value: value
      });
    }
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

  const getConditionsForIndicator = (indicator: string) => {
    switch (indicator) {
      case 'rsi':
        return [
          { value: 'overbought', label: 'Overbought' },
          { value: 'oversold', label: 'Oversold' }
        ];
      case 'macd':
        return [
          { value: 'cross_up', label: 'Bullish Cross' },
          { value: 'cross_down', label: 'Bearish Cross' }
        ];
      case 'bb':
        return [
          { value: 'upper_touch', label: 'Price Touches Upper Band' },
          { value: 'lower_touch', label: 'Price Touches Lower Band' }
        ];
      default:
        return [
          { value: 'cross_up', label: 'Cross Above' },
          { value: 'cross_down', label: 'Cross Below' }
        ];
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
        <Label htmlFor="indicator">Technical Indicator</Label>
        <Select 
          value={formData.indicator} 
          onValueChange={handleIndicatorChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select indicator" />
          </SelectTrigger>
          <SelectContent>
            {TECHNICAL_INDICATORS.map(indicator => (
              <SelectItem key={indicator.id} value={indicator.id}>
                {indicator.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {formData.indicator && (
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select 
            value={formData.condition} 
            onValueChange={handleConditionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {getConditionsForIndicator(formData.indicator).map(condition => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="value">Value</Label>
        <Input 
          id="value"
          type="number"
          value={formData.value || ''}
          onChange={handleValueChange}
          placeholder="Enter value"
          min="0"
          max="100"
          step="0.1"
        />
        <p className="text-xs text-muted-foreground">
          Enter the threshold value for this technical indicator.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="frequency">Alert Frequency</Label>
        <Select 
          value={formData.frequency || 'once'} 
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="once">Once</SelectItem>
            <SelectItem value="recurring">Every occurrence</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {onSubmit && (
        <Button type="submit" className="w-full mt-4">
          Create Technical Alert
        </Button>
      )}
    </form>
  );
};

export default TechnicalAlertForm;
