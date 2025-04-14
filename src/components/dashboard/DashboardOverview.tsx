
import React from "react";
import EnhancedCryptoChart from "../EnhancedCryptoChart";
import MarketOverview from "../MarketOverview";
import SentimentAnalysis from "../SentimentAnalysis";
import TradingPairComparison from "../TradingPairComparison";
import FilteredNewsFeed from "../FilteredNewsFeed";

const DashboardOverview = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
        </div>
        <div>
          <SentimentAnalysis />
        </div>
      </div>
      
      <div className="mt-6">
        <MarketOverview />
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingPairComparison />
        </div>
        <div>
          <FilteredNewsFeed />
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
