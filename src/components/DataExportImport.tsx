
import { useState } from "react";
import { Download, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface DataExportImportProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const DataExportImport = ({ variant = "outline", size = "default" }: DataExportImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [exportType, setExportType] = useState("portfolio");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  
  // Mock data for export
  const mockPortfolioData = {
    holdings: [
      { id: "bitcoin", symbol: "BTC", name: "Bitcoin", amount: 0.5, valueUSD: 20000 },
      { id: "ethereum", symbol: "ETH", name: "Ethereum", amount: 5, valueUSD: 10000 },
      { id: "solana", symbol: "SOL", name: "Solana", amount: 50, valueUSD: 5000 },
    ],
    totalValue: 35000,
    performance: {
      daily: 2.3,
      weekly: -1.5,
      monthly: 15.2,
      allTime: 120.5
    },
    transactions: [
      { id: "tx1", type: "buy", coin: "Bitcoin", amount: 0.2, price: 39500, date: "2025-02-15", total: 7900 },
      { id: "tx2", type: "sell", coin: "Ethereum", amount: 1, price: 1950, date: "2025-03-01", total: 1950 },
      { id: "tx3", type: "buy", coin: "Solana", amount: 20, price: 95, date: "2025-03-10", total: 1900 },
    ]
  };
  
  const mockWatchlistData = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    { id: "cardano", symbol: "ADA", name: "Cardano" },
    { id: "solana", symbol: "SOL", name: "Solana" },
    { id: "ripple", symbol: "XRP", name: "XRP" },
  ];
  
  const mockTaxReport = {
    year: 2025,
    totalProfitLoss: 12500,
    shortTermGains: 8200,
    longTermGains: 4300,
    transactions: [
      { date: "2025-01-15", type: "buy", asset: "Bitcoin", quantity: 0.5, costBasis: 19500, proceeds: 0, gain: 0 },
      { date: "2025-02-10", type: "sell", asset: "Bitcoin", quantity: 0.2, costBasis: 7800, proceeds: 9600, gain: 1800 },
      { date: "2025-03-05", type: "buy", asset: "Ethereum", quantity: 5, costBasis: 9500, proceeds: 0, gain: 0 },
      { date: "2025-03-20", type: "sell", asset: "Ethereum", quantity: 2, costBasis: 3800, proceeds: 4100, gain: 300 },
    ]
  };
  
  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      let dataToExport;
      let filename;
      
      // Determine which data to export based on export type
      switch (exportType) {
        case "portfolio":
          dataToExport = mockPortfolioData;
          filename = "crypto-portfolio";
          break;
        case "watchlist":
          dataToExport = mockWatchlistData;
          filename = "crypto-watchlist";
          break;
        case "tax":
          dataToExport = mockTaxReport;
          filename = "crypto-tax-report";
          break;
        default:
          dataToExport = mockPortfolioData;
          filename = "crypto-data";
      }
      
      // Format data according to selected export format
      let content: string;
      let mimeType: string;
      
      switch (exportFormat) {
        case "json":
          content = JSON.stringify(dataToExport, null, 2);
          mimeType = "application/json";
          filename = `${filename}.json`;
          break;
        case "csv":
          content = convertToCSV(dataToExport);
          mimeType = "text/csv";
          filename = `${filename}.csv`;
          break;
        case "pdf":
          // In a real app, PDF generation would be more complex
          content = JSON.stringify(dataToExport, null, 2);
          mimeType = "application/json"; // Use JSON as fallback
          filename = `${filename}.json`; // Use JSON as fallback
          toast({
            title: "PDF Export",
            description: "PDF export is not available in this demo. Using JSON format instead.",
            variant: "destructive",
          });
          break;
        default:
          content = JSON.stringify(dataToExport, null, 2);
          mimeType = "application/json";
          filename = `${filename}.json`;
      }
      
      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      
      toast({
        title: "Export successful",
        description: `Your ${exportType} data has been exported as ${filename}`,
      });
    }, 1000); // Simulate processing time
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImportedFile(file);
  };
  
  const handleImport = () => {
    if (!importedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }
    
    setIsImporting(true);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        
        // In a real app, you would validate and process the imported data
        // For this demo, we'll just confirm the import
        
        setTimeout(() => {
          setIsImporting(false);
          setImportedFile(null);
          
          const fileInput = document.getElementById("file-upload") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
          
          toast({
            title: "Import successful",
            description: `Data from ${importedFile.name} has been imported`,
          });
        }, 1000); // Simulate processing time
      } catch (error) {
        setIsImporting(false);
        toast({
          title: "Import failed",
          description: "The file could not be processed. Please check the format.",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      setIsImporting(false);
      toast({
        title: "Import failed",
        description: "There was an error reading the file",
        variant: "destructive",
      });
    };
    
    reader.readAsText(importedFile);
  };
  
  // Helper function to convert object to CSV
  const convertToCSV = (data: any): string => {
    // This is a simplified CSV conversion
    // In a real app, you would need a more robust CSV generation
    
    if (Array.isArray(data)) {
      // Handle array of objects
      if (data.length === 0) return "";
      
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(item => 
        Object.values(item)
          .map(value => typeof value === "string" ? `"${value}"` : value)
          .join(",")
      );
      
      return [headers, ...rows].join("\n");
    } else {
      // Handle nested objects (simplified)
      let csv = "";
      
      // Extract top-level keys except objects and arrays
      let headers: string[] = [];
      let values: string[] = [];
      
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== "object" || value === null) {
          headers.push(key);
          values.push(typeof value === "string" ? `"${value}"` : String(value));
        }
      });
      
      if (headers.length > 0) {
        csv += headers.join(",") + "\n";
        csv += values.join(",") + "\n\n";
      }
      
      // Handle nested arrays of objects
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          csv += `${key}:\n`;
          const nestedHeaders = Object.keys(value[0]).join(",");
          csv += nestedHeaders + "\n";
          
          value.forEach(item => {
            const row = Object.values(item)
              .map(v => typeof v === "string" ? `"${v}"` : v)
              .join(",");
            csv += row + "\n";
          });
          
          csv += "\n";
        }
      });
      
      return csv;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <FileText className="h-4 w-4 mr-2" />
          <span>Export/Import Data</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export & Import Data</DialogTitle>
          <DialogDescription>
            Export your portfolio data or import previously saved data
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="export" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label>Export Type</Label>
                <Select value={exportType} onValueChange={setExportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portfolio">Portfolio Data</SelectItem>
                    <SelectItem value="watchlist">Watchlist</SelectItem>
                    <SelectItem value="tax">Tax Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      {exportType === "portfolio" && "Export your complete portfolio data, including all holdings, transactions, and performance metrics."}
                      {exportType === "watchlist" && "Export your watchlist coins for backup or to import into another platform."}
                      {exportType === "tax" && "Export transaction data formatted for tax reporting purposes."}
                    </p>
                    <p>
                      Format: <span className="font-medium text-foreground">{exportFormat.toUpperCase()}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                className="w-full" 
                onClick={handleExport} 
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export {exportType} Data
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4 pt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground space-y-4">
                  <p>
                    Import previously exported portfolio data or data from other platforms.
                    Supported file formats: JSON, CSV.
                  </p>
                  <p className="text-xs">
                    Note: Importing data will merge with your existing data. Duplicate entries will be updated.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary/10"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">JSON or CSV file</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".json,.csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {importedFile && (
              <div className="flex items-center justify-between p-2 border rounded bg-secondary/10">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[200px]">
                    {importedFile.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setImportedFile(null);
                    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                    if (fileInput) fileInput.value = "";
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Button
              className="w-full"
              disabled={!importedFile || isImporting}
              onClick={handleImport}
            >
              {isImporting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DataExportImport;
