
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, TrendingUp, AlertTriangle, Bot } from 'lucide-react';

const NewsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crypto News & Analysis</h1>
        <p className="text-muted-foreground">Stay updated with the latest cryptocurrency news and AI-powered insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Latest News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Real-time crypto news aggregation coming soon...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">AI-powered sentiment analysis coming soon...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Fake News Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">AI fake news detection system coming soon...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">AI-generated market insights coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsPage;
