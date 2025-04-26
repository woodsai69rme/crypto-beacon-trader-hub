
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import TradingWidget from "./widgets/TradingWidget";
import { useTradingPortfolio } from "@/hooks/use-trading-portfolio";
import AiTradingBots from "./trading/AiTradingBots";
import AiMarketAnalysis from "./trading/AiMarketAnalysis";
import MultiExchangeTrading from "./trading/MultiExchangeTrading";
import TradingEducation from "./trading/TradingEducation";
import CommunityHub from "./community/CommunityHub";

export type WidgetType = 
  | "marketOverview" 
  | "cryptoChart" 
  | "portfolio" 
  | "watchlist" 
  | "correlations" 
  | "news" 
  | "sentiment"
  | "trading"
  | "aiTrading"
  | "multiExchange"
  | "education"
  | "community"
  | "aiAnalysis";

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: "small" | "medium" | "large" | "full";
  position: number;
}

interface CustomizableDashboardProps {
  availableWidgets?: Widget[];
  onLayoutSave?: (layout: Widget[]) => void;
  children?: React.ReactNode;
}

const defaultWidgets: Widget[] = [
  { id: "widget-trading", type: "trading", title: "Trading", size: "medium", position: 0 },
  { id: "widget-aiTrading", type: "aiTrading", title: "AI Trading Bots", size: "medium", position: 1 },
  { id: "widget-multiExchange", type: "multiExchange", title: "Multi-Exchange Trading", size: "full", position: 2 },
  { id: "widget-aiAnalysis", type: "aiAnalysis", title: "AI Market Analysis", size: "medium", position: 3 },
  { id: "widget-education", type: "education", title: "Trading Education", size: "medium", position: 4 },
  { id: "widget-community", type: "community", title: "Community Hub", size: "full", position: 5 },
];

const CustomizableDashboard = ({
  availableWidgets = defaultWidgets,
  onLayoutSave = () => {},
  children
}: CustomizableDashboardProps) => {
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets);
  const [isEditing, setIsEditing] = useState(false);
  const tradingPortfolio = useTradingPortfolio();

  const moveWidget = (id: string, direction: "up" | "down") => {
    const index = widgets.findIndex(w => w.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === widgets.length - 1)
    ) return;
    
    const newWidgets = [...widgets];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap positions
    const temp = { ...newWidgets[targetIndex] };
    newWidgets[targetIndex] = { ...newWidgets[index] };
    newWidgets[index] = temp;
    
    // Update position properties
    newWidgets[targetIndex].position = targetIndex;
    newWidgets[index].position = index;
    
    setWidgets(newWidgets);
  };

  const changeWidgetSize = (id: string, size: Widget["size"]) => {
    const newWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    );
    setWidgets(newWidgets);
  };

  const saveLayout = () => {
    onLayoutSave(widgets);
    setIsEditing(false);
    toast({
      title: "Layout saved",
      description: "Your dashboard layout has been updated"
    });
  };

  const getWidgetClassName = (size: Widget["size"]) => {
    switch (size) {
      case "small": return "col-span-1";
      case "medium": return "col-span-2";
      case "large": return "col-span-3";
      case "full": return "col-span-full";
      default: return "col-span-1";
    }
  };
  
  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "trading":
        return <TradingWidget isCompact={widget.size === "small"} />;
      case "aiTrading":
        return <AiTradingBots />;
      case "multiExchange":
        return <MultiExchangeTrading />;
      case "education":
        return <TradingEducation />;
      case "community":
        return <CommunityHub />;
      case "aiAnalysis":
        return <AiMarketAnalysis />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>Widget content for {widget.type}</CardContent>
          </Card>
        );
    }
  };

  if (!isEditing) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Customize Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {widgets.map(widget => (
            <div key={widget.id} className={getWidgetClassName(widget.size)}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>
        
        {children}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {widgets.map(widget => (
            <div 
              key={widget.id} 
              className="flex items-center justify-between p-3 border rounded-md bg-background"
            >
              <div className="flex items-center">
                <GripVertical className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{widget.title}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <select 
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value as Widget["size"])}
                  className="h-8 w-24 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="full">Full Width</option>
                </select>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => moveWidget(widget.id, "up")}
                    disabled={widget.position === 0}
                  >
                    ↑
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => moveWidget(widget.id, "down")}
                    disabled={widget.position === widgets.length - 1}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveLayout}>
              Save Layout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizableDashboard;
