
import React from "react";
import type { Widget } from "@/types/trading";
import TradingWidget from "@/components/widgets/TradingWidget";
import AiTradingBots from "@/components/trading/AiTradingBots";
import MultiExchangeTrading from "@/components/trading/MultiExchangeTrading";
import TradingEducation from "@/components/trading/TradingEducation";
import CommunityHub from "@/components/community/CommunityHub";
import AiMarketAnalysis from "@/components/trading/AiMarketAnalysis";

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
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {widgets.map(widget => (
        <div key={widget.id} className={getWidgetClassName(widget.size)}>
          {renderWidget(widget)}
        </div>
      ))}
    </div>
  );
};

export default WidgetGrid;
