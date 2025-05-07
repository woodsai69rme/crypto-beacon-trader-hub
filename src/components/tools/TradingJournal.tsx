
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const TradingJournal: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Trading Journal
        </CardTitle>
        <CardDescription>Track and analyze your trades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Trading Journal content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingJournal;
