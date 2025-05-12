
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Widget, WidgetType } from '@/types/trading';
import { LineChart, PieChart, List, Bell, ChartBar, TrendingUp, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WidgetComponentProps {
  widget: Widget;
  onRemove?: (id: string) => void;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({ widget, onRemove }) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'price-chart':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-40 bg-primary/5 rounded-md">
              <LineChart className="h-10 w-10 text-primary/40" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">BTC/USD</span>
                <span className="font-medium">$40,521.34</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">24h Change</span>
                <span className="text-green-500">+3.2%</span>
              </div>
            </div>
          </div>
        );
      
      case 'portfolio-summary':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-40 bg-primary/5 rounded-md">
              <PieChart className="h-10 w-10 text-primary/40" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Value</span>
                <span className="font-medium">$24,892.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">24h Profit/Loss</span>
                <span className="text-green-500">+$423.67</span>
              </div>
            </div>
          </div>
        );
      
      case 'watchlist':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-primary/5 rounded">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                <div>
                  <p className="font-medium">Bitcoin</p>
                  <p className="text-xs text-muted-foreground">BTC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$40,521.34</p>
                <p className="text-xs text-green-500">+3.2%</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-primary/5 rounded">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                <div>
                  <p className="font-medium">Ethereum</p>
                  <p className="text-xs text-muted-foreground">ETH</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$2,235.11</p>
                <p className="text-xs text-green-500">+5.8%</p>
              </div>
            </div>
          </div>
        );
      
      case 'news':
        return (
          <div className="space-y-2">
            <div className="p-2 border-l-2 border-primary">
              <p className="text-sm font-medium">SEC Approves Bitcoin ETF Applications</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Bloomberg</p>
                <p className="text-xs text-muted-foreground">2h ago</p>
              </div>
            </div>
            <div className="p-2 border-l-2 border-primary">
              <p className="text-sm font-medium">Ethereum Completes Major Network Upgrade</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">CoinDesk</p>
                <p className="text-xs text-muted-foreground">5h ago</p>
              </div>
            </div>
          </div>
        );
      
      case 'alerts':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded">
              <Bell className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">BTC above $40,000</p>
                <p className="text-xs text-muted-foreground">Triggered 30m ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
              <Bell className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">ETH 10% gain alert</p>
                <p className="text-xs text-muted-foreground">Set · Not triggered</p>
              </div>
            </div>
          </div>
        );
      
      case 'trading':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">Trading</Badge>
              <Badge className="bg-green-500">Live</Badge>
            </div>
            
            <div className="p-3 bg-primary/5 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Bitcoin</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">Last Price:</p>
                    <p className="text-xs font-medium">$40,521.34</p>
                  </div>
                </div>
                <ChartBar className="h-8 w-8 text-primary/40" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-green-500/10 rounded text-center">
                <p className="text-xs text-muted-foreground">Buy</p>
                <p className="font-medium">$40,523.11</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded text-center">
                <p className="text-xs text-muted-foreground">Sell</p>
                <p className="font-medium">$40,519.85</p>
              </div>
            </div>
          </div>
        );
      
      case 'aiTrading':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <BrainCircuit className="h-3 w-3" />
                AI Trading
              </Badge>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            
            <div className="p-3 bg-primary/5 rounded">
              <p className="text-sm font-medium">AI Strategy: Trend Following</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">Performance (30d):</p>
                <p className="text-xs text-green-500 font-medium">+12.4%</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Position: Long</span>
              </div>
              <span className="text-xs">Updated 5m ago</span>
            </div>
          </div>
        );
      
      case 'aiAnalysis':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center gap-1">
                <BrainCircuit className="h-3 w-3" />
                AI Analysis
              </Badge>
            </div>
            
            <div className="p-3 bg-primary/5 rounded space-y-3">
              <div>
                <p className="text-sm font-medium">Market Sentiment</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-500">Bullish</Badge>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                AI analysis indicates strong bullish sentiment with increased institutional buying.
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-32 bg-primary/5 rounded-md">
            <p className="text-muted-foreground">{widget.type} Content</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>{renderWidgetContent()}</CardContent>
    </Card>
  );
};

export default WidgetComponent;
