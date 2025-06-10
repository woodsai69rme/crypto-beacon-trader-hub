
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiBotCreator from '@/components/trading/AiBotCreator';
import EnhancedAiBotDashboard from '@/components/trading/EnhancedAiBotDashboard';

const AiBotsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Trading Bots</h1>
          <p className="text-muted-foreground">Create and manage your automated trading strategies</p>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Bot Dashboard</TabsTrigger>
            <TabsTrigger value="creator">Create New Bot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <EnhancedAiBotDashboard />
          </TabsContent>
          
          <TabsContent value="creator">
            <AiBotCreator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AiBotsPage;
