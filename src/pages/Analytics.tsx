
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, BarChart2, PieChart, TrendingUp, Brain, Activity, Share2 } from "lucide-react";
import MarketCorrelations from '../components/MarketCorrelations/MarketCorrelations';
import PortfolioBenchmarking from '../components/PortfolioBenchmarking';
import { toast } from '@/components/ui/use-toast';

// Mock data for the portfolio benchmarking component
const mockPortfolioPerformance = [0, 1.2, 2.5, 4.2, 3.8, 5.6, 7.3, 8.2, 10.1, 9.6, 11.5, 13.2];
const mockPortfolioDates = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("market-analytics");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  
  const handleGenerateInsights = () => {
    setIsGeneratingInsights(true);
    
    // Simulate API call to generate insights
    setTimeout(() => {
      setIsGeneratingInsights(false);
      
      toast({
        title: "AI Insights Generated",
        description: "New market insights are now available based on current data.",
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive market analytics and portfolio insights
          </p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isGeneratingInsights}>
          <Brain className="mr-2 h-4 w-4" />
          {isGeneratingInsights ? "Generating..." : "Generate AI Insights"}
        </Button>
      </div>
      
      <Tabs defaultValue="market-analytics" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="market-analytics">Market Analytics</TabsTrigger>
          <TabsTrigger value="portfolio-analytics">Portfolio Analytics</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market-analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
                <CardDescription>Global market stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.62T</div>
                <p className="text-xs text-muted-foreground">Total Market Cap</p>
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+3.2%</span>
                  <span className="text-muted-foreground ml-1">vs yesterday</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
                <CardDescription>Market share percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47.8%</div>
                <p className="text-xs text-muted-foreground">Current Dominance</p>
                <div className="mt-2 flex items-center text-sm text-red-500">
                  <ArrowUpRight className="mr-1 h-4 w-4 rotate-180" />
                  <span>-0.5%</span>
                  <span className="text-muted-foreground ml-1">vs last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
                <CardDescription>Total trading volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$98.7B</div>
                <p className="text-xs text-muted-foreground">Global 24h Volume</p>
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+12.4%</span>
                  <span className="text-muted-foreground ml-1">vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-2 h-[400px]">
              <CardHeader>
                <CardTitle>Market Sector Performance</CardTitle>
                <CardDescription>Performance by crypto sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-md">
                  <BarChart2 className="h-24 w-24 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Volume Distribution</CardTitle>
                <CardDescription>Trading volume by exchange</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-md">
                  <PieChart className="h-24 w-24 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>Price Momentum</CardTitle>
                <CardDescription>Top gainers and losers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-md">
                  <Activity className="h-24 w-24 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio-analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <CardDescription>Current portfolio value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$48,762.45</div>
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+13.2%</span>
                  <span className="text-muted-foreground ml-1">all time</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
                <CardDescription>Performance this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+5.8%</div>
                <div className="mt-2 flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+2.3%</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Asset Distribution</CardTitle>
                <CardDescription>Portfolio allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">5 assets</div>
                <p className="text-xs text-muted-foreground">BTC, ETH, SOL, ADA, LINK</p>
                <div className="mt-2">
                  <Badge className="mr-1 bg-blue-500">52% BTC</Badge>
                  <Badge className="mr-1 bg-indigo-500">28% ETH</Badge>
                  <Badge className="bg-purple-500">20% Alt</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PortfolioBenchmarking 
            portfolioPerformance={mockPortfolioPerformance}
            portfolioDates={mockPortfolioDates}
          />
          
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle>Trade History Analysis</CardTitle>
              <CardDescription>Analysis of your trading performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-2xl font-bold">68%</div>
                  <div className="text-xs text-muted-foreground">Based on last 50 trades</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Average Profit</div>
                  <div className="text-2xl font-bold">+4.3%</div>
                  <div className="text-xs text-muted-foreground">Per winning trade</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Average Loss</div>
                  <div className="text-2xl font-bold">-1.8%</div>
                  <div className="text-xs text-muted-foreground">Per losing trade</div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center h-[200px] border-2 border-dashed rounded-md">
                <TrendingUp className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="correlations" className="space-y-6">
          <MarketCorrelations />
        </TabsContent>
        
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment Analysis</CardTitle>
                <Badge variant="outline" className="ml-2">AI Powered</Badge>
                <CardDescription>Generated at {new Date().toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Overall Market Sentiment</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">65% Bullish</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Market sentiment is cautiously bullish with increasing institutional interest
                    and positive regulatory developments in the US and EU regions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Key Sentiment Drivers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="bg-green-500/20 rounded-full p-1 mt-0.5">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      </div>
                      <span>Institutional adoption continues to increase with new ETF inflows</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="bg-green-500/20 rounded-full p-1 mt-0.5">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      </div>
                      <span>Technical indicators show strong support levels holding across major assets</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="bg-red-500/20 rounded-full p-1 mt-0.5">
                        <ArrowUpRight className="h-3 w-3 text-red-500 rotate-180" />
                      </div>
                      <span>Macroeconomic uncertainty with upcoming Fed interest rate decision</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Trading Recommendations</CardTitle>
                <Badge variant="outline" className="ml-2">AI Powered</Badge>
                <CardDescription>Based on current market conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/20 p-1.5 rounded-full">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">BTC/USD</div>
                        <div className="text-xs text-muted-foreground">4h timeframe</div>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Buy</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500/20 p-1.5 rounded-full">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-medium">ETH/USD</div>
                        <div className="text-xs text-muted-foreground">Daily timeframe</div>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Buy</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-500/20 p-1.5 rounded-full">
                        <TrendingUp className="h-4 w-4 text-orange-500 rotate-180" />
                      </div>
                      <div>
                        <div className="font-medium">SOL/USD</div>
                        <div className="text-xs text-muted-foreground">1h timeframe</div>
                      </div>
                    </div>
                    <Badge className="bg-red-500">Sell</Badge>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium mb-1">Trading Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    Current market conditions favor a barbell strategy with focus on blue-chip assets (BTC, ETH)
                    and selective exposure to high-conviction alt coins with strong fundamentals.
                    Consider reducing exposure to high-beta assets during current consolidation phase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Market Analysis</CardTitle>
              <CardDescription>Comprehensive market analysis powered by AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Market Regime</h3>
                <p className="text-sm text-muted-foreground">
                  Current market is in an <span className="font-medium">Accumulation Phase</span> with decreasing volatility 
                  and increasing on-chain accumulation by long-term holders. This typically precedes major market expansions based on historical cycles.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Key Opportunities</h3>
                  <ul className="space-y-2">
                    <li className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Layer 1 blockchains with increasing developer activity</span>
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>DeFi protocols with sustainable yield strategies</span>
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Real-world asset tokenization projects</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Key Risks</h3>
                  <ul className="space-y-2">
                    <li className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <span>Regulatory uncertainty in major markets</span>
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <span>Macroeconomic headwinds and interest rate concerns</span>
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <span>Liquidity risks in smaller cap altcoins</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <h3 className="font-medium mb-1">Technical Analysis Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">BTC Trend</div>
                    <div className="text-sm font-medium">Bullish</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">ETH Trend</div>
                    <div className="text-sm font-medium">Bullish</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Market Momentum</div>
                    <div className="text-sm font-medium">Increasing</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Vol. Profile</div>
                    <div className="text-sm font-medium">Accumulation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Generated reports and analysis documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <BarChart2 className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">Monthly Market Analysis</div>
                        <div className="text-xs text-muted-foreground">Generated on May 1, 2025</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <PieChart className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">Portfolio Performance Report</div>
                        <div className="text-xs text-muted-foreground">Generated on May 10, 2025</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <Brain className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-medium">AI Market Prediction</div>
                        <div className="text-xs text-muted-foreground">Generated on May 11, 2025</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Report</CardTitle>
                <CardDescription>
                  Generate a customized analysis report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="font-medium text-sm">Report Type</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <BarChart2 className="h-5 w-5 mb-2" />
                        <div className="font-medium text-sm">Market Analysis</div>
                        <div className="text-xs text-muted-foreground">Overall market conditions</div>
                      </div>
                      
                      <div className="border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <PieChart className="h-5 w-5 mb-2" />
                        <div className="font-medium text-sm">Portfolio Review</div>
                        <div className="text-xs text-muted-foreground">Your holdings analysis</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm mb-2">Time Period</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50">
                        <div className="text-sm">Last Week</div>
                      </div>
                      <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50 bg-muted/50">
                        <div className="text-sm">Last Month</div>
                      </div>
                      <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50">
                        <div className="text-sm">Last Quarter</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm mb-2">Report Format</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50 bg-muted/50">
                        <div className="text-sm">PDF</div>
                      </div>
                      <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50">
                        <div className="text-sm">CSV</div>
                      </div>
                      <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-muted/50">
                        <div className="text-sm">JSON</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>
                    <Share2 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Scheduling</CardTitle>
              <CardDescription>Set up automated report generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <Share2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Automated Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule reports to be automatically generated and sent to your email on a regular basis.
                </p>
                <Button>
                  Set Up Automated Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
