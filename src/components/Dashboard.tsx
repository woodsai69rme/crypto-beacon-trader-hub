
import React from 'react';
import RealTrading from './trading/RealTrading';
import MarketCorrelations from './MarketCorrelations/MarketCorrelations';
import PortfolioOptimizer from './aiPortfolioOptimization/PortfolioOptimizer';
import AutomatedTradingSignals from './trading/AutomatedTradingSignals';
import RiskAssessment from './RiskAssessment';
import PersonalizedMarketInsights from './trading/PersonalizedMarketInsights';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealTrading />
        </div>
        <div className="lg:col-span-1">
          <PortfolioOptimizer />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutomatedTradingSignals />
        <RiskAssessment />
      </div>
      
      <MarketCorrelations />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PersonalizedMarketInsights />
        </div>
        <div>
          <div className="h-full bg-card border rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Portfolio Summary</h3>
              <p className="text-muted-foreground mb-4">Track your crypto portfolio performance</p>
              <p className="text-sm bg-muted/50 p-2 rounded">Coming soon in the next update</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
