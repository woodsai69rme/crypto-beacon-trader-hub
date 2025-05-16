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
import { SettingsFormValues } from "@/types/trading";
import { useToast } from '@/hooks/use-toast';

// Define the form schema with all the expected fields
const settingsFormSchema = z.object({
  theme: z.string().optional(),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  language: z.string().optional(),
  currency: z.object({
    defaultCurrency: z.enum(["USD", "AUD", "EUR", "GBP"]),
    showPriceInBTC: z.boolean()
  }),
  api: z.object({
    provider: z.string(),
    key: z.string(),
    refreshInterval: z.number().optional(),
    timeout: z.number().optional()
  }),
  display: z.object({
    showPortfolio: z.boolean(),
    defaultTab: z.string(),
    compactMode: z.boolean(),
    animationsEnabled: z.boolean().optional(),
    highContrastMode: z.boolean().optional()
  }).optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    trades: z.boolean().optional(),
    pricing: z.boolean().optional(),
    news: z.boolean().optional(),
    priceAlerts: z.boolean().optional()
  }).optional(),
  privacy: z.object({
    showOnlineStatus: z.boolean().optional(),
    sharePortfolio: z.boolean().optional(),
    shareTrades: z.boolean().optional(),
    dataCollection: z.boolean().optional(),
    marketingConsent: z.boolean().optional(),
    thirdPartySharing: z.boolean().optional()
  }).optional(),
  appearance: z.object({
    colorScheme: z.string().optional(),
    compactMode: z.boolean().optional(),
    animationsEnabled: z.boolean().optional(),
    highContrastMode: z.boolean().optional()
  }).optional(),
  account: z.object({
    twoFactorEnabled: z.boolean().optional(),
    loginAlerts: z.boolean().optional()
  }).optional(),
  ticker: z.object({
    enabled: z.boolean().optional(),
    position: z.string().optional(),
    speed: z.number().optional(),
    direction: z.string().optional(),
    autoPause: z.boolean().optional()
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
      currency: {
        defaultCurrency: 'AUD',
        showPriceInBTC: false
      },
      api: {
        provider: 'coingecko',
        key: '',
        refreshInterval: 30,
        timeout: 10
      },
      display: {
        showPortfolio: true,
        defaultTab: 'overview',
        compactMode: false
      },
      notifications: {
        email: true,
        push: true,
        trades: true,
        pricing: true,
        news: false,
        priceAlerts: true
      },
      privacy: {
        showOnlineStatus: true,
        sharePortfolio: false,
        shareTrades: false, 
        dataCollection: true,
        marketingConsent: false,
        thirdPartySharing: false
      },
      appearance: {
        colorScheme: 'default',
        compactMode: false,
        animationsEnabled: true,
        highContrastMode: false
      }
    };
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
};

export default Settings;
