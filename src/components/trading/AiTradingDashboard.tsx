
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelTrading from './model-trading/ModelTrading';
import { ModelTradingProvider } from '@/contexts/ModelTradingContext';
import AiTradingWithOpenRouter from './AiTradingWithOpenRouter';
import TradingChart from './TradingChart';
import {
  Bot,
  BarChart,
  LineChart,
  BrainCircuit,
  Network,
} from 'lucide-react';

const AiTradingDashboard: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  
  const initialCoins = [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      price: 65432.10,
      priceChange: 2341.50,
      changePercent: 3.7,
      volume: 32456789012,
      marketCap: 1234567890123,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)'
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: 3421.45,
      priceChange: 145.30,
      changePercent: 4.2,
      volume: 15678901234,
      marketCap: 413456789012,
      value: 'ethereum',
      label: 'Ethereum (ETH)'
    }
  ];
  
  const handleTrade = (trade: any) => {
    console.log('Trade executed:', trade);
    // In a real application, this would add the trade to the user's portfolio
    // or connect to an exchange API to execute the trade
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            AI Trading Dashboard
          </CardTitle>
          <CardDescription>
            Access advanced AI-powered trading tools and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="market-analysis" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="market-analysis" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span className="hidden md:inline">Market</span> Analysis
              </TabsTrigger>
              <TabsTrigger value="model-trading" className="flex items-center gap-1">
                <Network className="h-4 w-4" />
                <span className="hidden md:inline">AI</span> Model Trading
              </TabsTrigger>
              <TabsTrigger value="ai-advisor" className="flex items-center gap-1">
                <Bot className="h-4 w-4" />
                <span className="hidden md:inline">AI</span> Trading Assistant
              </TabsTrigger>
              <TabsTrigger value="backtesting" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span className="hidden md:inline">Performance</span> Analysis
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="market-analysis">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TradingChart 
                      coinId={selectedCoinId} 
                      showVolume={true}
                      showControls={true}
                    />
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">AI Market Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm">
                          Current market analysis will appear here. Connect OpenRouter API to enable AI-powered market analysis.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Key Levels</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Resistance 3</span>
                            <span className="font-medium">$68,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Resistance 2</span>
                            <span className="font-medium">$67,200</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Resistance 1</span>
                            <span className="font-medium">$66,400</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Current Price</span>
                            <span>$65,432</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Support 1</span>
                            <span className="font-medium">$64,800</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Support 2</span>
                            <span className="font-medium">$63,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Support 3</span>
                            <span className="font-medium">$62,200</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="model-trading">
                <ModelTradingProvider>
                  <ModelTrading initialCoins={initialCoins} onTrade={handleTrade} />
                </ModelTradingProvider>
              </TabsContent>
              
              <TabsContent value="ai-advisor">
                <AiTradingWithOpenRouter />
              </TabsContent>
              
              <TabsContent value="backtesting">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Performance Analysis</h3>
                  <p className="text-muted-foreground mt-2">
                    The performance analysis module is coming soon.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTradingDashboard;
