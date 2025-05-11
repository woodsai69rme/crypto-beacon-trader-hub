
import React from 'react';

export const AlertHeader: React.FC = () => {
  return (
    <div className="pb-4 border-b">
      <h2 className="text-lg font-semibold">Price Alerts</h2>
      <p className="text-sm text-muted-foreground">
        Set alerts for price movements in cryptocurrencies you're tracking
      </p>
    </div>
  );
};

export default AlertHeader;
