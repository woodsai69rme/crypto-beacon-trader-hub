
import React, { useState } from "react";
import EnhancedCryptoChart from "../EnhancedCryptoChart";
import MarketOverview from "../MarketOverview";
import SentimentAnalysis from "../SentimentAnalysis";
import TradingPairComparison from "../TradingPairComparison";
import FilteredNewsFeed from "../FilteredNewsFeed";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, BellPlus } from "lucide-react";
import AlertPrompt from "../AlertPrompt";
import { toast } from "@/components/ui/use-toast";

const DashboardOverview = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard refreshed",
        description: "All market data has been updated",
        variant: "default",
      });
    }, 1000);
  };
  
  const setupAlerts = () => {
    toast({
      title: "Price Alert Created",
      description: "You'll be notified when BTC price changes by 5%",
      variant: "default",
    });
  };
  
  return (
    <div className="space-y-6">
      {showWelcome && (
        <AlertPrompt
          type="info"
          title="Welcome to your Crypto Dashboard"
          description="Here you'll find an overview of the crypto market, your portfolio, and personalized insights."
          onDismiss={() => setShowWelcome(false)}
          actionLabel="Setup Alerts"
          onAction={setupAlerts}
          className="mb-4"
        />
      )}
      
      <div className="flex flex-wrap gap-2 mb-6 justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" onClick={setupAlerts} className="gap-2">
          <BellPlus className="h-4 w-4" />
          Set Alerts
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
        </div>
        <div>
          <SentimentAnalysis />
        </div>
      </div>
      
      <div className="mt-6">
        <MarketOverview />
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingPairComparison />
        </div>
        <div>
          <FilteredNewsFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
