
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { SettingsComponentProps } from './types';

const TradingSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize tradingPreferences if it doesn't exist
  const ensureTradingPreferences = () => {
    const current = form.getValues();
    if (!current.tradingPreferences) {
      form.setValue("tradingPreferences", {
        autoConfirm: true,
        showAdvanced: false,
        defaultAsset: 'BTC',
        defaultTradeSize: 0.1,
        riskLevel: 'medium',
        tradingStrategy: 'default',
        defaultLeverage: 1,
        showPnL: true,
        defaultTimeframe: '1d'
      });
    }
    return current.tradingPreferences || {};
  };
  
  ensureTradingPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Settings</CardTitle>
        <CardDescription>
          Configure your trading preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Auto-confirm trades</FormLabel>
              <FormControl>
                <Switch 
                  checked={form.watch("tradingPreferences")?.autoConfirm} 
                  onCheckedChange={(checked) => {
                    const prefs = ensureTradingPreferences();
                    form.setValue("tradingPreferences", {
                      ...prefs,
                      autoConfirm: checked
                    });
                  }}
                />
              </FormControl>
            </div>
            <FormDescription>
              Automatically confirm trades without prompting
            </FormDescription>
          </FormItem>

          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Show advanced trading options</FormLabel>
              <FormControl>
                <Switch 
                  checked={form.watch("tradingPreferences")?.showAdvanced} 
                  onCheckedChange={(checked) => {
                    const prefs = ensureTradingPreferences();
                    form.setValue("tradingPreferences", {
                      ...prefs,
                      showAdvanced: checked
                    });
                  }}
                />
              </FormControl>
            </div>
            <FormDescription>
              Display advanced trading features like limit orders and stop-losses
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Default Asset</FormLabel>
            <Select 
              value={form.watch("tradingPreferences")?.defaultAsset || "BTC"} 
              onValueChange={(value) => {
                const prefs = ensureTradingPreferences();
                form.setValue("tradingPreferences", {
                  ...prefs,
                  defaultAsset: value
                });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a default asset" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
                <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                <SelectItem value="XRP">XRP</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The asset that will be selected by default when opening the trade form
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Risk Level</FormLabel>
            <Select 
              value={form.watch("tradingPreferences")?.riskLevel || "medium"} 
              onValueChange={(value: 'low' | 'medium' | 'high') => {
                const prefs = ensureTradingPreferences();
                form.setValue("tradingPreferences", {
                  ...prefs,
                  riskLevel: value
                });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Determines stop-loss and take-profit defaults
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Default Trade Size</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0.001" 
                step="0.001"
                value={form.watch("tradingPreferences")?.defaultTradeSize || 0.1} 
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    const prefs = ensureTradingPreferences();
                    form.setValue("tradingPreferences", {
                      ...prefs,
                      defaultTradeSize: value
                    });
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Default size for trades (in crypto units)
            </FormDescription>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSettings;
