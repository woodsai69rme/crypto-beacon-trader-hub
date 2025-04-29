import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TaxCalculator from "../TaxCalculator";
import EnhancedPortfolioBenchmarking from "../portfolio/EnhancedPortfolioBenchmarking";
import MarketMetrics from "../MarketMetrics";
import LocalAiModels from "../trading/LocalAiModels";
import ApiProviderManagement from "../api/ApiProviderManagement";
import TaxHarvestingTool from "../tax/TaxHarvestingTool";
import ATOTaxCalculator from "../tax/ATOTaxCalculator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";
import { Download, Settings, BarChart4, FileText, Database, Share2 } from "lucide-react";

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
        <Button 
          onClick={handleExportData}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export All Data
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="metrics">
            <BarChart4 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Market Metrics</span>
            <span className="sm:hidden">Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarking">
            <Share2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Portfolio Benchmarking</span>
            <span className="sm:hidden">Benchmarking</span>
          </TabsTrigger>
          <TabsTrigger value="tax">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tax Calculator</span>
            <span className="sm:hidden">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="ato">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">ATO Tax</span>
            <span className="sm:hidden">ATO</span>
          </TabsTrigger>
          <TabsTrigger value="harvest">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tax Harvesting</span>
            <span className="sm:hidden">Harvest</span>
          </TabsTrigger>
          <TabsTrigger value="api">
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">API Management</span>
            <span className="sm:hidden">APIs</span>
          </TabsTrigger>
          <TabsTrigger value="local">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Local AI</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <MarketMetrics />
        </TabsContent>
        
        <TabsContent value="benchmarking">
          <EnhancedPortfolioBenchmarking 
            portfolioPerformance={samplePortfolioData.performance}
            portfolioDates={samplePortfolioData.dates}
          />
        </TabsContent>
        
        <TabsContent value="tax">
          <TaxCalculator trades={trades} />
        </TabsContent>
        
        <TabsContent value="ato">
          <ATOTaxCalculator />
        </TabsContent>
        
        <TabsContent value="harvest">
          <TaxHarvestingTool />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiProviderManagement />
        </TabsContent>
        
        <TabsContent value="local">
          <div className="p-4 border rounded-md bg-muted/30 mb-6">
            <h3 className="font-medium mb-2">Local AI Model Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to AI models running on your local machine for enhanced privacy, customization, 
              and reduced dependency on cloud APIs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" onClick={() => window.location.href = "#trading"}>
                Go to Trading Bots
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <LocalAiModels />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTools;
