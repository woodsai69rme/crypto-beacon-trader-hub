
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EnhancedPortfolioBenchmarkingProps } from '@/types/trading';

const EnhancedPortfolioBenchmarking: React.FC<EnhancedPortfolioBenchmarkingProps> = ({
  portfolioId,
  timeframe = '1M',
  comparisonAssets = ['BTC', 'ETH', 'S&P500'],
  showDetailedView = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Benchmarking</h2>
        <Button variant="outline" size="sm">Export Data</Button>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Asset Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 border border-dashed rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Performance chart will be displayed here</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Your Portfolio</span>
                  </div>
                  <span className="font-medium text-green-500">+12.4%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Bitcoin</span>
                  </div>
                  <span className="font-medium text-green-500">+8.7%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Ethereum</span>
                  </div>
                  <span className="font-medium text-green-500">+15.2%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span>S&P 500</span>
                  </div>
                  <span className="font-medium text-green-500">+2.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                  <div className="text-2xl font-bold">1.8</div>
                  <div className="text-xs text-muted-foreground">Higher is better</div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Volatility</div>
                  <div className="text-2xl font-bold">12.4%</div>
                  <div className="text-xs text-muted-foreground">30-day rolling</div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  <div className="text-2xl font-bold">-18.7%</div>
                  <div className="text-xs text-muted-foreground">Past 12 months</div>
                </div>
              </div>
              
              {showDetailedView && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-4">Detailed Risk Analysis</h3>
                  <div className="h-60 border border-dashed rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Detailed risk charts will be displayed here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Asset</th>
                    <th className="text-right py-2 px-2 font-medium">Return</th>
                    <th className="text-right py-2 px-2 font-medium">Risk</th>
                    <th className="text-right py-2 px-2 font-medium">Sharpe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2">Your Portfolio</td>
                    <td className="py-2 px-2 text-right text-green-500">+12.4%</td>
                    <td className="py-2 px-2 text-right">12.4%</td>
                    <td className="py-2 px-2 text-right">1.8</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">Bitcoin</td>
                    <td className="py-2 px-2 text-right text-green-500">+8.7%</td>
                    <td className="py-2 px-2 text-right">15.2%</td>
                    <td className="py-2 px-2 text-right">1.1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">Ethereum</td>
                    <td className="py-2 px-2 text-right text-green-500">+15.2%</td>
                    <td className="py-2 px-2 text-right">18.7%</td>
                    <td className="py-2 px-2 text-right">1.4</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">S&P 500</td>
                    <td className="py-2 px-2 text-right text-green-500">+2.3%</td>
                    <td className="py-2 px-2 text-right">4.2%</td>
                    <td className="py-2 px-2 text-right">0.9</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPortfolioBenchmarking;
