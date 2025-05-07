
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const MarketHours: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Market Hours
        </CardTitle>
        <CardDescription>View trading hours for global markets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Market Hours content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketHours;
