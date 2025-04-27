
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Calendar, RefreshCw, ArrowRight, Clock, Info, HelpCircle } from "lucide-react";

type CorrelationPeriod = "24h" | "7d" | "30d" | "90d" | "1y";
type CorrelationStrength = "strong-positive" | "moderate-positive" | "weak-positive" | "no-correlation" | "weak-negative" | "moderate-negative" | "strong-negative";

interface AssetCorrelation {
  baseAsset: string;
  quoteAsset: string;
  correlation: number;
  strength: CorrelationStrength;
  period: CorrelationPeriod;
  changeFrom7d: number;
  changeFrom30d: number;
  lastUpdated: string;
}

interface CorrelationMatrix {
  assets: string[];
  matrix: number[][];
  lastUpdated: string;
}

// Mock correlation data
const correlationData: AssetCorrelation[] = [
  {
    baseAsset: "BTC",
    quoteAsset: "ETH",
    correlation: 0.84,
    strength: "strong-positive",
    period: "30d",
    changeFrom7d: 0.02,
    changeFrom30d: -0.05,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "BTC",
    quoteAsset: "SOL",
    correlation: 0.76,
    strength: "strong-positive",
    period: "30d",
    changeFrom7d: 0.04,
    changeFrom30d: 0.08,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "BTC",
    quoteAsset: "XRP",
    correlation: 0.52,
    strength: "moderate-positive",
    period: "30d",
    changeFrom7d: -0.03,
    changeFrom30d: -0.11,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "ETH",
    quoteAsset: "SOL",
    correlation: 0.79,
    strength: "strong-positive",
    period: "30d",
    changeFrom7d: 0.01,
    changeFrom30d: 0.06,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "ETH",
    quoteAsset: "ADA",
    correlation: 0.68,
    strength: "moderate-positive",
    period: "30d",
    changeFrom7d: 0.05,
    changeFrom30d: 0.02,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "SOL",
    quoteAsset: "AVAX",
    correlation: 0.81,
    strength: "strong-positive",
    period: "30d",
    changeFrom7d: 0.03,
    changeFrom30d: 0.09,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "XRP",
    quoteAsset: "XLM",
    correlation: 0.88,
    strength: "strong-positive",
    period: "30d",
    changeFrom7d: -0.01,
    changeFrom30d: -0.02,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "BTC",
    quoteAsset: "GOLD",
    correlation: 0.17,
    strength: "weak-positive",
    period: "30d",
    changeFrom7d: 0.06,
    changeFrom30d: 0.18,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "BTC",
    quoteAsset: "SPX",
    correlation: 0.42,
    strength: "moderate-positive",
    period: "30d",
    changeFrom7d: 0.08,
    changeFrom30d: 0.14,
    lastUpdated: "2025-04-27T08:30:00Z"
  },
  {
    baseAsset: "ETH",
    quoteAsset: "DXY",
    correlation: -0.58,
    strength: "moderate-negative",
    period: "30d",
    changeFrom7d: -0.03,
    changeFrom30d: -0.07,
    lastUpdated: "2025-04-27T08:30:00Z"
  }
];

// Mock matrix data
const mockMatrixData: CorrelationMatrix = {
  assets: ["BTC", "ETH", "SOL", "ADA", "XRP", "AVAX", "DOT"],
  matrix: [
    [1.00, 0.84, 0.76, 0.65, 0.52, 0.71, 0.68],
    [0.84, 1.00, 0.79, 0.68, 0.57, 0.75, 0.72],
    [0.76, 0.79, 1.00, 0.72, 0.61, 0.81, 0.70],
    [0.65, 0.68, 0.72, 1.00, 0.59, 0.64, 0.75],
    [0.52, 0.57, 0.61, 0.59, 1.00, 0.58, 0.56],
    [0.71, 0.75, 0.81, 0.64, 0.58, 1.00, 0.67],
    [0.68, 0.72, 0.70, 0.75, 0.56, 0.67, 1.00]
  ],
  lastUpdated: "2025-04-27T08:30:00Z"
};

const getCorrelationColor = (correlation: number): string => {
  if (correlation >= 0.8) return "bg-green-600";
  if (correlation >= 0.6) return "bg-green-500";
  if (correlation >= 0.4) return "bg-green-400";
  if (correlation >= 0.2) return "bg-green-300";
  if (correlation >= -0.2) return "bg-gray-300";
  if (correlation >= -0.4) return "bg-red-300";
  if (correlation >= -0.6) return "bg-red-400";
  if (correlation >= -0.8) return "bg-red-500";
  return "bg-red-600";
};

