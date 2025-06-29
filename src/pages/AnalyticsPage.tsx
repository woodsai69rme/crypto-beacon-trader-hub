
import React from 'react';
import WoodsAnalyticsDashboard from '@/components/analytics/WoodsAnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <WoodsAnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;
