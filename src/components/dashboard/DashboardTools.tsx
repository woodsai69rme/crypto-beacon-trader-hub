
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaxCalculator from "../TaxCalculator";
import PortfolioBenchmarking from "../PortfolioBenchmarking";
import MarketMetrics from "../MarketMetrics";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";

// Sample portfolio performance data for demo
const samplePortfolioData = {
  performance: [0, 4.2, 7.1, 5.3, 10.7, 8.2, 12.1, 15.8, 12.3, 18.7, 16.1, 21.8],
  dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

const DashboardTools = () => {
  const [trades] = useLocalStorage<any[]>("fakeTradingHistory", []);
  const [activeTab, setActiveTab] = React.useState("metrics");

  const handleExportData = () => {
    // Create a JSON blob with all user data
    const userData = {
      trades,
      portfolio: "Sample portfolio data",
      watchlist: "Sample watchlist data",
      settings: "Sample user settings"
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "crypto_dashboard_data_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Trading & Analysis Tools</h2>
        <button 
          onClick={handleExportData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
        >
          Export All Data
        </button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="metrics">Market Metrics</TabsTrigger>
          <TabsTrigger value="benchmarking">Portfolio Benchmarking</TabsTrigger>
          <TabsTrigger value="tax">Tax Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <MarketMetrics />
        </TabsContent>
        
        <TabsContent value="benchmarking">
          <PortfolioBenchmarking 
            portfolioPerformance={samplePortfolioData.performance}
            portfolioDates={samplePortfolioData.dates}
          />
        </TabsContent>
        
        <TabsContent value="tax">
          <TaxCalculator trades={trades} />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>API Integration Guide</CardTitle>
            <CardDescription>Connect to popular cryptocurrency data providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="font-medium">CoinGecko API</div>
                <div className="text-sm text-muted-foreground">
                  Comprehensive cryptocurrency data with free tier
                </div>
                <div className="text-xs bg-muted p-2 rounded mt-2 font-mono">
                  https://api.coingecko.com/api/v3/coins/markets
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="font-medium">CoinMarketCap API</div>
                <div className="text-sm text-muted-foreground">
                  Professional-grade data with limited free tier
                </div>
                <div className="text-xs bg-muted p-2 rounded mt-2 font-mono">
                  https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="font-medium">Messari API</div>
                <div className="text-sm text-muted-foreground">
                  Crypto research and market intelligence
                </div>
                <div className="text-xs bg-muted p-2 rounded mt-2 font-mono">
                  https://data.messari.io/api/v1/assets
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Development Resources</CardTitle>
            <CardDescription>Tools and documentation for developers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Project Documentation</h3>
                <ul className="space-y-1 text-sm">
                  <li className="text-primary hover:underline cursor-pointer">
                    Developer Guide
                  </li>
                  <li className="text-primary hover:underline cursor-pointer">
                    API Documentation
                  </li>
                  <li className="text-primary hover:underline cursor-pointer">
                    Component Library
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Technical Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">React</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">TypeScript</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Tailwind CSS</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Shadcn/UI</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">Recharts</span>
                  <span className="px-2 py-1 bg-muted rounded-md text-xs">React Query</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">External Resources</h3>
                <ul className="space-y-1 text-sm">
                  <li className="text-primary hover:underline cursor-pointer">
                    GitHub Repository
                  </li>
                  <li className="text-primary hover:underline cursor-pointer">
                    Bug Tracker
                  </li>
                  <li className="text-primary hover:underline cursor-pointer">
                    Feature Requests
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTools;
