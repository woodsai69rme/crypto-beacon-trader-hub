
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFrequency, VolumeAlertFormData } from "@/types/alerts";
import { COIN_OPTIONS } from './AlertTypes';

interface VolumeAlertFormProps {
  formData: VolumeAlertFormData;
  setFormData: React.Dispatch<React.SetStateAction<VolumeAlertFormData>>;
  onSubmit?: () => void;
}

const VolumeAlertForm: React.FC<VolumeAlertFormProps> = ({ 
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

  const handleFrequencyChange = (value: string) => {
    setFormData({
      ...formData,
      frequency: value as AlertFrequency
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({
      ...formData,
      volumeThreshold: isNaN(value) ? 0 : value
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
        <Label htmlFor="volume-threshold">Volume Threshold (%)</Label>
        <Input 
          id="volume-threshold"
          type="number"
          value={formData.volumeThreshold}
          onChange={handleVolumeChange}
          placeholder="Enter volume threshold"
          min="0"
          step="0.1"
        />
        <p className="text-xs text-muted-foreground">
          Alert when volume increases by this percentage.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="frequency">Time Period</Label>
        <Select 
          value={formData.frequency}
          onValueChange={handleFrequencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="4h">4 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {onSubmit && (
        <Button type="submit" className="w-full mt-4">
          Create Volume Alert
        </Button>
      )}
    </form>
  );
};

export default VolumeAlertForm;
