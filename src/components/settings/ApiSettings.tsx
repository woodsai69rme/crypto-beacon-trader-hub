
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsComponentProps } from './types';

const ApiSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Settings</CardTitle>
        <CardDescription>
          Configure API providers and connection settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="api.provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Provider</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coingecko">CoinGecko</SelectItem>
                  <SelectItem value="coinlore">CoinLore</SelectItem>
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="okx">OKX</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The data provider used for market information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="api.key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The API key for the selected provider (optional for free APIs).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="api.refreshInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refresh Interval (seconds)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={5}
                  max={3600}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 30)}
                  value={field.value || 30}
                />
              </FormControl>
              <FormDescription>
                How often to refresh data from the API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="api.timeout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeout (seconds)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 10)}
                  value={field.value || 10}
                />
              </FormControl>
              <FormDescription>
                API request timeout duration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ApiSettings;
