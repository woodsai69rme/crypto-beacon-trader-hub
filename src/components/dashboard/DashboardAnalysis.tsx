
import React from "react";
import RiskAssessment from "../RiskAssessment";
import TradingPairComparison from "../TradingPairComparison";
import MarketDepthChart from "../MarketDepthChart";
import SentimentAnalysis from "../SentimentAnalysis";
import FilteredNewsFeed from "../FilteredNewsFeed";

const DashboardAnalysis = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAssessment />
        <TradingPairComparison />
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketDepthChart coinId="bitcoin" symbol="BTC" />
        </div>
        <div>
          <SentimentAnalysis />
        </div>
      </div>
      
      <div className="mt-6">
        <FilteredNewsFeed />
      </div>
    </>
  );
};

export default DashboardAnalysis;
