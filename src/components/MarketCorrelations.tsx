
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";

const MarketCorrelations: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Market Correlations
        </CardTitle>
        <CardDescription>Analyze correlations between different markets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Market Correlations content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
