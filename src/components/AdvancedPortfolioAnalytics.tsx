
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUp, ArrowDown, AlertTriangle, ChevronRight, Filter, Download } from 'lucide-react';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';

// Demo data
const PORTFOLIO_ALLOCATION = [
  { name: 'Bitcoin', value: 45, color: '#F7931A' },
  { name: 'Ethereum', value: 30, color: '#627EEA' },
  { name: 'Solana', value: 15, color: '#00FFA3' },
  { name: 'Cardano', value: 7, color: '#0033AD' },
  { name: 'XRP', value: 3, color: '#23292F' }
];

const PERFORMANCE_DATA = [
  { month: 'Jan', value: 10000, gain: 0 },
  { month: 'Feb', value: 11200, gain: 12 },
  { month: 'Mar', value: 10800, gain: -3.57 },
  { month: 'Apr', value: 12400, gain: 14.81 },
  { month: 'May', value: 13600, gain: 9.68 },
  { month: 'Jun', value: 14200, gain: 4.41 },
  { month: 'Jul', value: 15800, gain: 11.27 },
  { month: 'Aug', value: 14900, gain: -5.7 },
  { month: 'Sep', value: 16500, gain: 10.74 },
  { month: 'Oct', value: 18200, gain: 10.3 }
];

const RISK_METRICS = {
  sharpeRatio: 1.85,
  volatility: 22.4,
  maxDrawdown: 15.7,
  beta: 1.2,
  alpha: 5.8,
  correlationSP: 0.65
};

const COIN_PERFORMANCE = [
  { name: 'Bitcoin', return: 32.5, allocation: 45, risk: 'high', riskScore: 8 },
  { name: 'Ethereum', return: 18.4, allocation: 30, risk: 'high', riskScore: 7 },
  { name: 'Solana', return: 45.7, allocation: 15, risk: 'very high', riskScore: 9 },
  { name: 'Cardano', return: -8.3, allocation: 7, risk: 'medium', riskScore: 6 },
  { name: 'XRP', return: 5.2, allocation: 3, risk: 'medium', riskScore: 5 }
];

const RISK_ANALYSIS = [
  { asset: 'Bitcoin', volatility: 65, drawdown: 35, sharpe: 1.2 },
  { asset: 'Ethereum', volatility: 75, drawdown: 42, sharpe: 1.1 },
  { asset: 'Solana', volatility: 85, drawdown: 55, sharpe: 0.9 },
  { asset: 'Cardano', volatility: 60, drawdown: 48, sharpe: 0.7 },
  { asset: 'XRP', volatility: 55, drawdown: 30, sharpe: 0.8 },
  { asset: 'Portfolio', volatility: 62, drawdown: 28, sharpe: 1.8 }
];

