
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import LiveAnalyticsDashboard from '@/components/analytics/LiveAnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive market analysis and portfolio insights
          </p>
        </div>
      </div>

      <LiveAnalyticsDashboard />
    </div>
  );
};

export default AnalyticsPage;
