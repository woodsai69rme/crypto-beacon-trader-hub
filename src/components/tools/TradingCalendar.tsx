
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const TradingCalendar: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Trading Calendar
        </CardTitle>
        <CardDescription>View important market events and dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Trading Calendar content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingCalendar;
