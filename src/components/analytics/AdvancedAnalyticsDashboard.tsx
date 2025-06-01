
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Target, AlertTriangle, RefreshCw } from 'lucide-react';
import { advancedOpenRouterService } from '@/services/ai/advancedOpenRouterService';

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  format: 'currency' | 'percentage' | 'number';
}

interface RiskMetric {
  label: string;
  value: number;
  threshold: number;
  status: 'safe' | 'warning' | 'danger';
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PerformanceMetric[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [marketInsights, setMarketInsights] = useState<any>(null);

  // Mock data generation
  useEffect(() => {
    generateMockData();
  }, [timeframe]);

  const generateMockData = () => {
    setIsLoading(true);
    
    // Performance chart data
    const days = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const performanceData = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      portfolio: 100000 + Math.random() * 20000 - 10000,
      benchmark: 100000 + Math.random() * 15000 - 7500,
      volume: Math.random() * 1000000
    }));
    setPerformanceData(performanceData);

    // Portfolio metrics
    const metrics: PerformanceMetric[] = [
      {
        label: 'Total Return',
        value: 15.34,
        change: 2.1,
        trend: 'up',
        format: 'percentage'
      },
      {
        label: 'Sharpe Ratio',
        value: 1.45,
        change: 0.12,
        trend: 'up',
        format: 'number'
      },
      {
        label: 'Max Drawdown',
        value: -8.7,
        change: 1.2,
        trend: 'down',
        format: 'percentage'
      },
      {
        label: 'Win Rate',
        value: 68.5,
        change: -2.3,
        trend: 'down',
        format: 'percentage'
      }
    ];
    setPortfolioMetrics(metrics);

    // Risk metrics
    const risks: RiskMetric[] = [
      { label: 'Portfolio Beta', value: 1.15, threshold: 1.5, status: 'safe' },
      { label: 'VaR (95%)', value: 4.2, threshold: 10, status: 'safe' },
      { label: 'Volatility', value: 18.5, threshold: 25, status: 'warning' },
      { label: 'Concentration Risk', value: 35, threshold: 40, status: 'warning' }
    ];
    setRiskMetrics(risks);

    // Correlation matrix data
    const assets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
    const correlations = assets.map(asset1 => ({
      asset: asset1,
      ...assets.reduce((acc, asset2) => ({
        ...acc,
        [asset2]: asset1 === asset2 ? 1 : Math.random() * 2 - 1
      }), {})
    }));
    setCorrelationData(correlations);

    setTimeout(() => setIsLoading(false), 1000);
  };

  const generateAIInsights = async () => {
    setIsLoading(true);
    try {
      const insights = await advancedOpenRouterService.generateMarketResearch('Current portfolio performance analysis');
      setMarketInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value.toFixed(2);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive portfolio and market analysis</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
            <TabsList>
              <TabsTrigger value="24h">24H</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={generateAIInsights} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{formatValue(metric.value, metric.format)}</p>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-center mt-2">
                <span className={`text-sm ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
                </span>
                <span className="text-sm text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance vs Benchmark</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="portfolio" stroke="#8884d8" strokeWidth={2} name="Portfolio" />
                  <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" strokeWidth={2} name="Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((risk) => (
                    <div key={risk.label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{risk.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Threshold: {risk.threshold}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getRiskColor(risk.status)}`}>
                          {risk.value.toFixed(2)}
                        </p>
                        <Badge variant={risk.status === 'safe' ? 'default' : risk.status === 'warning' ? 'secondary' : 'destructive'}>
                          {risk.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskMetrics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ label, value }) => `${label}: ${value.toFixed(1)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskMetrics.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Asset</th>
                      {correlationData[0] && Object.keys(correlationData[0]).filter(key => key !== 'asset').map(asset => (
                        <th key={asset} className="text-center p-2">{asset}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {correlationData.map((row) => (
                      <tr key={row.asset}>
                        <td className="font-medium p-2">{row.asset}</td>
                        {Object.entries(row).filter(([key]) => key !== 'asset').map(([key, value]) => (
                          <td key={key} className="text-center p-2">
                            <div 
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                Math.abs(Number(value)) > 0.7 ? 'bg-red-100 text-red-800' :
                                Math.abs(Number(value)) > 0.3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {Number(value).toFixed(2)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {marketInsights ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Market Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Summary</h4>
                      <p className="text-sm text-muted-foreground">{marketInsights.summary}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Key Points</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {marketInsights.keyPoints.map((point: string, index: number) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Risks
                      </h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {marketInsights.risks.map((risk: string, index: number) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-500" />
                        Opportunities
                      </h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {marketInsights.opportunities.map((opportunity: string, index: number) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">Click "AI Insights" to generate comprehensive market analysis</p>
                <Button onClick={generateAIInsights} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate AI Insights'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
