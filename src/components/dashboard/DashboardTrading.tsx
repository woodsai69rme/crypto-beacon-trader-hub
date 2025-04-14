
import React from "react";
import ApiKeyManagement from "../ApiKeyManagement";
import MarketDepthChart from "../MarketDepthChart";
import EnhancedCryptoChart from "../EnhancedCryptoChart";
import TradingPairComparison from "../TradingPairComparison";
import CoinComparison from "../CoinComparison";
import FilteredNewsFeed from "../FilteredNewsFeed";

const DashboardTrading = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <ApiKeyManagement />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketDepthChart coinId="bitcoin" symbol="BTC" />
        <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
      </div>
      
      <TradingPairComparison />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CoinComparison />
        </div>
        <div>
          <FilteredNewsFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardTrading;
