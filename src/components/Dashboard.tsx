
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidgetGrid from './dashboard/WidgetGrid';
import { Widget } from '@/types/trading';

// Sample widgets for the dashboard
const sampleWidgets: Widget[] = [
  { id: "w1", title: "Bitcoin Price", type: "price-chart" },
  { id: "w2", title: "Portfolio Overview", type: "portfolio-summary" },
  { id: "w3", title: "Watchlist", type: "watchlist" },
  { id: "w4", title: "Real-time Prices", type: "chart" }
];

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <p className="text-muted-foreground">Monitor your portfolio and the market</p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <WidgetGrid widgets={sampleWidgets} />
        </TabsContent>
        
        <TabsContent value="trading" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-12 text-center text-muted-foreground">
                Trading interface content will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-12 text-center text-muted-foreground">
                Portfolio management tools will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-12 text-center text-muted-foreground">
                Advanced analytics will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
