
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedCryptoChart from "./EnhancedCryptoChart";
import MarketOverview from "./MarketOverview";
import FilteredNewsFeed from "./FilteredNewsFeed";
import CoinComparison from "./CoinComparison";
import SentimentAnalysis from "./SentimentAnalysis";
import CryptoSearch from "./CryptoSearch";
import Portfolio from "./Portfolio";
import Watchlist from "./Watchlist";
import ThemeToggle from "./ThemeToggle";
import AlertsSystem from "./AlertsSystem";
import AuthDialog from "./AuthDialog";
import TransactionHistory from "./TransactionHistory";
import MarketCalendar from "./MarketCalendar";
import PortfolioAnalytics from "./PortfolioAnalytics";
import UserSettings from "./UserSettings";
import SocialSharing from "./SocialSharing";
import MarketDepthChart from "./MarketDepthChart";
import TradingPairComparison from "./TradingPairComparison";
import NotificationSystem from "./NotificationSystem";
import DataExportImport from "./DataExportImport";
import RiskAssessment from "./RiskAssessment";
import TaxReporting from "./TaxReporting";
import ApiKeyManagement from "./ApiKeyManagement";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <div className="flex items-center gap-2">
          <CryptoSearch />
          <ThemeToggle />
          <NotificationSystem />
          <AlertsSystem />
          <UserSettings />
          <AuthDialog />
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="bg-crypto-dark-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview">
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
        </TabsContent>
        
        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Portfolio />
              </div>
              <div>
                <PortfolioAnalytics />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Transaction History</h2>
              <div className="flex gap-2">
                <DataExportImport variant="outline" size="sm" />
                <SocialSharing />
              </div>
            </div>
            
            <TransactionHistory />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
              <CoinComparison />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">My Watchlist</h2>
              <div className="flex gap-2">
                <DataExportImport variant="outline" size="sm" />
                <SocialSharing />
              </div>
            </div>
            
            <Watchlist />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
              </div>
              <div>
                <FilteredNewsFeed />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trading">
          <div className="grid grid-cols-1 gap-6">
            <ApiKeyManagement />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketDepthChart coinId="bitcoin" symbol="BTC" />
              <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
            </div>
            
            <TradingPairComparison />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CoinComparison />
              </div>
              <div>
                <FilteredNewsFeed />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskAssessment />
            <TradingPairComparison />
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MarketDepthChart coinId="bitcoin" symbol="BTC" />
            </div>
            <div>
              <SentimentAnalysis />
            </div>
          </div>
          
          <div className="mt-6">
            <FilteredNewsFeed />
          </div>
        </TabsContent>
        
        <TabsContent value="tools">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TaxReporting />
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Tools & Utilities</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-secondary/10 transition-colors">
                    <DataExportImport variant="ghost" />
                    <span className="mt-2 text-sm text-muted-foreground">Export & Import Data</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-secondary/10 transition-colors">
                    <SocialSharing variant="ghost" />
                    <span className="mt-2 text-sm text-muted-foreground">Share Insights</span>
                  </button>
                </div>
                <MarketCalendar />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
