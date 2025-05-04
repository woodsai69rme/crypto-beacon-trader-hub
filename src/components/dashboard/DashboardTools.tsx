import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

// Import Components
import TaxCalculator from "../tools/TaxCalculator";
import PortfolioOptimizer from "../tools/PortfolioOptimizer";
import MarketAnalyzer from "../tools/MarketAnalyzer";
import UserSettings from "../UserSettings";
import ApiManagementDashboard from "../api/ApiManagementDashboard";
import TradingJournal from "../tools/TradingJournal";
import TradingCalendar from "../tools/TradingCalendar";
import MarketHours from "../tools/MarketHours";
import PriceCorrelations from "../tools/PriceCorrelations";
import OrderBookVisualizer from "../tools/OrderBookVisualizer";
import RiskCalculator from "../tools/RiskCalculator";
import { SettingsFormValues } from "@/components/settings/types";

const DashboardTools = () => {
  const [activeTab, setActiveTab] = useState("calculators");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
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

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    toast({
      title: `${tool} selected`,
      description: `You are now viewing the ${tool} tool.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="calculators">Calculators</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="api">API Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-auto">
                More Tools
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2">
              <div className="grid gap-1">
                <Button variant="ghost" className="justify-start" onClick={() => handleToolSelect("Trading Journal")}>
                  Trading Journal
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleToolSelect("Trading Calendar")}>
                  Trading Calendar
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleToolSelect("Market Hours")}>
                  Market Hours
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleToolSelect("Price Correlations")}>
                  Price Correlations
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleToolSelect("Order Book Visualizer")}>
                  Order Book Visualizer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <TabsContent value="calculators" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaxCalculator />
          <RiskCalculator />
        </div>
      </TabsContent>

      <TabsContent value="analysis" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <PortfolioOptimizer />
          <MarketAnalyzer />
        </div>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardContent className="pt-6">
            <ApiManagementDashboard />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <UserSettings />
      </TabsContent>

      {selectedTool === "Trading Journal" && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <TradingJournal />
          </CardContent>
        </Card>
      )}

      {selectedTool === "Trading Calendar" && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <TradingCalendar />
          </CardContent>
        </Card>
      )}

      {selectedTool === "Market Hours" && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <MarketHours />
          </CardContent>
        </Card>
      )}

      {selectedTool === "Price Correlations" && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <PriceCorrelations />
          </CardContent>
        </Card>
      )}

      {selectedTool === "Order Book Visualizer" && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <OrderBookVisualizer />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardTools;
