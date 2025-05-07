
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const TradingEducation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Trading Education
        </CardTitle>
        <CardDescription>Learn trading strategies and techniques</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Trading Education content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingEducation;
