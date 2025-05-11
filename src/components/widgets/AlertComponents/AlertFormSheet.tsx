
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { COIN_OPTIONS, PriceAlertFormData } from './AlertTypes';

export interface AlertFormSheetProps {
  onFormChange: (formData: PriceAlertFormData) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({ onFormChange, onSubmit }) => {
  const [alertType, setAlertType] = useState<'price' | 'volume' | 'technical'>('price');
  const [coinId, setCoinId] = useState<string>('bitcoin');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [isAbove, setIsAbove] = useState<boolean>(true);
  const [notificationChannels, setNotificationChannels] = useState<string[]>(['app']);

  // Update parent component with form data
  const updateFormData = () => {
    if (!coinId || !COIN_OPTIONS[coinId]) return;
    
    const formData: PriceAlertFormData = {
      coinId,
      coinName: COIN_OPTIONS[coinId].name,
      coinSymbol: COIN_OPTIONS[coinId].symbol,
      targetPrice: parseFloat(targetPrice) || 0,
      isAbove,
      recurring: false,
      percentageChange: 0,
      enabled: true,
      notifyVia: notificationChannels.map(c => c as "app" | "email" | "push")
    };
    
    onFormChange(formData);
  };

  // Update form data whenever any input changes
  React.useEffect(() => {
    updateFormData();
  }, [coinId, targetPrice, isAbove, notificationChannels, alertType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="price" onValueChange={(value) => setAlertType(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="price">Price Alert</TabsTrigger>
          <TabsTrigger value="volume">Volume Alert</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coin">Coin</Label>
            <Select value={coinId} onValueChange={setCoinId}>
              <SelectTrigger id="coin">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COIN_OPTIONS).map(([key, coin]) => (
                  <SelectItem key={key} value={key}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <RadioGroup value={isAbove ? "above" : "below"} onValueChange={(v) => setIsAbove(v === "above")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="above" id="above" />
                <Label htmlFor="above">Price goes above</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="below" id="below" />
                <Label htmlFor="below">Price goes below</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Target Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Notification Method</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify-app" 
                  checked={notificationChannels.includes('app')}
                  onCheckedChange={(checked) => {
                    setNotificationChannels(prev => 
                      checked 
                        ? [...prev, 'app'] 
                        : prev.filter(c => c !== 'app')
                    );
                  }}
                />
                <Label htmlFor="notify-app">In-app notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify-email" 
                  checked={notificationChannels.includes('email')}
                  onCheckedChange={(checked) => {
                    setNotificationChannels(prev => 
                      checked 
                        ? [...prev, 'email'] 
                        : prev.filter(c => c !== 'email')
                    );
                  }}
                />
                <Label htmlFor="notify-email">Email notification</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="volume" className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Volume alerts coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Technical alerts coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full">Create Alert</Button>
    </form>
  );
};

export default AlertFormSheet;
