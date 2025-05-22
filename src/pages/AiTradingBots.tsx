
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AITradingStrategy } from '@/types/trading';

// Import the existing AiTradingBots component
import AiTradingBotsComponent from '@/components/trading/AiTradingBots';

const AiTradingBots: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">AI Trading Bots</h1>
      
      <div className="grid gap-6">
        <AiTradingBotsComponent />
      </div>
    </div>
  );
};

export default AiTradingBots;
