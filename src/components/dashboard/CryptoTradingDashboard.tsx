
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  BarChart2, 
  Wallet, 
  Star, 
  Bot, 
  PieChart, 
  Settings, 
  TrendingUp, 
  BarChart,
  RefreshCw,
  ChevronRight,
  PlusCircle,
  Menu,
} from "lucide-react";

import { CoinOption, AITradingStrategy } from '@/types/trading';

// Dashboard components
import PortfolioSummaryCard from "./PortfolioSummaryCard";
import CryptoWatchlist from "./CryptoWatchlist";
import AIStrategySuggestions from "./AIStrategySuggestions";
import MarketSentimentPanel from "./MarketSentimentPanel";
import MobileNavigation from "./MobileNavigation";

// Mock data
import { mockCoinData, mockAIStrategies } from '@/utils/mockData';

const portfolioValue = 38745.92;
const portfolioChange = 1245.32;
const portfolioChangePercent = 3.32;

const CryptoTradingDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();
  
  // Check if mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Updated",
        description: "Latest market data has been refreshed",
      });
    }, 1000);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
      
      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0 md:w-16'} transition-all duration-300 overflow-hidden fixed md:relative h-screen bg-card border-r z-30`}>
          <div className="p-4 flex justify-between items-center">
            <h2 className={`font-bold text-xl ${!isSidebarOpen && 'md:hidden'}`}>CryptoTrader</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="px-2 py-4">
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <BarChart className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>Dashboard</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <Bot className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>AI Strategies</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <Wallet className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>Portfolio</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <LineChart className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>Analytics</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <PieChart className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>On-Chain</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <Star className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>Watchlist</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" className={`w-full justify-start ${!isSidebarOpen && 'md:justify-center'}`}>
                  <Settings className="h-5 w-5 mr-2" />
                  <span className={`${!isSidebarOpen && 'md:hidden'}`}>Settings</span>
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your crypto portfolio and market</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm" className="hidden md:flex">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Trade
                </Button>
              </div>
            </div>
          </div>
          
          {/* Portfolio Summary and Market Sentiment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <PortfolioSummaryCard
                totalValue={portfolioValue}
                change24h={portfolioChange}
                changePercent={portfolioChangePercent}
              />
            </div>
            <div>
              <MarketSentimentPanel />
            </div>
          </div>
          
          {/* Watchlist and AI Strategy Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CryptoWatchlist coins={mockCoinData} />
            </div>
            <div>
              <AIStrategySuggestions strategies={mockAIStrategies.slice(0, 3)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CryptoTradingDashboard;
