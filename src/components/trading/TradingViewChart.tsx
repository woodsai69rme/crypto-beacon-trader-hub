
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TradingViewChartConfig } from "@/types/trading";

interface TradingViewChartProps {
  className?: string;
  initialSymbol?: string;
  initialTimeframe?: string;
}

const DEFAULT_CHART_CONFIG: TradingViewChartConfig = {
  symbol: "BTCUSD",
  interval: "D",
  theme: "dark",
  studies: ["RSI", "MACD"],
  width: 800,
  height: 500
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  className, 
  initialSymbol = "BTCUSD", 
  initialTimeframe = "D" 
}) => {
  const [symbol, setSymbol] = useState<string>(initialSymbol);
  const [timeframe, setTimeframe] = useState<string>(initialTimeframe);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartKey, setChartKey] = useState<number>(0);

  const reloadChart = () => {
    setChartKey(prev => prev + 1);
  };

  const goToTradingView = () => {
    window.open(`https://www.tradingview.com/chart/?symbol=${symbol}`, '_blank');
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  // Map timeframe values to TradingView intervals
  const mapTimeframeToInterval = (tf: string): string => {
    const mapping: { [key: string]: string } = {
      "1m": "1",
      "5m": "5",
      "15m": "15",
      "30m": "30",
      "1h": "60",
      "4h": "240",
      "1d": "D",
      "1w": "W",
      "1M": "M"
    };
    return mapping[tf] || "D";
  };

  const renderTradingViewWidget = (fullscreen = false) => {
    // This would normally be a real TradingView widget
    // For demo purposes, we'll use an iframe to their chart page
    const width = fullscreen ? "100%" : "100%";
    const height = fullscreen ? "70vh" : "500px";
    
    const chartUrl = `https://www.tradingview.com/chart/?symbol=${symbol}&interval=${mapTimeframeToInterval(timeframe)}&theme=${theme}`;
    
    return (
      <div key={chartKey} className={`w-full h-[${height}] rounded-md border overflow-hidden`}>
        <iframe
          src={chartUrl}
          style={{ width: "100%", height: height, border: "none" }}
          title="TradingView Chart"
        />
      </div>
    );
  };
  
  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="flex items-center">
                TradingView Charts
                <Button variant="link" className="p-0 h-auto ml-1" onClick={goToTradingView}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Advanced charting with TradingView</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                  <SelectItem value="ETHUSD">ETH/USD</SelectItem>
                  <SelectItem value="SOLUSD">SOL/USD</SelectItem>
                  <SelectItem value="ADAUSD">ADA/USD</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={reloadChart}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleFullscreen}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent ref={containerRef}>
          <div className="text-center py-4 text-muted-foreground text-sm">
            For real-time charting, click the Fullscreen button or visit TradingView
          </div>
          
          <div className="flex justify-center items-center h-[400px] border rounded-md bg-muted/20">
            <div className="text-center p-6">
              <img 
                src="/lovable-uploads/9b5cff85-2a54-47f1-be32-e9cac2b80e2e.png" 
                alt="TradingView Chart Preview" 
                className="max-w-full max-h-[300px] rounded-md mb-4"
              />
              <Button variant="default" onClick={handleFullscreen}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Open Chart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw]">
          <DialogHeader>
            <DialogTitle>TradingView Chart - {symbol}</DialogTitle>
          </DialogHeader>
          {renderTradingViewWidget(true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TradingViewChart;
