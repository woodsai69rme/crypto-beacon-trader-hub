
import React from "react";

const AlertHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Price Alerts</h2>
      <p className="text-sm text-muted-foreground">
        Get notified when cryptocurrencies reach your target prices
      </p>
    </div>
  );
};

export default AlertHeader;
