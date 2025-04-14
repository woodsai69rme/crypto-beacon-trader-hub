
import React from "react";
import Watchlist from "../Watchlist";
import EnhancedCryptoChart from "../EnhancedCryptoChart";
import FilteredNewsFeed from "../FilteredNewsFeed";
import DataExportImport from "../DataExportImport";
import SocialSharing from "../SocialSharing";

const DashboardWatchlist = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">My Watchlist</h2>
        <div className="flex gap-2">
          <DataExportImport variant="outline" size="sm" />
          <SocialSharing />
        </div>
      </div>
      
      <Watchlist />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedCryptoChart coin="Bitcoin" coinId="bitcoin" color="#F7931A" />
        </div>
        <div>
          <FilteredNewsFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardWatchlist;
