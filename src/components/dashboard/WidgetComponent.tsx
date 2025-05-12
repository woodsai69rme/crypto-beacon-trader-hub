
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetType } from '@/types/trading';
import PriceChart from "@/components/charts/PriceChart";
import RealTimePrices from "@/components/charts/RealTimePrices";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import WatchlistManager from "@/components/trading/WatchlistManager";

interface WidgetComponentProps {
  type: WidgetType;
  title: string;
  className?: string;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({
  type,
  title,
  className = "",
}) => {
  const renderWidgetContent = () => {
    switch (type) {
      case "price-chart":
        return <PriceChart coinId="bitcoin" height={300} />;
      
      case "portfolio-summary":
        return <PortfolioSummary />;
      
      case "watchlist":
        return <WatchlistManager />;
      
      case "chart":
        return <RealTimePrices initialCoins={[]} />;
      
      case "trading":
        return <div>Trading Widget</div>;
      
      case "aiTrading":
        return <div>AI Trading Widget</div>;
      
      case "aiAnalysis":
        return <div>AI Analysis Widget</div>;
      
      case "stats":
        return <div>Statistics</div>;
      
      case "news":
        return <div>News Feed</div>;
      
      case "alerts":
        return <div>Price Alerts</div>;
      
      case "table":
        return <div>Data Table</div>;
      
      case "custom":
      default:
        return <div>Custom Widget</div>;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

export default WidgetComponent;
