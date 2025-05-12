
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoinOption } from '@/types/trading';
import { mockCoinData } from '@/utils/mockData';

export interface PriceAlertFormData {
  coin: string;
  price: number;
  condition: 'above' | 'below';
  notificationMethod: 'email' | 'push' | 'both';
}

interface PriceAlertFormProps {
  formData: PriceAlertFormData;
  onFormChange: (updatedData: PriceAlertFormData) => void;
  onSubmit: () => void;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({ formData, onFormChange, onSubmit }) => {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | undefined>(
    mockCoinData.find(coin => coin.id === formData.coin)
  );
  
  const handleCoinChange = (value: string) => {
    const coin = mockCoinData.find(c => c.id === value);
    setSelectedCoin(coin);
    onFormChange({ ...formData, coin: value });
  };
  
  const handleConditionChange = (value: 'above' | 'below') => {
    onFormChange({ ...formData, condition: value });
  };
  
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value);
    onFormChange({ ...formData, price });
  };
  
  const handleNotificationMethodChange = (value: 'email' | 'push' | 'both') => {
    onFormChange({ ...formData, notificationMethod: value });
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coin">Cryptocurrency</Label>
        <Select value={formData.coin} onValueChange={handleCoinChange}>
          <SelectTrigger id="coin">
            <SelectValue placeholder="Select a cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {mockCoinData.map(coin => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.symbol} - {coin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Alert Condition</Label>
        <RadioGroup 
          value={formData.condition} 
          onValueChange={handleConditionChange as (value: string) => void}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="above" id="above" />
            <Label htmlFor="above" className="cursor-pointer">Above</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="below" id="below" />
            <Label htmlFor="below" className="cursor-pointer">Below</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price (USD)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            value={formData.price || ''}
            onChange={handlePriceChange}
            className="pl-7"
            step="0.01"
            min="0"
          />
        </div>
        
        {selectedCoin && (
          <p className="text-xs text-muted-foreground">
            Current price: ${selectedCoin.price?.toLocaleString() || '0.00'}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notificationMethod">Notification Method</Label>
        <Select value={formData.notificationMethod} onValueChange={handleNotificationMethodChange as (value: string) => void}>
          <SelectTrigger id="notificationMethod">
            <SelectValue placeholder="Select notification method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email Only</SelectItem>
            <SelectItem value="push">Push Notification Only</SelectItem>
            <SelectItem value="both">Both Email and Push</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">
        Create Price Alert
      </Button>
    </form>
  );
};

export default PriceAlertForm;
