
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart2 } from "lucide-react";
import { SettingsComponentProps } from "./types";

const TradingSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  React.useEffect(() => {
    // Initialize tradingPreferences if they don't exist
    const currentValues = form.getValues();
    if (!currentValues.tradingPreferences) {
      form.setValue('tradingPreferences', {
        autoConfirm: false,
        showAdvanced: false,
        defaultAsset: 'bitcoin',
        defaultTradeSize: 100,
        riskLevel: 'medium'
      }, { shouldValidate: true });
    }
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Trading Preferences
        </CardTitle>
        <CardDescription>
          Configure your trading preferences and settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Auto Confirm Orders</FormLabel>
              <FormDescription>
                Skip confirmation dialogs for orders
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues()?.tradingPreferences?.autoConfirm || false}
                onCheckedChange={(checked) => {
                  const currentPrefs = form.getValues()?.tradingPreferences || { autoConfirm: false };
                  form.setValue('tradingPreferences', {
                    ...currentPrefs,
                    autoConfirm: checked
                  }, { shouldValidate: true });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Show Advanced Features</FormLabel>
              <FormDescription>
                Display advanced trading options and analytics
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues()?.tradingPreferences?.showAdvanced || false}
                onCheckedChange={(checked) => {
                  const currentPrefs = form.getValues()?.tradingPreferences || { autoConfirm: false };
                  form.setValue('tradingPreferences', {
                    ...currentPrefs,
                    showAdvanced: checked
                  }, { shouldValidate: true });
                }}
              />
            </FormControl>
          </div>
          
          <div className="space-y-2">
            <FormLabel>Default Asset</FormLabel>
            <Select
              value={form.getValues()?.tradingPreferences?.defaultAsset || 'bitcoin'}
              onValueChange={(value) => {
                const currentPrefs = form.getValues()?.tradingPreferences || { autoConfirm: false };
                form.setValue('tradingPreferences', {
                  ...currentPrefs,
                  defaultAsset: value
                }, { shouldValidate: true });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select default asset" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                <SelectItem value="solana">Solana (SOL)</SelectItem>
                <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                <SelectItem value="ripple">Ripple (XRP)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Asset to show by default in trading views
            </FormDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSettings;
