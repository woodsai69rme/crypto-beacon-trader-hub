
import React from "react";
import TaxReporting from "../TaxReporting";
import MarketCalendar from "../MarketCalendar";
import DataExportImport from "../DataExportImport";
import SocialSharing from "../SocialSharing";

const DashboardTools = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaxReporting />
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tools & Utilities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-secondary/10 transition-colors">
              <DataExportImport variant="ghost" />
              <span className="mt-2 text-sm text-muted-foreground">Export & Import Data</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-secondary/10 transition-colors">
              <SocialSharing variant="ghost" />
              <span className="mt-2 text-sm text-muted-foreground">Share Insights</span>
            </button>
          </div>
          <MarketCalendar />
        </div>
      </div>
    </div>
  );
};

export default DashboardTools;
