
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
      <header className="flex justify-between items-center mb-8 p-4 bg-card rounded-lg shadow-md border border-border">
        <div>
          <h1 className="text-2xl font-bold gradient-text">CryptoTrader Platform</h1>
          <p className="text-muted-foreground">Advanced Trading & Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="mr-2" />
        </div>
      </header>

      <main className="mb-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid ${isMobile ? 'grid-cols-2 mb-6' : 'grid-cols-5 mb-8'} bg-muted/30 p-1 rounded-lg`}>
            <TabsTrigger value="dashboard" className="rounded-md data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="trading" className="rounded-md data-[state=active]:shadow-sm">Trading</TabsTrigger>
            {!isMobile && <TabsTrigger value="models" className="rounded-md data-[state=active]:shadow-sm">AI Models</TabsTrigger>}
            {!isMobile && <TabsTrigger value="correlations" className="rounded-md data-[state=active]:shadow-sm">Correlations</TabsTrigger>}
            {!isMobile && <TabsTrigger value="api" className="rounded-md data-[state=active]:shadow-sm">API Management</TabsTrigger>}
            {isMobile && <TabsTrigger value="more" className="rounded-md data-[state=active]:shadow-sm">More</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card className="shadow-md border border-border overflow-hidden">
              <CardHeader className="bg-card pb-2">
                <CardTitle>Trading Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
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
                <TabsList className="grid grid-cols-3 mb-4 bg-muted/30 p-1 rounded-lg">
                  <TabsTrigger value="models" className="rounded-md data-[state=active]:shadow-sm">AI Models</TabsTrigger>
                  <TabsTrigger value="correlations" className="rounded-md data-[state=active]:shadow-sm">Correlations</TabsTrigger>
                  <TabsTrigger value="api" className="rounded-md data-[state=active]:shadow-sm">API Management</TabsTrigger>
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
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
