
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fetchCoinOptions } from '@/services/cryptoApi';
import { AlertFormSheetProps, PriceAlertFormData } from './AlertTypes';
import { CoinOption } from '@/types/trading';

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({ 
  onFormChange, 
  onSubmit, 
  initialData 
}) => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PriceAlertFormData>(initialData || {
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    percentageChange: 0,
    enabled: true,
    notifyVia: ['app']
  });

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const options = await fetchCoinOptions();
        setCoins(options);
        
        // Set initial price if a coin is selected
        if (formData.coinId) {
          const selectedCoin = options.find(c => c.id === formData.coinId);
          if (selectedCoin && formData.targetPrice === 0) {
            updateFormData('targetPrice', selectedCoin.price);
          }
        }
      } catch (error) {
        console.error("Failed to load coins:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, []);
  
  const updateFormData = (field: keyof PriceAlertFormData, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onFormChange(updatedData);
  };
  
  const handleCoinChange = (coinId: string) => {
    const selectedCoin = coins.find(c => c.id === coinId);
    if (selectedCoin) {
      updateFormData('coinId', coinId);
      updateFormData('coinName', selectedCoin.name);
      updateFormData('coinSymbol', selectedCoin.symbol);
      updateFormData('targetPrice', selectedCoin.price);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Create Price Alert</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coin">Cryptocurrency</Label>
          <Select
            value={formData.coinId}
            onValueChange={handleCoinChange}
            disabled={loading}
          >
            <SelectTrigger id="coin">
              <SelectValue placeholder="Select a coin" />
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
        
        <div className="space-y-2">
          <Label htmlFor="price-condition">Condition</Label>
          <RadioGroup
            value={formData.isAbove ? "above" : "below"}
            onValueChange={(value) => updateFormData('isAbove', value === "above")}
            className="flex gap-4"
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
          <Label htmlFor="target-price">Target Price (USD)</Label>
          <Input
            id="target-price"
            type="number"
            value={formData.targetPrice}
            onChange={(e) => updateFormData('targetPrice', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.recurring}
            onCheckedChange={(checked) => updateFormData('recurring', checked)}
            id="recurring"
          />
          <Label htmlFor="recurring">Recurring Alert</Label>
        </div>
        
        <Button onClick={onSubmit} className="w-full">
          Create Alert
        </Button>
      </div>
    </div>
  );
};
