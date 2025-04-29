
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload } from "lucide-react";

const CsvImportExport = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export Data</CardTitle>
        <CardDescription>
          Import your trading data from CSV files or export your current data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="import">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" />
              <p className="text-sm text-muted-foreground">
                Your CSV file should have columns for Date, Type, Amount, Price, and Total Value
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Sample CSV Format</Label>
              <div className="bg-muted p-2 rounded-md text-xs font-mono overflow-x-auto">
                Date,Type,Coin,Amount,Price,Total<br />
                2023-01-01,buy,BTC,0.1,50000,5000<br />
                2023-01-15,sell,ETH,2,3000,6000
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Select Data to Export</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="trades" className="rounded" checked />
                  <Label htmlFor="trades">Trades</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="portfolio" className="rounded" checked />
                  <Label htmlFor="portfolio">Portfolio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="watchlist" className="rounded" />
                  <Label htmlFor="watchlist">Watchlist</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="alerts" className="rounded" />
                  <Label htmlFor="alerts">Alerts</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>
          <TabsContent value="import">
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </TabsContent>
          <TabsContent value="export">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </TabsContent>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CsvImportExport;
