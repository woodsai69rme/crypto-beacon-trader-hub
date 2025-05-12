
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, 
  LineChart, 
  BrainCircuit,
  TrendingUp,
  Settings,
  Clock,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnalysisHub from "../components/analysis/AnalysisHub";
import AiTradeRecommendations from "../components/analysis/AiTradeRecommendations";
import ComprehensiveMarketAnalysis from "../components/analysis/ComprehensiveMarketAnalysis";
import EnhancedPortfolioBenchmarking from "../components/portfolio/EnhancedPortfolioBenchmarking";

const mockPortfolio = {
  id: "portfolio-1",
  name: "My Portfolio",
  trades: [],
  balance: 25000,
  currency: "USD",
  createdAt: "2025-01-01T00:00:00Z"
};

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Advanced market analysis and trading insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" />
            Last Updated: 12 min ago
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Badge variant={activeTab === "btc" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("btc")}>
              BTC
            </Badge>
            <Badge variant={activeTab === "eth" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("eth")}>
              ETH
            </Badge>
            <Badge variant={activeTab === "sol" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("sol")}>
              SOL
            </Badge>
            <Badge variant={activeTab === "ada" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("ada")}>
              ADA
            </Badge>
            <Badge variant={activeTab === "link" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("link")}>
              LINK
            </Badge>
            <Badge variant={activeTab === "dot" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("dot")}>
              DOT
            </Badge>
            <Badge variant={activeTab === "uni" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("uni")}>
              UNI
            </Badge>
            <Badge variant={activeTab === "doge" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("doge")}>
              DOGE
            </Badge>
            <Badge variant={activeTab === "avax" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("avax")}>
              AVAX
            </Badge>
            <Badge variant={activeTab === "total" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("total")}>
              Market Cap
            </Badge>
            <Badge variant={activeTab === "defi" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveTab("defi")}>
              DeFi
            </Badge>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Market Analysis</span>
            <span className="sm:hidden">Analysis</span>
          </TabsTrigger>
          
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span className="hidden sm:inline">AI Recommendations</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Portfolio Analytics</span>
            <span className="sm:hidden">Portfolio</span>
          </TabsTrigger>
          
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced Tools</span>
            <span className="sm:hidden">Tools</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis">
          <AnalysisHub />
        </TabsContent>
        
        <TabsContent value="ai">
          <AiTradeRecommendations />
        </TabsContent>
        
        <TabsContent value="portfolio">
          <div className="space-y-6">
            <EnhancedPortfolioBenchmarking 
              portfolio={mockPortfolio}
              benchmark="btc"
              timeframe="30d"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tools">
          <ComprehensiveMarketAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
