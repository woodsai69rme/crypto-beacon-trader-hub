
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import RealTimeTrading from './trading/RealTimeTrading';
import TradingViewChart from './trading/TradingViewChart';

const FakeTrading = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trading Simulator</CardTitle>
          <CardDescription>
            Practice trading with virtual funds in a realistic market environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <TradingViewChart symbol="BTCUSD" />
            <RealTimeTrading />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FakeTrading;
