
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SettingsFormValues } from "./types";
import GeneralSettings from "./GeneralSettings";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import DataPrivacySettings from "./DataPrivacySettings";
import TickerSettings from "./TickerSettings";
import { SaveIcon } from "lucide-react";
import SettingsFooter from "./SettingsFooter";

const settingsFormSchema = z.object({
  theme: z.enum(["light", "dark"]),
  colorScheme: z.enum(["default", "midnight-tech", "cyber-pulse", "matrix-code"]),
  layout: z.enum(["default", "compact", "traderview", "professional", "custom"]),
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  bio: z.string(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    priceAlerts: z.boolean(),
    marketUpdates: z.boolean(),
    newsletterAndPromotions: z.boolean(),
  }),
  appearance: z.object({
    compactMode: z.boolean(),
    animationsEnabled: z.boolean(),
    highContrastMode: z.boolean(),
    showTradingHistory: z.boolean(),
    showPortfolioChart: z.boolean(),
  }),
  privacy: z.object({
    showOnlineStatus: z.boolean(),
    sharePortfolio: z.boolean(),
    shareTrades: z.boolean(),
  }),
  trading: z.object({
    defaultOrder: z.enum(["market", "limit"]),
    confirmTradeExecutions: z.boolean(),
    showPriceAlerts: z.boolean(),
    autoSyncExchanges: z.boolean(),
    tradingViewCharts: z.boolean(),
  }),
  ticker: z.object({
    enabled: z.boolean(),
    position: z.enum(["top", "bottom", "both"]),
    speed: z.number(),
    direction: z.enum(["left", "right"]),
    autoPause: z.boolean(),
  }),
  sidebar: z.object({
    enabled: z.boolean(),
    position: z.enum(["left", "right"]),
    defaultCollapsed: z.boolean(),
    showLabels: z.boolean(),
  }),
  language: z.string(),
  timeZone: z.string(),
  darkMode: z.boolean(),
  exportFormat: z.enum(["CSV", "JSON", "PDF"]),
  dataPrivacy: z.object({
    storeHistory: z.boolean(),
    anonymizeData: z.boolean(),
    enableTracking: z.boolean(),
  }),
});

const defaultValues: SettingsFormValues = {
  theme: "dark",
  colorScheme: "midnight-tech",
  layout: "default",
  username: "cryptotrader",
  displayName: "Crypto Trader",
  email: "user@example.com",
  bio: "",
  notifications: {
    email: true,
    push: true,
    priceAlerts: true,
    marketUpdates: false,
    newsletterAndPromotions: false,
  },
  appearance: {
    compactMode: false,
    animationsEnabled: true,
    highContrastMode: false,
    showTradingHistory: true,
    showPortfolioChart: true,
  },
  privacy: {
    showOnlineStatus: true,
    sharePortfolio: false,
    shareTrades: false,
  },
  trading: {
    defaultOrder: "market",
    confirmTradeExecutions: true,
    showPriceAlerts: true,
    autoSyncExchanges: true,
    tradingViewCharts: true,
  },
  ticker: {
    enabled: true,
    position: "both",
    speed: 40,
    direction: "left",
    autoPause: true,
  },
  sidebar: {
    enabled: true,
    position: "left",
    defaultCollapsed: false,
    showLabels: true,
  },
  language: "en",
  timeZone: "UTC",
  darkMode: true,
  exportFormat: "CSV",
  dataPrivacy: {
    storeHistory: true,
    anonymizeData: false,
    enableTracking: true,
  },
};

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("general");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
    console.log("Settings updated:", data);
    
    // In a real app, save to localStorage or API
    localStorage.setItem("userSettings", JSON.stringify(data));
  }

  React.useEffect(() => {
    // Load saved settings if they exist
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        form.reset(parsedSettings);
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }
  }, [form]);

  return (
    <div className="container py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 w-full grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="tickers">Tickers</TabsTrigger>
              <TabsTrigger value="data-privacy">Data & Privacy</TabsTrigger>
            </TabsList>

            <div className="space-y-6">
              <TabsContent value="general">
                <GeneralSettings form={form} />
              </TabsContent>

              <TabsContent value="appearance">
                <AppearanceSettings form={form} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationSettings form={form} />
              </TabsContent>

              <TabsContent value="privacy">
                <PrivacySettings form={form} />
              </TabsContent>
              
              <TabsContent value="tickers">
                <TickerSettings form={form} />
              </TabsContent>

              <TabsContent value="data-privacy">
                <DataPrivacySettings form={form} />
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button type="submit" className="gap-2">
              <SaveIcon className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
      
      <SettingsFooter />
    </div>
  );
};

export default Settings;
