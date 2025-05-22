
import React, { useState, useEffect } from 'react';
import './App.css';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import ThemeSwitcher from './components/settings/ThemeSwitcher';
import { Toaster } from './components/ui/toaster';
import { cn } from './lib/utils';
import { GithubIcon, Menu, ChevronRight, LayoutDashboard, LineChart, Settings, BookOpen, Users, Bell, Bot, Wallet } from 'lucide-react';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Separator } from './components/ui/separator';
import { UIProvider, useUI } from './contexts/UIContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import PriceTicker from './components/tickers/PriceTicker';
import NewsTicker from './components/tickers/NewsTicker';
import SidebarPanel from './components/sidebar/SidebarPanel';
import { getTrendingCoins, getLatestNews } from './services/enhancedCryptoApi';
import { CoinOption, NewsItem } from './types/trading';

const AppContent = () => {
  const { theme, colorScheme } = useTheme();
  const { tickerSettings, sidebarSettings } = useUI();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trendingCoins, setTrendingCoins] = useState<CoinOption[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [activePage, setActivePage] = useState('dashboard');

  // Only show UI after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Fetch data for tickers
    const fetchData = async () => {
      try {
        const coins = await getTrendingCoins();
        setTrendingCoins(coins || []);
        
        const news = await getLatestNews();
        if (news) {
          setNewsItems(news.map(item => ({
            id: item.id || `news-${Date.now()}-${Math.random()}`,
            title: item.title || 'News update',
            source: item.source || 'Crypto News',
            timestamp: item.published_at || new Date().toISOString(),
            url: item.url || '#'
          })));
        }
      } catch (error) {
        console.error("Error fetching ticker data:", error);
        // Set some fallback data if the API fails
        setTrendingCoins([]);
        setNewsItems([]);
      }
    };
    
    fetchData();
    
    // Refresh data periodically
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  const showTopTicker = tickerSettings.enabled && (tickerSettings.position === 'top' || tickerSettings.position === 'both');
  const showBottomTicker = tickerSettings.enabled && (tickerSettings.position === 'bottom' || tickerSettings.position === 'both');
  const showSidebar = sidebarSettings.enabled;

  // Nav items for the sidebar and mobile menu
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trading', label: 'Trading', icon: LineChart },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'ai', label: 'AI Trading', icon: Bot },
    { id: 'news', label: 'News & Events', icon: BookOpen },
    { id: 'social', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "app min-h-screen flex flex-col bg-background text-foreground",
      `themed-app ${theme} ${colorScheme}`
    )}>
      {/* Top Price Ticker */}
      {showTopTicker && (
        <PriceTicker 
          coins={trendingCoins} 
          speed={tickerSettings.speed}
          direction={tickerSettings.direction}
        />
      )}
      
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CT
            </div>
            <h1 className="font-bold text-xl hidden md:block">Crypto Trader</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button 
                key={item.id}
                variant={activePage === item.id ? "secondary" : "ghost"} 
                onClick={() => setActivePage(item.id)}
                className="flex items-center gap-1.5"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-2">
                <GithubIcon size={16} />
                <span>GitHub</span>
              </Button>
              <ThemeSwitcher />
            </div>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[380px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      CT
                    </div>
                    <h2 className="font-bold text-lg">Crypto Trader</h2>
                  </div>
                  
                  <nav className="space-y-2 mb-auto">
                    {navItems.map((item) => (
                      <Button 
                        key={item.id}
                        variant={activePage === item.id ? "secondary" : "ghost"} 
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          setActivePage(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  <div className="mt-auto flex flex-col gap-4">
                    <ThemeSwitcher className="self-start" />
                    <Button variant="outline" size="sm" className="flex items-center gap-2 self-start">
                      <GithubIcon size={16} />
                      <span>GitHub</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex">
        {/* Left Sidebar - if enabled and position is left */}
        {showSidebar && sidebarSettings.position === 'left' && (
          <SidebarPanel />
        )}
        
        {/* Main Content */}
        <div className="flex-1 py-6 px-4">
          <div className="container">
            <Dashboard />
          </div>
        </div>
        
        {/* Right Sidebar - if enabled and position is right */}
        {showSidebar && sidebarSettings.position === 'right' && (
          <SidebarPanel />
        )}
      </main>
      
      {/* Bottom News Ticker */}
      {showBottomTicker && (
        <NewsTicker 
          items={newsItems} 
          speed={tickerSettings.speed} 
          direction={tickerSettings.direction} 
        />
      )}
      
      <Toaster />
    </div>
  );
};

const App = () => {
  return (
    <UIProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </UIProvider>
  );
};

export default App;