const getCorrelationStrengthBadge = (strength: CorrelationStrength): { label: string; className: string } => {
  switch (strength) {
    case "strong-positive":
      return { label: "Strong Positive", className: "bg-green-50 text-green-700 border-green-200" };
    case "moderate-positive":
      return { label: "Moderate Positive", className: "bg-green-50/70 text-green-700 border-green-200" };
    case "weak-positive":
      return { label: "Weak Positive", className: "bg-green-50/40 text-green-600 border-green-100" };
    case "no-correlation":
      return { label: "No Correlation", className: "bg-gray-50 text-gray-700 border-gray-200" };
    case "weak-negative":
      return { label: "Weak Negative", className: "bg-red-50/40 text-red-600 border-red-100" };
    case "moderate-negative":
      return { label: "Moderate Negative", className: "bg-red-50/70 text-red-700 border-red-200" };
    case "strong-negative":
      return { label: "Strong Negative", className: "bg-red-50 text-red-700 border-red-200" };
  }
};

const CorrelationAnalysisToolkit: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<CorrelationPeriod>("30d");
  const [selectedBaseAsset, setSelectedBaseAsset] = useState<string>("BTC");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Correlation Analysis Tools
        </CardTitle>
        <CardDescription>
          Analyze relationships between assets to enhance portfolio diversification
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="pairs" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pairs">Correlation Pairs</TabsTrigger>
            <TabsTrigger value="heatmap">Correlation Matrix</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pairs" className="space-y-5">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Base Asset</label>
                <Select value={selectedBaseAsset} onValueChange={setSelectedBaseAsset}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Base asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as CorrelationPeriod)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Asset Pair</th>
                    <th className="text-center p-3 text-sm font-medium">Correlation</th>
                    <th className="text-left p-3 text-sm font-medium">Strength</th>
                    <th className="text-center p-3 text-sm font-medium">30d Change</th>
                    <th className="text-center p-3 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {correlationData
                    .filter(item => item.baseAsset === selectedBaseAsset && item.period === selectedPeriod)
                    .map(item => {
                      const strengthBadge = getCorrelationStrengthBadge(item.strength);
                      return (
                        <tr key={`${item.baseAsset}-${item.quoteAsset}`} className="border-b">
                          <td className="p-3">
                            <div className="font-medium">{item.baseAsset}/{item.quoteAsset}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center items-center">
                              <div className="w-12 h-4 rounded-full overflow-hidden bg-gray-200 flex">
                                <div
                                  className={`h-full ${getCorrelationColor(item.correlation)}`}
                                  style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 font-mono text-sm">
                                {item.correlation >= 0 ? '+' : ''}
                                {item.correlation.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className={strengthBadge.className}>
                              {strengthBadge.label}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <span className={item.changeFrom30d >= 0 ? "text-green-600" : "text-red-600"}>
                              {item.changeFrom30d >= 0 ? '+' : ''}
                              {item.changeFrom30d.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <Button variant="outline" size="sm">
                              <ArrowRight className="h-4 w-4" />
                              <span className="hidden sm:inline ml-1">Details</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  {correlationData.filter(item => item.baseAsset === selectedBaseAsset && item.period === selectedPeriod).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No correlation data available for the selected asset and time period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="heatmap">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Time Period</label>
                  <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as CorrelationPeriod)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                      <SelectItem value="30d">30 Days</SelectItem>
                      <SelectItem value="90d">90 Days</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Matrix
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="p-3 text-sm font-medium text-left"></th>
                      {mockMatrixData.assets.map((asset) => (
                        <th key={asset} className="p-3 text-sm font-medium text-center">
                          {asset}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockMatrixData.assets.map((rowAsset, rowIndex) => (
                      <tr key={rowAsset} className="border-t">
                        <td className="p-3 text-sm font-medium text-left">{rowAsset}</td>
                        {mockMatrixData.matrix[rowIndex].map((correlation, colIndex) => (
                          <td key={`${rowAsset}-${mockMatrixData.assets[colIndex]}`} className="p-2 text-center">
                            <div 
                              className={`w-8 h-8 mx-auto rounded-sm flex items-center justify-center text-xs text-white ${getCorrelationColor(correlation)}`}
                              title={`${rowAsset} to ${mockMatrixData.assets[colIndex]}: ${correlation.toFixed(2)}`}
                            >
                              {correlation.toFixed(2)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex space-x-2 items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Last updated: {new Date(mockMatrixData.lastUpdated).toLocaleString()}</span>
                <span className="flex-1"></span>
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Hover cells to see exact correlation values</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio">
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="rounded-full bg-muted p-3">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Portfolio Correlation Analysis</h3>
              <p className="text-muted-foreground max-w-md">
                Analyze your portfolio's assets to identify correlation patterns and improve diversification.
                Import your portfolio or select specific assets to analyze.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">Import Portfolio</Button>
                <Button>Select Assets</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysisToolkit;
