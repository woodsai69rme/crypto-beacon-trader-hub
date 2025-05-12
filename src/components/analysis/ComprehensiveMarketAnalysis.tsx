
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart2, 
  LineChart, 
  BarChart,
  TrendingUp, 
  TrendingDown,
  RefreshCw 
} from "lucide-react";

const ComprehensiveMarketAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Market Analysis</h2>
          <p className="text-muted-foreground">Comprehensive market data and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">Export Report</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="technical">
            <LineChart className="h-4 w-4 mr-2" />
            Technical
          </TabsTrigger>
          <TabsTrigger value="sentiment">
            <TrendingUp className="h-4 w-4 mr-2" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="correlation">
            <BarChart className="h-4 w-4 mr-2" />
            Correlation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Market Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">74/100</p>
                    <p className="text-sm text-muted-foreground">Bullish</p>
                  </div>
                  <Badge className="bg-green-500">Healthy</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Exchange Volume</span>
                    <Badge variant="outline" className="font-mono">$48.7B</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Dominance (BTC)</span>
                    <Badge variant="outline" className="font-mono">52.4%</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Market Cap Change</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+2.8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ethereum", symbol: "ETH", change: "+12.7%" },
                    { name: "Solana", symbol: "SOL", change: "+9.3%" },
                    { name: "Cardano", symbol: "ADA", change: "+8.1%" }
                  ].map((coin) => (
                    <div className="flex justify-between items-center" key={coin.symbol}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                        <div>
                          <p className="font-medium">{coin.name}</p>
                          <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                        </div>
                      </div>
                      <span className="text-green-500">{coin.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Underperformers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Dogecoin", symbol: "DOGE", change: "-5.3%" },
                    { name: "Chainlink", symbol: "LINK", change: "-3.7%" },
                    { name: "Polygon", symbol: "MATIC", change: "-2.9%" }
                  ].map((coin) => (
                    <div className="flex justify-between items-center" key={coin.symbol}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                        <div>
                          <p className="font-medium">{coin.name}</p>
                          <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                        </div>
                      </div>
                      <span className="text-red-500">{coin.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Market overview chart goes here</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Sectors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "DeFi", change: "+8.3%", marketCap: "$45.2B" },
                    { name: "NFT/Gaming", change: "+3.7%", marketCap: "$21.5B" },
                    { name: "Layer 1", change: "+10.2%", marketCap: "$586.7B" },
                    { name: "Layer 2", change: "+5.4%", marketCap: "$32.9B" }
                  ].map((sector) => (
                    <div className="flex justify-between items-center" key={sector.name}>
                      <div>
                        <p className="font-medium">{sector.name}</p>
                        <p className="text-xs text-muted-foreground">Market Cap: {sector.marketCap}</p>
                      </div>
                      <span className="text-green-500">{sector.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 rounded-md">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Bullish Trend</h4>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm mt-1">The market is showing strong support at current levels with increasing volume.</p>
                  </div>
                  
                  <div className="p-3 bg-blue-500/10 rounded-md">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Volume Analysis</h4>
                      <BarChart2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm mt-1">Trading volume has increased by 24% in the past 24 hours.</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-500/10 rounded-md">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Key Resistance</h4>
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm mt-1">Bitcoin faces resistance at $42,500. Breaking through could trigger a new rally.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Technical analysis indicators will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Sentiment analysis data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Asset correlation matrix will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveMarketAnalysis;
