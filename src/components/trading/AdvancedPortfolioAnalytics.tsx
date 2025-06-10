
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, Target, Shield, AlertCircle, Download } from 'lucide-react';

const AdvancedPortfolioAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1Y');

  // Mock data
  const portfolioMetrics = {
    totalValue: 125000,
    totalReturn: 18.5,
    sharpeRatio: 1.42,
    maxDrawdown: 12.3,
    volatility: 15.8,
    beta: 1.15,
    alpha: 2.3,
    sortinoRatio: 1.89
  };

  const performanceData = [
    { date: 'Jan', portfolio: 100000, benchmark: 100000 },
    { date: 'Feb', portfolio: 105000, benchmark: 103000 },
    { date: 'Mar', portfolio: 98000, benchmark: 99000 },
    { date: 'Apr', portfolio: 110000, benchmark: 105000 },
    { date: 'May', portfolio: 115000, benchmark: 108000 },
    { date: 'Jun', portfolio: 125000, benchmark: 112000 }
  ];

  const allocationData = [
    { name: 'Bitcoin', value: 35, color: '#f7931a' },
    { name: 'Ethereum', value: 25, color: '#627eea' },
    { name: 'Solana', value: 15, color: '#9945ff' },
    { name: 'Cardano', value: 10, color: '#0033ad' },
    { name: 'Others', value: 15, color: '#8b5cf6' }
  ];

  const riskMetrics = [
    { metric: 'Value at Risk (95%)', value: '8.5%', status: 'medium' },
    { metric: 'Expected Shortfall', value: '12.3%', status: 'high' },
    { metric: 'Correlation to BTC', value: '0.78', status: 'high' },
    { metric: 'Portfolio Beta', value: '1.15', status: 'medium' },
    { metric: 'Tracking Error', value: '4.2%', status: 'low' }
  ];

  const monthlyReturns = [
    { month: 'Jan', return: 5.2 },
    { month: 'Feb', return: -2.1 },
    { month: 'Mar', return: 8.7 },
    { month: 'Apr', return: 3.4 },
    { month: 'May', return: 6.1 },
    { month: 'Jun', return: 4.8 }
  ];

  const riskReturnData = [
    { risk: 10, return: 12, name: 'Conservative' },
    { risk: 15, return: 18.5, name: 'Your Portfolio' },
    { risk: 20, return: 22, name: 'Aggressive' },
    { risk: 8, return: 8, name: 'Benchmark' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
          <p className="text-muted-foreground">Advanced performance and risk analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>Generate Insights</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${portfolioMetrics.totalValue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-green-500">
                  +{portfolioMetrics.totalReturn}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{portfolioMetrics.sharpeRatio}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-500">
                  -{portfolioMetrics.maxDrawdown}%
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio vs Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={2} name="Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Return']} />
                    <Bar dataKey="return" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk-Return Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskReturnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" name="Risk %" />
                  <YAxis dataKey="return" name="Return %" />
                  <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                  <Scatter dataKey="return" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocationData.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="font-medium">{asset.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={asset.value} className="w-20" />
                        <span className="font-bold">{asset.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{metric.metric}</div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                    </div>
                    <Badge variant={
                      metric.status === 'low' ? 'default' :
                      metric.status === 'medium' ? 'secondary' : 'destructive'
                    }>
                      {metric.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">High Correlation Warning</div>
                    <div className="text-sm text-muted-foreground">
                      Portfolio shows high correlation (0.78) to Bitcoin movements
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Rebalancing Suggestion</div>
                    <div className="text-sm text-muted-foreground">
                      Consider reducing Bitcoin allocation to improve diversification
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Correlation Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced correlation matrix and heat map visualization
                </p>
                <Button>Generate Correlation Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedPortfolioAnalytics;
