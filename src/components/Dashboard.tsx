
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import CustomizableDashboard from './CustomizableDashboard';
import MarketCorrelations from './MarketCorrelations';
import FakeTrading from './FakeTrading';
import ApiManagementDashboard from './api/ApiManagementDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Trading Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your portfolio, analyze market trends, and execute trades all in one place.
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px] w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CustomizableDashboard />
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <FakeTrading />
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <MarketCorrelations />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiManagementDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
