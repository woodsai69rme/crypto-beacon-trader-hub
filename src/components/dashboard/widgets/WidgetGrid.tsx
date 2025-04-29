
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Widget, WidgetGridProps } from "@/types/trading";
import EnhancedCryptoChart from "@/components/EnhancedCryptoChart";
import MarketOverview from "@/components/MarketOverview";
import FilteredNewsFeed from "@/components/FilteredNewsFeed";
import Watchlist from "@/components/Watchlist";

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, onRemove, onUpdatePosition }) => {
  // Helper to render widget content based on type
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "portfolio":
      case "portfolio-summary":
        return <div>Portfolio Summary Widget</div>;
      case "chart":
      case "price-chart":
        return <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />;
      case "watchlist":
        return <Watchlist />;
      case "news":
        return <FilteredNewsFeed />;
      case "alerts":
        return <div>Alerts Widget</div>;
      case "market-overview":
        return <MarketOverview />;
      case "performance-metrics":
        return <div>Performance Metrics Widget</div>;
      case "trade-history":
        return <div>Trade History Widget</div>;
      case "trading":
        return <div>Trading Widget</div>;
      case "aiTrading":
        return <div>AI Trading Widget</div>;
      case "multiExchange":
        return <div>Multi-Exchange Widget</div>;
      case "education":
        return <div>Trading Education Widget</div>;
      case "community":
        return <div>Community Widget</div>;
      case "aiAnalysis":
        return <div>AI Analysis Widget</div>;
      case "custom":
        return <div>{widget.customContent || "Custom Widget"}</div>;
      default:
        return <div>Unknown Widget Type</div>;
    }
  };
  
  // Determine widget size classes
  const getWidgetSizeClasses = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1";
      case "medium":
        return "col-span-1 md:col-span-1";
      case "large":
        return "col-span-1 md:col-span-2";
      case "full":
        return "col-span-1 md:col-span-3";
      default:
        return "col-span-1";
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <Card 
          key={widget.id} 
          className={`${getWidgetSizeClasses(widget.size)} h-[350px] overflow-hidden`}
        >
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{widget.title}</CardTitle>
              {onRemove && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemove(widget.id)}
                  className="h-6 w-6"
                  aria-label={`Remove ${widget.title} widget`}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[290px] overflow-auto">
            {renderWidgetContent(widget)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WidgetGrid;
