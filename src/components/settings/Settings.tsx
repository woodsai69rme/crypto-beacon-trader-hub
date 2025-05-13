
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';
import ApiSettings from './ApiSettings';
import TickerSettings from './TickerSettings';
import { SupportedCurrency, SettingsFormValues } from '@/types/trading';

const settingsFormSchema = z.object({
  currency: z.object({
    defaultCurrency: z.enum(['USD', 'EUR', 'GBP', 'AUD']),
    showPriceInBTC: z.boolean(),
  }),
  api: z.object({
    provider: z.string(),
    key: z.string().optional(),
    selectedProvider: z.string().optional(),
    refreshInterval: z.number().optional(),
    timeout: z.number().optional(),
  }),
  display: z.object({
    showPortfolio: z.boolean(),
    defaultTab: z.string(),
    compactMode: z.boolean(),
    theme: z.string().optional(),
    showAllDecimals: z.boolean().optional(),
  }),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  language: z.string().optional(),
  theme: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    priceAlerts: z.boolean(),
    trades: z.boolean().optional(),
    pricing: z.boolean().optional(),
    news: z.boolean().optional(),
  }).optional(),
  tradingPreferences: z.object({
    autoConfirm: z.boolean(),
    showAdvanced: z.boolean(),
    defaultAsset: z.string(),
  }).optional(),
  ticker: z.object({
    enabled: z.boolean(),
    position: z.string(),
    speed: z.number(),
    direction: z.string(),
    autoPause: z.boolean(),
  }).optional(),
});

export function Settings() {
  const defaultValues: SettingsFormValues = {
    currency: {
      defaultCurrency: 'USD',
      showPriceInBTC: false,
    },
    api: {
      provider: 'coinmarketcap',
      key: '',
    },
    display: {
      showPortfolio: true,
      defaultTab: 'dashboard',
      compactMode: false,
    },
    displayName: 'John Doe',
    email: 'johndoe@example.com',
    username: 'johndoe',
    language: 'en',
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      priceAlerts: true,
      trades: true,
      pricing: true,
      news: false,
    },
    tradingPreferences: {
      autoConfirm: false,
      showAdvanced: true,
      defaultAsset: 'bitcoin',
    },
    ticker: {
      enabled: true,
      position: 'bottom',
      speed: 5,
      direction: 'left',
      autoPause: true,
    },
  };
  
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    console.log('Settings form values:', values);
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved successfully.",
    });
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Configure your preferred currency and display options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currency.defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This is the currency used for displaying prices and values.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency.showPriceInBTC"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show BTC Prices</FormLabel>
                      <FormDescription>
                        Display cryptocurrency prices in BTC equivalent
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
                        <SelectItem value="coinmarketcap">CoinMarketCap</SelectItem>
                        <SelectItem value="coingecko">CoinGecko</SelectItem>
                        <SelectItem value="binance">Binance</SelectItem>
                        <SelectItem value="coinbase">Coinbase</SelectItem>
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
                      The API key for the selected provider (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Configure how information is displayed in the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="display.theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                      Choose the application appearance theme.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="display.compactMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Compact Mode</FormLabel>
                      <FormDescription>
                        Use a more compact display with less padding
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
              
              <FormField
                control={form.control}
                name="display.showAllDecimals"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show All Decimals</FormLabel>
                      <FormDescription>
                        Display all decimal places for cryptocurrency prices
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
            <CardFooter className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="ticker">Market Ticker</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettings form={form} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings form={form} />
        </TabsContent>
        <TabsContent value="api">
          <ApiSettings form={form} />
        </TabsContent>
        <TabsContent value="ticker">
          <TickerSettings form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
