
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { VolumeAlertFormData, COIN_OPTIONS } from "./AlertTypes";

interface VolumeAlertFormProps {
  formData: VolumeAlertFormData;
  onFormChange: (data: VolumeAlertFormData) => void;
}

export const VolumeAlertForm: React.FC<VolumeAlertFormProps> = ({ formData, onFormChange }) => {
  const handleCoinChange = (coinId: string) => {
    const selectedCoin = COIN_OPTIONS.find(coin => coin.id === coinId);
    
    if (selectedCoin) {
      onFormChange({
        ...formData,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol
      });
    }
  };
  
  const handleVolumeThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({
      ...formData,
      volumeThreshold: parseFloat(e.target.value) || 0
    });
  };
  
  const handleIsAboveChange = (value: string) => {
    onFormChange({
      ...formData,
      isAbove: value === 'above'
    });
  };
  
  const handleNotifyViaChange = (method: string) => {
    const currentNotifyVia = [...formData.notifyVia];
    
    if (currentNotifyVia.includes(method)) {
      onFormChange({
        ...formData,
        notifyVia: currentNotifyVia.filter(m => m !== method)
      });
    } else {
      onFormChange({
        ...formData,
        notifyVia: [...currentNotifyVia, method]
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coin">Cryptocurrency</Label>
        <Select
          value={formData.coinId}
          onValueChange={handleCoinChange}
        >
          <SelectTrigger id="coin">
            <SelectValue placeholder="Select cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {COIN_OPTIONS.map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.symbol} - {coin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="volume-threshold">Volume Threshold (in USD)</Label>
        <Input
          id="volume-threshold"
          type="number"
          value={formData.volumeThreshold || ''}
          onChange={handleVolumeThresholdChange}
          placeholder="0"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="condition">Volume Condition</Label>
        <Select
          value={formData.isAbove ? 'above' : 'below'}
          onValueChange={handleIsAboveChange}
        >
          <SelectTrigger id="condition">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="above">Volume goes above threshold</SelectItem>
            <SelectItem value="below">Volume goes below threshold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timeframe">Timeframe</Label>
        <Select
          value={formData.timeframe}
          onValueChange={(value) => onFormChange({ ...formData, timeframe: value })}
        >
          <SelectTrigger id="timeframe">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1 Hour</SelectItem>
            <SelectItem value="4h">4 Hours</SelectItem>
            <SelectItem value="12h">12 Hours</SelectItem>
            <SelectItem value="24h">24 Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Notification Method</Label>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-app"
              checked={formData.notifyVia.includes('app')}
              onCheckedChange={() => handleNotifyViaChange('app')}
            />
            <label
              htmlFor="notify-app"
              className="text-sm font-medium leading-none"
            >
              In-App Notification
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-email"
              checked={formData.notifyVia.includes('email')}
              onCheckedChange={() => handleNotifyViaChange('email')}
            />
            <label
              htmlFor="notify-email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="alert-active"
          checked={formData.enabled}
          onCheckedChange={(checked) => onFormChange({ ...formData, enabled: checked })}
        />
        <Label htmlFor="alert-active">
          Alert Active
        </Label>
      </div>
    </div>
  );
};

export default VolumeAlertForm;
