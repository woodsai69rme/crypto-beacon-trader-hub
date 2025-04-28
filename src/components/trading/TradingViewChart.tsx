
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  ChevronUp, 
  LineChart, 
  Layers, 
  Settings, 
  Maximize2, 
  PlusCircle, 
  MinusCircle
} from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: string | number;
  width?: string | number;
  style?: 'candles' | 'bars' | 'line' | 'area';
  containerId?: string;
  showToolbar?: boolean;
  showStudies?: boolean;
  allowFullscreen?: boolean;
  studies?: string[];
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'BTCUSD',
  interval = '240', // 4h default
  theme = 'dark',
  height = 550,
  width = '100%',
  style = 'candles',
  containerId = 'tradingview_chart',
  showToolbar = true,
  showStudies = true,
  allowFullscreen = true,
  studies = []
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [currentInterval, setCurrentInterval] = useState(interval);
  const [currentStyle, setCurrentStyle] = useState<string>(style);
  const [selectedStudies, setSelectedStudies] = useState<string[]>(
    studies.length ? studies : [
      "RSI@tv-basicstudies",
      "MACD@tv-basicstudies",
      "MASimple@tv-basicstudies"
    ]
  );
  const [isLoading, setIsLoading] = useState(true);
  
  const loadTradingViewWidget = () => {
    if (!window.TradingView) {
      setIsLoading(true);
      return;
    }
    
    // Clean up existing chart if it exists
    if (chartRef.current && chartRef.current.innerHTML !== '') {
      chartRef.current.innerHTML = '';
    }

    new window.TradingView.widget({
      symbol: currentSymbol,
      interval: currentInterval,
      timezone: "Etc/UTC",
      theme: theme,
      style: currentStyle,
      locale: "en",
      toolbar_bg: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
      enable_publishing: false,
      hide_side_toolbar: !showToolbar,
      hide_top_toolbar: !showToolbar,
      allow_symbol_change: true,
      save_image: true,
      container_id: containerId,
      width: width,
      height: height,
      studies: selectedStudies,
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '600',
      hide_volume: false,
      withdateranges: true,
      details: true,
      hotlist: true,
      calendar: true,
      studies_overrides: {
        "volume.volume.color.0": theme === 'dark' ? "rgba(255, 82, 82, 0.8)" : "rgba(255, 82, 82, 0.5)",
        "volume.volume.color.1": theme === 'dark' ? "rgba(76, 175, 80, 0.8)" : "rgba(76, 175, 80, 0.5)"
      },
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
      },
      loading_screen: { backgroundColor: theme === 'dark' ? '#131722' : '#ffffff' },
      autosize: true,
      debug: false
    });
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Create script element for TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      loadTradingViewWidget();
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  useEffect(() => {
    if (window.TradingView) {
      loadTradingViewWidget();
    }
  }, [currentSymbol, currentInterval, currentStyle, theme, selectedStudies]);

  const handleSymbolChange = (value: string) => {
    setCurrentSymbol(value);
  };

  const handleIntervalChange = (value: string) => {
    setCurrentInterval(value);
  };

  const handleStyleChange = (value: string) => {
    setCurrentStyle(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>TradingView Chart</CardTitle>
            <CardDescription>
              Professional chart with technical analysis tools
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={currentSymbol} onValueChange={handleSymbolChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                <SelectItem value="ETHUSD">ETH/USD</SelectItem>
                <SelectItem value="SOLUSD">SOL/USD</SelectItem>
                <SelectItem value="ADAUSD">ADA/USD</SelectItem>
                <SelectItem value="DOTUSD">DOT/USD</SelectItem>
                <SelectItem value="LINKUSD">LINK/USD</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={currentInterval} onValueChange={handleIntervalChange}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1m</SelectItem>
                <SelectItem value="5">5m</SelectItem>
                <SelectItem value="15">15m</SelectItem>
                <SelectItem value="60">1h</SelectItem>
                <SelectItem value="240">4h</SelectItem>
                <SelectItem value="D">1d</SelectItem>
                <SelectItem value="W">1w</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currentStyle} onValueChange={handleStyleChange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candles">Candles</SelectItem>
                <SelectItem value="bars">Bars</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant={isLoading ? "outline" : "secondary"}>
            {currentSymbol}
          </Badge>
          <Badge variant="outline">{currentInterval === 'D' ? '1d' : currentInterval === 'W' ? '1w' : `${currentInterval}m`}</Badge>
          <Badge variant="outline" className="capitalize">{currentStyle}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="w-full overflow-hidden rounded-md border">
          {isLoading && (
            <div className="flex items-center justify-center p-12 bg-muted/20">
              <LineChart className="animate-pulse h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div id={containerId} ref={chartRef} style={{ height }} />
        </div>
      </CardContent>
    </Card>
  );
};

// Add window.TradingView to avoid TS errors
declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;
