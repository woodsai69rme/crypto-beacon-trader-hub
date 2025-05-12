
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface TradingSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const TradingSettings: React.FC<TradingSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Trading Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your trading preferences and defaults
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Select
              value={form.watch("trading.defaultCurrency")}
              onValueChange={(value) => form.setValue("trading.defaultCurrency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Default Timeframe</Label>
            <Select
              value={form.watch("trading.defaultTimeframe")}
              onValueChange={(value) => form.setValue("trading.defaultTimeframe", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Risk Level</Label>
            <Select
              value={form.watch("trading.riskLevel")}
              onValueChange={(value) => form.setValue("trading.riskLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                <SelectItem value="medium">Balanced (Medium Risk)</SelectItem>
                <SelectItem value="high">Aggressive (High Risk)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-trading" className="block">Automated Trading</Label>
              <p className="text-sm text-muted-foreground">Enable AI-powered trading strategies</p>
            </div>
            <Switch
              id="auto-trading"
              checked={form.watch("trading.autoTrading")}
              onCheckedChange={(checked) => form.setValue("trading.autoTrading", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="stop-loss" className="block">Default Stop Loss</Label>
              <p className="text-sm text-muted-foreground">Automatically set stop loss for trades</p>
            </div>
            <Switch
              id="stop-loss"
              checked={form.watch("trading.useStopLoss")}
              onCheckedChange={(checked) => form.setValue("trading.useStopLoss", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="take-profit" className="block">Default Take Profit</Label>
              <p className="text-sm text-muted-foreground">Automatically set take profit for trades</p>
            </div>
            <Switch
              id="take-profit"
              checked={form.watch("trading.useTakeProfit")}
              onCheckedChange={(checked) => form.setValue("trading.useTakeProfit", checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <h4 className="text-sm font-medium mb-3">Default Trade Parameters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Stop Loss (%)</Label>
            <Input 
              type="number"
              value={form.watch("trading.stopLossPercentage")}
              onChange={(e) => form.setValue("trading.stopLossPercentage", parseFloat(e.target.value) || 0)}
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Take Profit (%)</Label>
            <Input 
              type="number"
              value={form.watch("trading.takeProfitPercentage")}
              onChange={(e) => form.setValue("trading.takeProfitPercentage", parseFloat(e.target.value) || 0)}
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Max Position Size (%)</Label>
            <Input 
              type="number"
              value={form.watch("trading.maxPositionSize")}
              onChange={(e) => form.setValue("trading.maxPositionSize", parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSettings;
