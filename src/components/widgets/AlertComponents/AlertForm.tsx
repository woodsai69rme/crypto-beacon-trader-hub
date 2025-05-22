
import React from "react";
import { AlertFormData, AlertType, AlertFrequency, NotificationMethod } from "@/types/alerts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import CryptoSearch from "@/components/CryptoSearch";
import { CoinOption } from "@/types/trading";

interface AlertFormProps {
  formData: AlertFormData;
  onChange: (data: AlertFormData) => void;
  onSubmit: () => void;
}

const AlertForm: React.FC<AlertFormProps> = ({
  formData,
  onChange,
  onSubmit
}) => {
  const handleSelectCoin = (coin: CoinOption) => {
    onChange({
      ...formData,
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol
    });
  };

  const handleTypeChange = (type: AlertType) => {
    onChange({
      ...formData,
      type
    });
  };

  const handleNotificationChange = (method: NotificationMethod, checked: boolean) => {
    const updatedNotifications = checked
      ? [...formData.notifyVia, method]
      : formData.notifyVia.filter(m => m !== method);
    
    onChange({
      ...formData,
      notifyVia: updatedNotifications
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Cryptocurrency</Label>
        <CryptoSearch 
          onSelect={handleSelectCoin} 
          placeholder="Search for a cryptocurrency..."
          className="w-full"
        />
        {formData.coinId && (
          <p className="text-sm text-muted-foreground mt-1">
            Selected: {formData.coinName} ({formData.coinSymbol})
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Alert Type</Label>
        <RadioGroup 
          value={formData.type} 
          onValueChange={(value) => handleTypeChange(value as AlertType)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price" id="price" />
            <Label htmlFor="price">Price Alert</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="volume" id="volume" />
            <Label htmlFor="volume">Volume Alert</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="technical" id="technical" />
            <Label htmlFor="technical">Technical Alert</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pattern" id="pattern" />
            <Label htmlFor="pattern">Pattern Alert</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Alert Fields */}
      {formData.type === "price" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="targetPrice">Target Price (USD)</Label>
            <Input 
              id="targetPrice"
              type="number"
              step="0.0001"
              value={formData.targetPrice}
              onChange={(e) => onChange({...formData, targetPrice: parseFloat(e.target.value) || 0})}
              placeholder="Enter target price"
            />
          </div>

          <div className="space-y-2">
            <Label>Condition</Label>
            <RadioGroup 
              value={formData.isAbove ? "above" : "below"}
              onValueChange={(value) => onChange({...formData, isAbove: value === "above"})}
              className="flex space-x-4"
            >
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

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recurring" 
              checked={formData.recurring}
              onCheckedChange={(checked) => onChange({...formData, recurring: !!checked})}
            />
            <Label htmlFor="recurring">Repeat this alert</Label>
          </div>

          {formData.recurring && (
            <div className="space-y-2">
              <Label htmlFor="percentageChange">Reset after % change</Label>
              <Input 
                id="percentageChange"
                type="number"
                step="0.1"
                value={formData.percentageChange}
                onChange={(e) => onChange({...formData, percentageChange: parseFloat(e.target.value) || 0})}
                placeholder="Enter percentage change"
              />
            </div>
          )}
        </>
      )}

      {/* Volume Alert Fields */}
      {formData.type === "volume" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="volumeThreshold">Volume Increase (%)</Label>
            <Input 
              id="volumeThreshold"
              type="number"
              step="0.1"
              value={formData.volumeThreshold}
              onChange={(e) => onChange({...formData, volumeThreshold: parseFloat(e.target.value) || 0})}
              placeholder="Enter volume threshold"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time Period</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => onChange({...formData, frequency: value as AlertFrequency})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Technical Alert Fields */}
      {formData.type === "technical" && (
        <>
          <div className="space-y-2">
            <Label>Indicator</Label>
            <Select 
              value={formData.indicator} 
              onValueChange={(value) => onChange({...formData, indicator: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RSI">RSI</SelectItem>
                <SelectItem value="MACD">MACD</SelectItem>
                <SelectItem value="MA">Moving Average</SelectItem>
                <SelectItem value="BB">Bollinger Bands</SelectItem>
                <SelectItem value="STOCH">Stochastic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value) => onChange({...formData, condition: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crossover">Crossover</SelectItem>
                <SelectItem value="above">Above Value</SelectItem>
                <SelectItem value="below">Below Value</SelectItem>
                <SelectItem value="increasing">Increasing</SelectItem>
                <SelectItem value="decreasing">Decreasing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input 
              id="value"
              type="number"
              step="0.1"
              value={formData.value}
              onChange={(e) => onChange({...formData, value: parseFloat(e.target.value) || 0})}
              placeholder="Enter value"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select 
              value={formData.timeframe} 
              onValueChange={(value) => onChange({...formData, timeframe: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 minutes</SelectItem>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Pattern Alert Fields */}
      {formData.type === "pattern" && (
        <div className="space-y-2">
          <Label>Pattern</Label>
          <Select 
            value={formData.pattern} 
            onValueChange={(value) => onChange({...formData, pattern: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doubleTop">Double Top</SelectItem>
              <SelectItem value="doubleBottom">Double Bottom</SelectItem>
              <SelectItem value="headAndShoulders">Head and Shoulders</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
              <SelectItem value="flagPattern">Flag Pattern</SelectItem>
              <SelectItem value="wedge">Wedge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Notification Methods</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="notifyApp" 
              checked={formData.notifyVia.includes("app")}
              onCheckedChange={(checked) => handleNotificationChange("app", !!checked)}
            />
            <Label htmlFor="notifyApp">In-App</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="notifyEmail" 
              checked={formData.notifyVia.includes("email")}
              onCheckedChange={(checked) => handleNotificationChange("email", !!checked)}
            />
            <Label htmlFor="notifyEmail">Email</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="notifyPush" 
              checked={formData.notifyVia.includes("push")}
              onCheckedChange={(checked) => handleNotificationChange("push", !!checked)}
            />
            <Label htmlFor="notifyPush">Push Notification</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => onChange({...formData, enabled: checked})}
        />
        <Label htmlFor="enabled">Enable Alert</Label>
      </div>
    </form>
  );
};

export default AlertForm;
