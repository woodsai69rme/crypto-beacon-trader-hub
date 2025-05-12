
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Widget } from "@/types/trading";

interface WidgetComponentProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onResize?: (id: string, size: string) => void;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({ widget, onRemove, onResize }) => {
  const renderContent = () => {
    switch (widget.type) {
      case 'chart':
        return <div className="h-48 border rounded-lg flex items-center justify-center">Chart Widget</div>;
      
      case 'price-chart':
        return <div className="h-48 border rounded-lg flex items-center justify-center">Price Chart</div>;
      
      case 'portfolio-summary':
        return <div className="h-48 border rounded-lg flex items-center justify-center">Portfolio Summary</div>;
      
      case 'watchlist':
        return <div className="h-48 border rounded-lg flex items-center justify-center">Watchlist</div>;
        
      case 'table':
        return (
          <div className="h-48 overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">Bitcoin</td>
                  <td className="px-4 py-2 border-b">$61,245</td>
                  <td className="px-4 py-2 border-b text-green-500">+2.3%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">Ethereum</td>
                  <td className="px-4 py-2 border-b">$3,412</td>
                  <td className="px-4 py-2 border-b text-red-500">-1.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
        
      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">$24,521</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-sm text-muted-foreground">24h Change</div>
              <div className="text-2xl font-bold text-green-500">+$521</div>
            </div>
          </div>
        );
        
      case 'news':
        return (
          <div className="space-y-3">
            <div className="border-b pb-2">
              <div className="font-medium">Bitcoin Hits All-Time High</div>
              <div className="text-sm text-muted-foreground">May 12, 2025</div>
            </div>
            <div className="border-b pb-2">
              <div className="font-medium">New Regulations Coming</div>
              <div className="text-sm text-muted-foreground">May 11, 2025</div>
            </div>
          </div>
        );
        
      case 'alerts':
        return (
          <div className="space-y-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm">
              BTC price alert: Above $60,000
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm">
              ETH gas fees critical: 150 gwei
            </div>
          </div>
        );
      
      case 'trading':
        return <div className="h-48 border rounded-lg flex items-center justify-center">Trading Interface</div>;
        
      case 'aiTrading':
        return <div className="h-48 border rounded-lg flex items-center justify-center">AI Trading Analysis</div>;
        
      case 'aiAnalysis':
        return <div className="h-48 border rounded-lg flex items-center justify-center">AI Market Analysis</div>;
        
      case 'custom':
        return (
          <div className="text-center">
            {widget.customContent || 'Custom content goes here'}
          </div>
        );
        
      default:
        return <div>Widget Content</div>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md">{widget.title}</CardTitle>
        <div className="flex items-center space-x-1">
          {onResize && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onResize(widget.id, widget.size || 'medium')}>
              {widget.size === 'large' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(widget.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default WidgetComponent;
