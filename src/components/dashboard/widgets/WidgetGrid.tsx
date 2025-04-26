
import React from "react";
import type { Widget } from "@/types/trading";
import TradingWidget from "@/components/widgets/TradingWidget";
import AiTradingBots from "@/components/trading/AiTradingBots";
import MultiExchangeTrading from "@/components/trading/MultiExchangeTrading";
import TradingEducation from "@/components/trading/TradingEducation";
import CommunityHub from "@/components/community/CommunityHub";
import AiMarketAnalysis from "@/components/trading/AiMarketAnalysis";
import CustomWidget from "@/components/widgets/CustomWidget";
import { Card } from "@/components/ui/card";

interface WidgetGridProps {
  widgets: Widget[];
}

const WidgetGrid = ({ widgets }: WidgetGridProps) => {
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
      case "custom":
        return <CustomWidget content={widget.customContent} title={widget.title} />;
      default:
        return (
          <Card className="p-4 h-full flex items-center justify-center text-muted-foreground">
            Widget type not implemented
          </Card>
        );
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {widgets.map(widget => (
        <div key={widget.id} className={getWidgetClassName(widget.size)}>
          {renderWidget(widget)}
        </div>
      ))}
      
      {widgets.length === 0 && (
        <div className="col-span-full text-center p-8 border border-dashed rounded-lg text-muted-foreground">
          No widgets have been added to your dashboard. Click "Customize Dashboard" to add widgets.
        </div>
      )}
    </div>
  );
};

export default WidgetGrid;
