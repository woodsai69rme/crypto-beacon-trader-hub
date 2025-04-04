
import { useState } from "react";
import CryptoChart from "./CryptoChart";
import MarketOverview from "./MarketOverview";
import NewsFeed from "./NewsFeed";
import CoinComparison from "./CoinComparison";
import SentimentAnalysis from "./SentimentAnalysis";
import CryptoSearch from "./CryptoSearch";
import Portfolio from "./Portfolio";
import Watchlist from "./Watchlist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        <CryptoSearch />
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="bg-crypto-dark-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CryptoChart coin="Bitcoin" color="#F7931A" />
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
              <NewsFeed />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 gap-6">
            <Portfolio />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CryptoChart coin="Bitcoin" color="#F7931A" />
              <CoinComparison />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="watchlist">
          <div className="grid grid-cols-1 gap-6">
            <Watchlist />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CryptoChart coin="Bitcoin" color="#F7931A" />
              </div>
              <div>
                <NewsFeed />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
