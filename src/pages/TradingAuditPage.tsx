
import React from 'react';
import TradingAuditSystem from '@/components/trading/TradingAuditSystem';

const TradingAuditPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Trading System Audit</h1>
        <p className="text-muted-foreground">
          Comprehensive audit and profitability analysis of your trading system
        </p>
      </div>
      <TradingAuditSystem />
    </div>
  );
};

export default TradingAuditPage;
