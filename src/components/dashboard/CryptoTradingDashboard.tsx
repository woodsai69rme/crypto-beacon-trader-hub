
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Eye
} from "lucide-react";

import { CoinOption, AITradingStrategy } from '@/types/trading';

// Dashboard components
import PortfolioSummaryCard from "./PortfolioSummaryCard";
import CryptoWatchlist from "./CryptoWatchlist";
import AIStrategySuggestions from "./AIStrategySuggestions";
import MarketSentimentPanel from "./MarketSentimentPanel";
import MobileNavigation from "./MobileNavigation";

// Mock data
const mockCoinOptions: CoinOption[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', value: 'bitcoin', label: 'BTC - Bitcoin', price: 62453.21, priceChange: 1245.32, changePercent: 2.03 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', value: 'ethereum', label: 'ETH - Ethereum', price: 3287.54, priceChange: 65.43, changePercent: 2.03 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', value: 'solana', label: 'SOL - Solana', price: 142.74, priceChange: 4.35, changePercent: 3.14 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', value: 'ripple', label: 'XRP - Ripple', price: 0.52, priceChange: 0.015, changePercent: 2.97 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', value: 'cardano', label: 'ADA - Cardano', price: 0.45, priceChange: -0.02, changePercent: -4.25 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', value: 'dogecoin', label: 'DOGE - Dogecoin', price: 0.14, priceChange: 0.005, changePercent: 3.70 },
  { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin', value: 'binancecoin', label: 'BNB - Binance Coin', price: 595.32, priceChange: 12.54, changePercent: 2.15 },
];

const mockAIStrategies: AITradingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'BTC Momentum',
    description: 'Takes advantage of BTC price momentum with RSI confirmation',
    type: 'momentum',
    timeframe: '4h',
    riskLevel: 'medium',
    parameters: {
      period: 14,
      threshold: 70,
    },
    assets: ['bitcoin'],
    performance: {
      winRate: 68,
      returnRate: 34.2,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5,
    },
    risk: 6.5,
    return: 34.2,
  },
  {
    id: 'strategy-2',
    name: 'ETH/BTC Pair',
    description: 'Arbitrage between ETH and BTC price movements',
    type: 'arbitrage',
    timeframe: '1d',
    riskLevel: 'low',
    parameters: {
      period: 21,
      threshold: 65,
    },
    assets: ['ethereum', 'bitcoin'],
    performance: {
      winRate: 72,
      returnRate: 28.4,
      sharpeRatio: 1.9,
      maxDrawdown: 9.2,
    },
    risk: 4.2,
    return: 28.4,
  },
  {
    id: 'strategy-3',
    name: 'SOL Breakout',
    description: 'Detects SOL breakouts with volume confirmation',
    type: 'breakout',
    timeframe: '1h',
    riskLevel: 'high',
    parameters: {
      period: 7,
      threshold: 80,
    },
    assets: ['solana'],
    performance: {
      winRate: 58,
      returnRate: 47.5,
      sharpeRatio: 1.6,
      maxDrawdown: 22.4,
    },
    risk: 8.7,
    return: 47.5,
  },
  {
    id: 'strategy-4',
    name: 'BTC/ETH/SOL Diversified',
    description: 'Balanced allocation across top 3 cryptos with periodic rebalancing',
    type: 'diversification',
    timeframe: '1w',
    riskLevel: 'low',
    parameters: {
      period: 30,
      threshold: 60,
    },
    assets: ['bitcoin', 'ethereum', 'solana'],
    performance: {
      winRate: 75,
      returnRate: 23.8,
      sharpeRatio: 2.4,
      maxDrawdown: 7.8,
    },
    risk: 3.8,
    return: 23.8,
  },
  {
    id: 'strategy-5',
    name: 'XRP Swing',
    description: 'Captures XRP price swings using MACD and RSI',
    type: 'swing',
    timeframe: '12h',
    riskLevel: 'medium',
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    assets: ['ripple'],
    performance: {
      winRate: 62,
      returnRate: 31.5,
      sharpeRatio: 1.8,
      maxDrawdown: 15.2,
    },
    risk: 6.2,
    return: 31.5,
  },
];

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
              <CryptoWatchlist coins={mockCoinOptions} />
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
