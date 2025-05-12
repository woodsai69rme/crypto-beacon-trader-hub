
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { SupportedCurrency, SettingsFormValues } from '@/types/trading';
import SidebarSettings from './SidebarSettings';

const settingsFormSchema = z.object({
  currency: z.object({
    defaultCurrency: z.enum(['USD', 'EUR', 'GBP', 'AUD']),
    showPriceInBTC: z.boolean().default(false),
  }),
  api: z.object({
    selectedProvider: z.string(),
    refreshInterval: z.number().min(5).max(600),
    timeout: z.number().min(1).max(60),
  }),
  display: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    compactMode: z.boolean().default(false),
    showAllDecimals: z.boolean().default(false),
  }),
  // Optional fields
  username: z.string().optional(),
  displayName: z.string().optional(),
  email: z.string().optional(),
  language: z.string().optional(),
  theme: z.string().optional(),
  ticker: z.object({
    enabled: z.boolean().default(false),
    position: z.string().default('top'),
    speed: z.number().default(5),
    direction: z.string().default('ltr'),
    autoPause: z.boolean().default(true),
  }).optional(),
});

const defaultSettings: z.infer<typeof settingsFormSchema> = {
  currency: {
    defaultCurrency: 'USD',
    showPriceInBTC: false,
  },
  api: {
    selectedProvider: 'coingecko',
    refreshInterval: 30,
    timeout: 15,
  },
  display: {
    theme: 'system',
    compactMode: false,
    showAllDecimals: false,
  },
  ticker: {
    enabled: false,
    position: 'top',
    speed: 5,
    direction: 'ltr',
    autoPause: true,
  }
};

export const Settings = () => {
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: defaultSettings,
  });

  function onSubmit(data: z.infer<typeof settingsFormSchema>) {
    // Save settings
    localStorage.setItem('userSettings', JSON.stringify(data));
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>
                    Configure your preferred currency and display options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="currency.defaultCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                            <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          All prices will be displayed in this currency by default.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency.showPriceInBTC"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Show Prices in BTC</FormLabel>
                          <FormDescription>
                            Display alternative prices in Bitcoin
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="mt-6">
                <SidebarSettings form={form} />
              </div>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>
                    Configure API providers and data refresh settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="api.selectedProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default API Provider</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an API provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="coingecko">CoinGecko</SelectItem>
                            <SelectItem value="cryptocompare">CryptoCompare</SelectItem>
                            <SelectItem value="binance">Binance</SelectItem>
                            <SelectItem value="coinmarketcap">CoinMarketCap</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred data provider for market data.
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
                        <FormLabel>Data Refresh Interval (seconds)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={5} 
                            max={600}
                            value={field.value}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          How often to refresh market data (5-600 seconds)
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
                        <FormLabel>API Request Timeout (seconds)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={60}
                            value={field.value}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum time to wait for API responses (1-60 seconds)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="display.theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred theme or use system settings.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="display.showAllDecimals"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Show All Decimals</FormLabel>
                          <FormDescription>
                            Display full precision for cryptocurrency prices
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default Settings;
