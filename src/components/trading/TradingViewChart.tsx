
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TradingViewChartConfig } from '@/types/trading';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: string;
  width?: string;
  style?: 'candles' | 'bars' | 'line' | 'area';
  containerId?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  interval = '240', // 4h default
  theme = 'dark',
  height = '550',
  width = '100%',
  style = 'candles',
  containerId = 'tradingview_chart'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create script element for TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: style,
          locale: "en",
          toolbar_bg: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          container_id: containerId,
          width: width,
          height: height,
          studies: [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "MASimple@tv-basicstudies"
          ],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '600',
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, theme, style, height, width, containerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>TradingView Chart</CardTitle>
        <CardDescription>
          Interactive chart with technical analysis tools powered by TradingView
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-hidden rounded-md border">
          <div id={containerId} ref={chartRef} />
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
