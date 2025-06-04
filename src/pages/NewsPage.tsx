
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, TrendingUp, AlertTriangle, Globe } from 'lucide-react';

const NewsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Newspaper className="h-8 w-8" />
            Crypto News & Sentiment
          </h1>
          <p className="text-muted-foreground mt-2">
            Latest cryptocurrency news with AI-powered sentiment analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Latest News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">Bitcoin Reaches New All-Time High</h3>
                <p className="text-sm text-muted-foreground">Institutional adoption drives BTC to unprecedented levels...</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Bullish</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Ethereum 2.0 Update Shows Promise</h3>
                <p className="text-sm text-muted-foreground">Network improvements boost scalability and reduce fees...</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Neutral</span>
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">Regulatory Concerns in Asian Markets</h3>
                <p className="text-sm text-muted-foreground">New regulations may impact crypto trading volumes...</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Bearish</span>
                  <span className="text-xs text-muted-foreground">6 hours ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Overall</span>
                  <span className="font-medium text-green-600">Bullish (72%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Bitcoin</span>
                  <span className="font-medium text-green-600">Very Bullish (85%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Ethereum</span>
                  <span className="font-medium text-blue-600">Neutral (58%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Altcoins</span>
                  <span className="font-medium text-orange-600">Mixed (45%)</span>
                </div>
              </div>
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
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-medium text-red-800">Detected: 3 fake articles</p>
                  <p className="text-xs text-red-600">AI flagged suspicious content in the last 24h</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800">Verified: 47 authentic articles</p>
                  <p className="text-xs text-green-600">Cross-referenced with reliable sources</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
