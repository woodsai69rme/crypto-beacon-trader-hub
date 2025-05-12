
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DashboardTools = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Tools</h2>
      
      <Tabs defaultValue="trading">
        <TabsList>
          <TabsTrigger value="trading">Trading Tools</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trading" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Set up price alerts for your favorite cryptocurrencies.</p>
                <Button>Configure Alerts</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trading Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Calculate profit, loss, and trading fees.</p>
                <Button>Open Calculator</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Advanced technical analysis tools and indicators.</p>
                <Button>View Analysis</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Analyze market sentiment using social media data.</p>
                <Button>View Sentiment</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Optimizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Optimize your portfolio for risk and return.</p>
                <Button>Optimize Portfolio</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Benchmarking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Compare your portfolio performance to benchmarks.</p>
                <Button>View Benchmarks</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTools;
