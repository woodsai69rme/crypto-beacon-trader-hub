
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import Settings from "./settings/Settings";
import { SettingsFormValues } from "./settings/types";

const UserSettings = () => {
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      email: "user@example.com",
      username: "traderpro",
      displayName: "Crypto Trader",
      bio: "Professional crypto trader and analyst with 5+ years of experience.",
      darkMode: true,
      language: "en",
      timeZone: "UTC",
      layout: "default",
      theme: "dark",
      colorScheme: "default",
      notifications: {
        email: true,
        push: true,
        priceAlerts: true,
        marketUpdates: false,
        newsletterAndPromotions: false,
      },
      privacy: {
        showOnlineStatus: true,
        sharePortfolio: false,
        shareTrades: false,
      },
      appearance: {
        compactMode: false,
        animationsEnabled: true,
        showTradingHistory: true,
        showPortfolioChart: true,
        highContrastMode: false,
      },
      account: {
        twoFactorEnabled: false,
        loginAlerts: true,
      },
      trading: {
        confirmTradeExecutions: true,
        showPriceAlerts: true,
        defaultOrder: "market",
      },
      dashboardCustomization: {
        defaultCurrency: "USD",
        defaultTimeframe: "1d",
        alertVolume: 50,
        alertFrequency: "medium",
      },
      dataPrivacy: {
        storeHistory: true,
        enableTracking: true,
      },
      exportFormat: "CSV",
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Settings form={form} />
      </CardContent>
    </Card>
  );
};

export default UserSettings;
