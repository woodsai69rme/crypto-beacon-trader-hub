
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AiChatInterface from "../ai/AiChatInterface";
import TaxCalculator from "../TaxCalculator";
import UtilityDashboard from "../UtilityDashboard";
import { ExternalLink, MessageSquare, Calculator, Wrench } from "lucide-react";
import { Trade } from "@/types/trading";

// Mock trades data for TaxCalculator
const mockTrades: Trade[] = [
  {
    id: "trade-1",
    coinId: "bitcoin",
    type: "buy",
    amount: 0.5,
    price: 40000,
    timestamp: new Date(2023, 1, 15).toISOString(),
    total: 20000,
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    totalValue: 20000,
    currency: "USD"
  },
  {
    id: "trade-2",
    coinId: "ethereum",
    type: "sell",
    amount: 2,
    price: 3000,
    timestamp: new Date(2023, 4, 20).toISOString(),
    total: 6000,
    coinName: "Ethereum",
    coinSymbol: "ETH",
    totalValue: 6000,
    currency: "USD"
  }
];

const DashboardTools = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="ai-chat" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="ai-chat">
            <MessageSquare className="h-4 w-4 mr-2" /> AI Chat
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" /> Tax Calculator
          </TabsTrigger>
          <TabsTrigger value="utilities">
            <Wrench className="h-4 w-4 mr-2" /> Utilities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-chat" className="animate-fade-in">
          <AiChatInterface />
        </TabsContent>
        
        <TabsContent value="calculator" className="animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <TaxCalculator trades={mockTrades} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="utilities" className="animate-fade-in">
          <UtilityDashboard />
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-muted-foreground text-right">
        <a
          href="https://openrouter.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:underline"
        >
          Powered by OpenRouter <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default DashboardTools;
