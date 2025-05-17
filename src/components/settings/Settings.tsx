
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import ApiSettings from "./ApiSettings";
import DataPrivacySettings from "./DataPrivacySettings";
import { SettingsFormValues } from "./types";
import { useToast } from '@/hooks/use-toast';

// Define the form schema
const settingsFormSchema = z.object({
  theme: z.string().optional(),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  language: z.string().optional(),
  currency: z.string(),
  api: z.object({
    provider: z.string(),
    key: z.string().optional(),
    refreshInterval: z.number().optional(),
    timeout: z.number().optional()
  }),
  display: z.object({
    showPortfolio: z.boolean(),
    showBalances: z.boolean().default(true),
    defaultTab: z.string().optional(),
    compactMode: z.boolean(),
    animationsEnabled: z.boolean().optional(),
    highContrastMode: z.boolean().optional(),
    colorScheme: z.string().optional()
  }).optional(),
  notifications: z.object({
    enableEmail: z.boolean().default(true),
    enablePush: z.boolean().default(true),
    alertPrice: z.boolean().default(true),
    alertNews: z.boolean().default(false),
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    trades: z.boolean().optional(),
    pricing: z.boolean().optional(),
    news: z.boolean().optional(),
    priceAlerts: z.boolean().optional()
  }).optional(),
  privacy: z.object({
    showOnlineStatus: z.boolean(),
    sharePortfolio: z.boolean(),
    shareTrades: z.boolean(),
    dataCollection: z.boolean(),
    marketingConsent: z.boolean(),
    thirdPartySharing: z.boolean()
  }).optional(),
  account: z.object({
    twoFactorEnabled: z.boolean(),
    loginAlerts: z.boolean()
  }).optional(),
  appearance: z.object({
    colorScheme: z.string(),
    compactMode: z.boolean(),
    animationsEnabled: z.boolean(),
    highContrastMode: z.boolean()
  }).optional(),
  ticker: z.object({
    enabled: z.boolean(),
    position: z.string(),
    speed: z.number(),
    direction: z.string(),
    autoPause: z.boolean(),
    coins: z.array(z.string()).optional()
  }).optional(),
  tradingPreferences: z.object({
    autoConfirm: z.boolean(),
    showAdvanced: z.boolean().optional(),
    defaultAsset: z.string().optional(),
    defaultTradeSize: z.number().optional(),
    riskLevel: z.enum(['low', 'medium', 'high']).optional(),
    tradingStrategy: z.string().optional(),
    defaultLeverage: z.number().optional(),
    showPnL: z.boolean().optional(),
    defaultTimeframe: z.string().optional()
  }).optional()
});

export const Settings: React.FC = () => {
  const { toast } = useToast();
  
  // Load settings from localStorage or use defaults
  const loadSettings = (): SettingsFormValues => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    
    // Default settings with AUD as the default currency
    return {
      theme: 'light',
      currency: 'AUD',
      api: {
        provider: 'coingecko',
        key: '',
        refreshInterval: 30,
        timeout: 10
      },
      display: {
        showPortfolio: true,
        defaultTab: 'overview',
        compactMode: false,
        animationsEnabled: true,
        highContrastMode: false,
        colorScheme: 'default'
      },
      notifications: {
        email: true,
        push: true,
        priceAlerts: true,
        trades: true,
        pricing: true,
        news: false
      },
      privacy: {
        showOnlineStatus: true,
        sharePortfolio: false,
        shareTrades: false,
        dataCollection: true,
        marketingConsent: false,
        thirdPartySharing: false
      },
      tradingPreferences: {
        autoConfirm: true,
        showAdvanced: false,
        defaultAsset: 'BTC',
        defaultTradeSize: 0.1,
        riskLevel: 'medium'
      }
    } as SettingsFormValues;
  };
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: loadSettings(),
    mode: "onChange"
  });

  // Save settings to localStorage
  const onSubmit = (values: SettingsFormValues) => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(values));
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated."
      });
      
      console.log('Settings saved:', values);
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error saving your settings.",
        variant: "destructive"
      });
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="container py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 w-full max-w-md">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API Settings</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
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
          </Tabs>
          
          <div className="flex gap-2">
            <Button type="submit">Save Settings</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => form.reset(loadSettings())}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