const AdvancedPortfolioAnalytics = () => {
  const [timeframe, setTimeframe] = useState<string>('1y');
  const [analysisType, setAnalysisType] = useState<string>('overview');
  const { formatValue } = useCurrencyConverter();

  // Calculate total portfolio value
  const totalValue = PERFORMANCE_DATA[PERFORMANCE_DATA.length - 1].value;
  const totalGain = ((totalValue / PERFORMANCE_DATA[0].value) - 1) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <CardTitle>Advanced Portfolio Analytics</CardTitle>
          <CardDescription>Comprehensive analysis of your crypto portfolio</CardDescription>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Performance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Portfolio Value</div>
            <div className="text-2xl font-bold mt-1">{formatValue(totalValue)}</div>
          </div>
          
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Overall Return</div>
            <div className={`flex items-center text-xl font-bold mt-1 ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGain >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {totalGain.toFixed(2)}%
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Risk Level</div>
            <div className="flex items-center text-xl font-bold mt-1">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Moderate
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            <div className="flex items-center text-xl font-bold mt-1">
              {RISK_METRICS.sharpeRatio}
              <span className="text-xs ml-1 text-muted-foreground">1Y</span>
            </div>
          </div>
        </div>
        
        <Tabs value={analysisType} onValueChange={setAnalysisType} className="mt-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Chart */}
              <div className="lg:col-span-2 border rounded-md p-4">
                <h3 className="font-medium mb-4">Portfolio Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatValue(Number(value))} />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Allocation Pie Chart */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Current Allocation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PORTFOLIO_ALLOCATION}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {PORTFOLIO_ALLOCATION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Asset Performance Table */}
            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-medium mb-4">Asset Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Asset</th>
                      <th className="text-right py-2 px-4">Allocation</th>
                      <th className="text-right py-2 px-4">Return</th>
                      <th className="text-right py-2 px-4">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COIN_PERFORMANCE.map((coin, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">{coin.name}</td>
                        <td className="text-right py-2 px-4">{coin.allocation}%</td>
                        <td className={`text-right py-2 px-4 ${coin.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.return >= 0 ? '+' : ''}{coin.return}%
                        </td>
                        <td className="text-right py-2 px-4">
                          <div className="flex items-center justify-end">
                            <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  coin.riskScore >= 8 ? 'bg-red-500' : 
                                  coin.riskScore >= 6 ? 'bg-amber-500' : 
                                  'bg-green-500'
                                }`} 
                                style={{width: `${coin.riskScore * 12.5}%`}}
                              />
                            </div>
                            <span className="ml-2 text-xs">{coin.risk}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allocation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Allocation Pie Chart */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Current Allocation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PORTFOLIO_ALLOCATION}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={120}
                        dataKey="value"
                        label
                      >
                        {PORTFOLIO_ALLOCATION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Allocation Table */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Allocation Details</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Asset</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PORTFOLIO_ALLOCATION.map((asset, index) => {
                      const coin = COIN_PERFORMANCE.find(c => c.name === asset.name);
                      const assetValue = (totalValue * asset.value) / 100;
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 flex items-center">
                            <div className="h-3 w-3 rounded-full mr-2" style={{backgroundColor: asset.color}} />
                            {asset.name}
                          </td>
                          <td className="text-right py-3">
                            {asset.name === 'Bitcoin' ? '0.125 BTC' : 
                             asset.name === 'Ethereum' ? '2.5 ETH' : 
                             asset.name === 'Solana' ? '25 SOL' : 
                             asset.name === 'Cardano' ? '5000 ADA' : '500 XRP'}
                          </td>
                          <td className="text-right py-3">{formatValue(assetValue)}</td>
                          <td className="text-right py-3">{asset.value}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="font-medium">
                    <tr className="border-t">
                      <td className="py-3">Total</td>
                      <td className="text-right py-3"></td>
                      <td className="text-right py-3">{formatValue(totalValue)}</td>
                      <td className="text-right py-3">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Portfolio Growth</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatValue(Number(value))} />
                      <Line type="monotone" dataKey="value" name="Portfolio Value" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Monthly Returns */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Monthly Returns</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PERFORMANCE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="gain" name="Monthly Return" fill="#10b981">
                        {PERFORMANCE_DATA.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.gain >= 0 ? '#10b981' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="grid grid-cols-1 gap-6">
              {/* Risk Metrics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Volatility (Annualized)</div>
                  <div className="text-2xl font-medium mt-1">{RISK_METRICS.volatility}%</div>
                  <div className="mt-2 text-xs text-muted-foreground">Measure of price fluctuation</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Maximum Drawdown</div>
                  <div className="text-2xl font-medium mt-1">{RISK_METRICS.maxDrawdown}%</div>
                  <div className="mt-2 text-xs text-muted-foreground">Largest price drop from peak</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Beta (vs. BTC)</div>
                  <div className="text-2xl font-medium mt-1">{RISK_METRICS.beta}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Market sensitivity measure</div>
                </div>
              </div>
              
              {/* Risk Analysis Chart */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Risk Metrics Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={RISK_ANALYSIS}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="asset" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="volatility" name="Volatility (%)" fill="#ef4444" />
                      <Bar dataKey="drawdown" name="Max Drawdown (%)" fill="#eab308" />
                      <Bar dataKey="sharpe" name="Sharpe Ratio" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Risk Assessment */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Risk Assessment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional evaluation of your portfolio's risk profile
                </p>
                
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <h4 className="font-medium">Diversification</h4>
                    </div>
                    <p className="text-sm mt-1 ml-6">
                      Your portfolio has moderate diversification with 5 assets, but is still heavily weighted towards Bitcoin and Ethereum (75%).
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <h4 className="font-medium">Volatility</h4>
                    </div>
                    <p className="text-sm mt-1 ml-6">
                      Portfolio volatility is high at {RISK_METRICS.volatility}%, but lower than holding Bitcoin alone ({RISK_ANALYSIS[0].volatility}%).
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <h4 className="font-medium">Risk-Adjusted Return</h4>
                    </div>
                    <p className="text-sm mt-1 ml-6">
                      Your portfolio's Sharpe Ratio of {RISK_METRICS.sharpeRatio} indicates good returns relative to risk taken. This is above average for crypto portfolios.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-primary mr-2" />
                      <h4 className="font-medium">Recommendations</h4>
                    </div>
                    <p className="text-sm mt-1 ml-6">
                      Consider adding 1-2 more uncorrelated assets to reduce volatility further. Stablecoin allocation of 5-10% could help manage drawdown risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedPortfolioAnalytics;
