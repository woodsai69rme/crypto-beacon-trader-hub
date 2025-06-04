
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, TrendingUp, Settings } from 'lucide-react';
import AiTradingDashboard from '@/components/trading/AiTradingDashboard';
import ComprehensiveTradingDashboard from '@/components/trading/ComprehensiveTradingDashboard';

const AiBotsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8" />
            AI Trading Bots
          </h1>
          <p className="text-muted-foreground mt-2">
            Automated trading strategies powered by advanced AI algorithms
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Strategies</p>
                <p className="text-2xl font-bold">13+</p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">24h Profit</p>
                <p className="text-2xl font-bold text-green-600">+$1,247</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">73.5%</p>
              </div>
              <Bot className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <ComprehensiveTradingDashboard />
    </div>
  );
};

export default AiBotsPage;
