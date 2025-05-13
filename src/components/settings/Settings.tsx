
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
import AppearanceSettings from './AppearanceSettings';
import DataPrivacySettings from './DataPrivacySettings';
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
    trades: z.boolean().optional(),
    pricing: z.boolean().optional(),
    news: z.boolean().optional(),
    priceAlerts: z.boolean().optional(),
  }).optional(),
  tradingPreferences: z.object({
    autoConfirm: z.boolean(),
    showAdvanced: z.boolean(),
    defaultAsset: z.string(),
  }).optional(),
  privacy: z.object({
    showOnlineStatus: z.boolean().optional(),
    sharePortfolio: z.boolean().optional(),
    shareTrades: z.boolean().optional(),
    dataCollection: z.boolean().optional(),
    marketingConsent: z.boolean().optional(),
    thirdPartySharing: z.boolean().optional(),
  }).optional(),
  account: z.object({
    twoFactorEnabled: z.boolean().optional(),
    loginAlerts: z.boolean().optional(),
  }).optional(),
  appearance: z.object({
    colorScheme: z.string().optional(),
    compactMode: z.boolean().optional(),
    animationsEnabled: z.boolean().optional(),
    highContrastMode: z.boolean().optional(),
  }).optional(),
  ticker: z.object({
    enabled: z.boolean().optional(),
    position: z.string().optional(),
    speed: z.number().optional(),
    direction: z.string().optional(),
    autoPause: z.boolean().optional(),
  }).optional(),
});

export function Settings() {
  const defaultValues: Partial<SettingsFormValues> = {
    currency: {
      defaultCurrency: 'AUD', // Set AUD as default currency
      showPriceInBTC: false,
    },
    api: {
      provider: 'coingecko', // Default to free CoinGecko API
      key: '',
      selectedProvider: 'coingecko',
      refreshInterval: 30,
      timeout: 10,
    },
    display: {
      showPortfolio: true,
      defaultTab: 'dashboard',
      compactMode: false,
      theme: 'system',
      showAllDecimals: false,
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
    privacy: {
      showOnlineStatus: true,
      sharePortfolio: false,
      shareTrades: false,
      dataCollection: true,
      marketingConsent: false,
      thirdPartySharing: false,
    },
    appearance: {
      colorScheme: 'default',
      compactMode: false,
      animationsEnabled: true,
      highContrastMode: false,
    },
    ticker: {
      enabled: true,
      position: 'bottom',
      speed: 5,
      direction: 'left',
      autoPause: true,
    },
  };
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(values: SettingsFormValues) {
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
          <Tabs defaultValue="general" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="ticker">Market Ticker</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="general">
                <GeneralSettings form={form} />
              </TabsContent>
              <TabsContent value="appearance">
                <AppearanceSettings form={form} />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings form={form} />
              </TabsContent>
              <TabsContent value="api">
                <ApiSettings form={form} />
              </TabsContent>
              <TabsContent value="privacy">
                <DataPrivacySettings form={form} />
              </TabsContent>
              <TabsContent value="ticker">
                <TickerSettings form={form} />
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex justify-end">
            <Button type="submit">Save All Settings</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Settings;
