
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <div className="flex items-center gap-2">
          <CryptoSearch />
          <ThemeToggle />
          <AlertsSystem />
          <AuthDialog />
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="bg-crypto-dark-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
              <CoinComparison />
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
            
            <TransactionHistory />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
              <CoinComparison />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist">
          <div className="grid grid-cols-1 gap-6">
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
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MarketCalendar />
                <FilteredNewsFeed />
              </div>
            </div>
            <SentimentAnalysis />
          </div>
          
          <div className="mt-6">
            <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
