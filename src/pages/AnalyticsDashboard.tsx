
import React from 'react';
import AnalysisHub from '../components/analysis/AnalysisHub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <AnalysisHub />
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              More detailed analytics features coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
