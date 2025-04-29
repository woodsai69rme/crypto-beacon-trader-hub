
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, UploadCloud, FileDown, FileUp, BarChart4, Settings2, Wallet } from "lucide-react";
import CsvImportExport from "../tools/CsvImportExport";
import TaxCalculator from "../tools/TaxCalculator";
import ApiProviderManagement from "../api/ApiProviderManagement";
import PortfolioOptimizer from "../tools/PortfolioOptimizer";
import PortfolioBenchmarking from "../tools/PortfolioBenchmarking";
import NotificationSettings from "../settings/NotificationSettings";

const DashboardTools = () => {
  const samplePortfolioPerformance = [2.3, 1.8, -0.5, 1.2, 2.8, 3.2, -1.3, 0.7, 1.9, 2.1];
  const samplePortfolioDates = [
    "2023-01-01", "2023-02-01", "2023-03-01", "2023-04-01", "2023-05-01", 
    "2023-06-01", "2023-07-01", "2023-08-01", "2023-09-01", "2023-10-01"
  ];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="import-export" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="import-export">
            <UploadCloud className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Import/Export</span>
          </TabsTrigger>
          <TabsTrigger value="tax">
            <Wallet className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Tax Tools</span>
          </TabsTrigger>
          <TabsTrigger value="api">
            <Settings2 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">API Management</span>
          </TabsTrigger>
          <TabsTrigger value="optimizer">
            <BarChart4 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Portfolio Optimizer</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarking">
            <FileDown className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Benchmarking</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <FileUp className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import-export" className="mt-4">
          <CsvImportExport />
        </TabsContent>
        
        <TabsContent value="tax" className="mt-4">
          <TaxCalculator />
        </TabsContent>
        
        <TabsContent value="api" className="mt-4">
          <ApiProviderManagement />
        </TabsContent>
        
        <TabsContent value="optimizer" className="mt-4">
          <PortfolioOptimizer />
        </TabsContent>
        
        <TabsContent value="benchmarking" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Benchmarking</CardTitle>
              <CardDescription>
                Compare your portfolio performance against market benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioBenchmarking
                portfolioPerformance={samplePortfolioPerformance}
                portfolioDates={samplePortfolioDates}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-24 items-center justify-center">
              <Download className="h-6 w-6 mb-2" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 items-center justify-center">
              <UploadCloud className="h-6 w-6 mb-2" />
              <span>Import Data</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 items-center justify-center">
              <FileDown className="h-6 w-6 mb-2" />
              <span>Download Report</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 items-center justify-center">
              <FileUp className="h-6 w-6 mb-2" />
              <span>Upload Document</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTools;
