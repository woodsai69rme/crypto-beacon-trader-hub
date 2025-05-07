
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const SentimentAnalysis: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Sentiment Analysis
        </CardTitle>
        <CardDescription>Analyze market sentiment from social media and news</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Sentiment Analysis content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
