
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

const AnalysisDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Analysis Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p>Analysis dashboard content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDashboard;
