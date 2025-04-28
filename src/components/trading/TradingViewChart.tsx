
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradingViewChartConfig } from '@/types/trading';
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const TradingViewChart: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("BTCUSD");
  const [interval, setInterval] = useState<string>("D"); // D for daily
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const chartConfig: TradingViewChartConfig = {
    symbol: symbol,
    interval: interval,
    theme: theme,
    studies: ["RSI", "MACD", "MA"],
    width: 0, // Will be set dynamically
    height: 500
  };
  
  useEffect(() => {
    const loadTradingViewWidget = () => {
      setIsLoading(true);
      
      if (!containerRef.current) return;
      
      // Clear previous chart if any
      containerRef.current.innerHTML = '';
      
      // Set chart width based on container width
      chartConfig.width = containerRef.current.clientWidth;
      
      // Create the script element for TradingView widget
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        // Check if TradingView is loaded
        if (typeof window.TradingView !== 'undefined') {
          new window.TradingView.widget({
            autosize: true,
            symbol: `${chartConfig.symbol}`,
            interval: chartConfig.interval,
            timezone: "Etc/UTC",
            theme: chartConfig.theme,
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: 'tradingview-widget-container',
            studies: chartConfig.studies,
          });
          setIsLoading(false);
        } else {
          console.error("TradingView library not loaded correctly");
          setIsLoading(false);
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load TradingView widget");
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      };
    };
    
    loadTradingViewWidget();
    
    // Cleanup on unmount
    return () => {
      const tradingViewScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (tradingViewScript && tradingViewScript.parentNode) {
        tradingViewScript.parentNode.removeChild(tradingViewScript);
      }
    };
  }, [symbol, interval, theme]);
  
  const handleSymbolChange = (value: string) => {
    setSymbol(value);
  };
  
  const handleIntervalChange = (value: string) => {
    setInterval(value);
  };
  
  const handleThemeChange = (value: "light" | "dark") => {
    setTheme(value);
  };
  
  const openTradingViewSite = () => {
    window.open('https://www.tradingview.com', '_blank');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              TradingView Chart
              <Button variant="link" className="p-0 h-auto ml-1" onClick={openTradingViewSite}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Professional-grade charting platform</CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Select value={symbol} onValueChange={handleSymbolChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                <SelectItem value="ETHUSD">ETH/USD</SelectItem>
                <SelectItem value="SOLUSD">SOL/USD</SelectItem>
                <SelectItem value="ADAUSD">ADA/USD</SelectItem>
                <SelectItem value="DOTUSD">DOT/USD</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={interval} onValueChange={handleIntervalChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Minute</SelectItem>
                <SelectItem value="5">5 Minutes</SelectItem>
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="60">1 Hour</SelectItem>
                <SelectItem value="240">4 Hours</SelectItem>
                <SelectItem value="D">1 Day</SelectItem>
                <SelectItem value="W">1 Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={theme} onValueChange={handleThemeChange as (value: string) => void}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div ref={containerRef} className="w-full h-[500px] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div id="tradingview-widget-container" className="w-full h-full"></div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Powered by TradingView. Click the chart to explore more features. Change symbols and timeframes using the dropdowns above.
        </div>
      </CardContent>
    </Card>
  );
};

// Add this interface to make TypeScript happy
declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;
