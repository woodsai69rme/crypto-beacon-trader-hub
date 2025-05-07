
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

const AiMarketAnalysis: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Market Analysis
        </CardTitle>
        <CardDescription>AI-powered market analysis and insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>AI Market Analysis content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiMarketAnalysis;
