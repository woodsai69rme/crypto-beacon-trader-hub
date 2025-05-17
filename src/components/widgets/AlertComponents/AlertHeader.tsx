
import React from "react";

export const AlertHeader: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Trading Alerts</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Create and manage your price, volume, and technical alerts
      </p>
    </div>
  );
};
