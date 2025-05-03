
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import CustomizableDashboard from './CustomizableDashboard';
import MarketCorrelations from './MarketCorrelations';
import FakeTrading from './FakeTrading';
import ApiManagementDashboard from './api/ApiManagementDashboard';
import { LayoutDashboard, TrendingUp, BarChartHorizontal, Settings } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Trading Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your portfolio, analyze market trends, and execute trades all in one place.
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px] w-full">
          <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center justify-center gap-2">
            <BarChartHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="correlations" className="flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Correlations</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center justify-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
          <CustomizableDashboard />
        </TabsContent>

        <TabsContent value="trading" className="space-y-6 animate-fade-in">
          <FakeTrading />
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6 animate-fade-in">
          <MarketCorrelations />
        </TabsContent>

        <TabsContent value="api" className="space-y-6 animate-fade-in">
          <ApiManagementDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
