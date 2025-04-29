
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeTrading from '@/components/trading/RealTimeTrading';
import DashboardTrading from '@/components/dashboard/DashboardTrading';
import LocalAiModels from '@/components/trading/LocalAiModels';
import MarketCorrelations from '@/components/MarketCorrelations/MarketCorrelations';
import ApiManagementDashboard from '@/components/api/ApiManagementDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background text-foreground">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">CryptoTrader Platform</h1>
          <p className="text-muted-foreground">Advanced Trading & Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="mr-2" />
        </div>
      </header>

      <main>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2 mb-4' : 'grid-cols-5 mb-6'}`}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            {!isMobile && <TabsTrigger value="models">AI Models</TabsTrigger>}
            {!isMobile && <TabsTrigger value="correlations">Correlations</TabsTrigger>}
            {!isMobile && <TabsTrigger value="api">API Management</TabsTrigger>}
            {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeTrading />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <DashboardTrading />
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <LocalAiModels />
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <MarketCorrelations />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <ApiManagementDashboard />
          </TabsContent>

          {isMobile && (
            <TabsContent value="more">
              <Tabs defaultValue="models">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="models">AI Models</TabsTrigger>
                  <TabsTrigger value="correlations">Correlations</TabsTrigger>
                  <TabsTrigger value="api">API Management</TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="pt-4">
                  <LocalAiModels />
                </TabsContent>

                <TabsContent value="correlations" className="pt-4">
                  <MarketCorrelations />
                </TabsContent>

                <TabsContent value="api" className="pt-4">
                  <ApiManagementDashboard />
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </main>

      <footer className="mt-10 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
          <div className="mb-4 md:mb-0">
            CryptoTrader Platform © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
