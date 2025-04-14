
import React from "react";
import Portfolio from "../Portfolio";
import PortfolioAnalytics from "../PortfolioAnalytics";
import TransactionHistory from "../TransactionHistory";
import DataExportImport from "../DataExportImport";
import SocialSharing from "../SocialSharing";
import EnhancedCryptoChart from "../EnhancedCryptoChart";
import CoinComparison from "../CoinComparison";

const DashboardPortfolio = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Portfolio />
        </div>
        <div>
          <PortfolioAnalytics />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <div className="flex gap-2">
          <DataExportImport variant="outline" size="sm" />
          <SocialSharing />
        </div>
      </div>
      
      <TransactionHistory />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
        <CoinComparison />
      </div>
    </div>
  );
};

export default DashboardPortfolio;
