
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PieChart as PieChartIcon, 
  LineChart, 
  BarChart2, 
  RefreshCw, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  CircleDollarSign,
  Wallet
} from "lucide-react";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

// Mock data
const portfolioAssets = [
  { id: 'bitcoin', label: 'Bitcoin', value: 45, color: '#F7931A' },
  { id: 'ethereum', label: 'Ethereum', value: 25, color: '#627EEA' },
  { id: 'solana', label: 'Solana', value: 15, color: '#00FFA3' },
  { id: 'cardano', label: 'Cardano', value: 8, color: '#0033AD' },
  { id: 'ripple', label: 'XRP', value: 5, color: '#23292F' },
  { id: 'dogecoin', label: 'Dogecoin', value: 2, color: '#C2A633' },
];

const performanceData = [
  {
    id: 'portfolio',
    color: '#3b82f6',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 120 },
      { x: 'Mar', y: 115 },
      { x: 'Apr', y: 130 },
      { x: 'May', y: 145 },
      { x: 'Jun', y: 160 },
      { x: 'Jul', y: 175 },
    ]
  },
  {
    id: 'btc',
    color: '#F7931A',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 115 },
      { x: 'Mar', y: 125 },
      { x: 'Apr', y: 120 },
      { x: 'May', y: 140 },
      { x: 'Jun', y: 135 },
      { x: 'Jul', y: 155 },
    ]
  },
  {
    id: 'eth',
    color: '#627EEA',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 110 },
      { x: 'Mar', y: 105 },
      { x: 'Apr', y: 115 },
      { x: 'May', y: 125 },
      { x: 'Jun', y: 140 },
      { x: 'Jul', y: 150 },
    ]
  },
];

const holdingsData = [
  { asset: 'Bitcoin', symbol: 'BTC', amount: '0.45', value: 22500, price: 50000, change24h: 2.5, allocation: 45 },
  { asset: 'Ethereum', symbol: 'ETH', amount: '4.2', value: 12500, price: 2976.19, change24h: -1.2, allocation: 25 },
  { asset: 'Solana', symbol: 'SOL', amount: '85', value: 7500, price: 88.24, change24h: 4.7, allocation: 15 },
  { asset: 'Cardano', symbol: 'ADA', amount: '10500', value: 4000, price: 0.38, change24h: 1.5, allocation: 8 },
  { asset: 'XRP', symbol: 'XRP', amount: '7500', value: 2500, price: 0.33, change24h: -0.8, allocation: 5 },
  { asset: 'Dogecoin', symbol: 'DOGE', amount: '7142.86', value: 1000, price: 0.14, change24h: 3.2, allocation: 2 },
];

const cryptoROI = [
  { asset: 'Bitcoin', symbol: 'BTC', roi: 250, invested: 6428.57, currentValue: 22500, color: '#F7931A' },
  { asset: 'Ethereum', symbol: 'ETH', roi: 170, invested: 4629.63, currentValue: 12500, color: '#627EEA' },
  { asset: 'Solana', symbol: 'SOL', roi: 350, invested: 1666.67, currentValue: 7500, color: '#00FFA3' },
  { asset: 'Cardano', symbol: 'ADA', roi: 80, invested: 2222.22, currentValue: 4000, color: '#0033AD' },
  { asset: 'XRP', symbol: 'XRP', roi: -15, invested: 2941.18, currentValue: 2500, color: '#23292F' },
  { asset: 'Dogecoin', symbol: 'DOGE', roi: 425, invested: 190.48, currentValue: 1000, color: '#C2A633' },
];

const PortfolioAnalyticsPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>('7d');
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <PieChartIcon className="h-6 w-6" />
            Portfolio Analytics
          </h1>
          <p className="text-muted-foreground">
            Analyze your portfolio performance and holdings
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Total Value</span>
                <span className="text-2xl font-bold">$50,000</span>
              </div>
              <div className="bg-blue-500/10 text-blue-500 p-2 rounded-full h-fit">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">24h Change</span>
                <span className="text-2xl font-bold text-green-500 flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  +$1,250
                </span>
              </div>
              <div className="bg-green-500/10 text-green-500 p-2 rounded-full h-fit">
                <LineChart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Total ROI</span>
                <span className="text-2xl font-bold text-green-500 flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  178.3%
                </span>
              </div>
              <div className="bg-green-500/10 text-green-500 p-2 rounded-full h-fit">
                <BarChart2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Initial Investment</span>
                <span className="text-2xl font-bold">$18,078</span>
              </div>
              <div className="bg-blue-500/10 text-blue-500 p-2 rounded-full h-fit">
                <CircleDollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="holdings">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 mb-6">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="roi">ROI by Asset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="holdings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Asset Holdings</CardTitle>
                    <CardDescription>
                      Current holdings and allocation in your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-sm">Asset</th>
                            <th className="text-right py-3 px-4 font-medium text-sm">Amount</th>
                            <th className="text-right py-3 px-4 font-medium text-sm">Price</th>
                            <th className="text-right py-3 px-4 font-medium text-sm">Value</th>
                            <th className="text-right py-3 px-4 font-medium text-sm">24h</th>
                            <th className="text-right py-3 px-4 font-medium text-sm">Allocation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdingsData.map((asset, index) => (
                            <tr key={asset.symbol} className="border-b last:border-b-0">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                    {asset.symbol}
                                  </div>
                                  <div>
                                    <div className="font-medium">{asset.asset}</div>
                                    <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">{asset.amount}</td>
                              <td className="py-3 px-4 text-right">${asset.price.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">${asset.value.toLocaleString()}</td>
                              <td className={`py-3 px-4 text-right ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                <div className="flex items-center justify-end">
                                  {asset.change24h >= 0 ? 
                                    <ArrowUp className="h-3 w-3 mr-1" /> : 
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  }
                                  {Math.abs(asset.change24h)}%
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">{asset.allocation}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>
                      Distribution of your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsivePie
                        data={portfolioAssets}
                        margin={{ top: 10, right: 10, bottom: 80, left: 10 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        colors={{ datum: 'data.color' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="rgba(255, 255, 255, 0.75)"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor="rgba(255, 255, 255, 0.85)"
                        legends={[
                          {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 60,
                            itemsSpacing: 2,
                            itemWidth: 60,
                            itemHeight: 18,
                            itemTextColor: 'rgba(255, 255, 255, 0.85)',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 12,
                            symbolShape: 'circle'
                          }
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance vs Benchmarks</CardTitle>
                <CardDescription>
                  Comparison of your portfolio performance against BTC and ETH
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveLine
                    data={performanceData}
                    margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                      type: 'linear',
                      min: 'auto',
                      max: 'auto',
                    }}
                    yFormat=" >-.2f"
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Month',
                      legendOffset: 36,
                      legendPosition: 'middle'
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Normalized Value',
                      legendOffset: -40,
                      legendPosition: 'middle',
                      format: value => `${value}%`
                    }}
                    enableGridX={false}
                    colors={{ datum: 'color' }}
                    lineWidth={3}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                      {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 50,
                        itemsSpacing: 20,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)'
                      }
                    ]}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-blue-500/10">
                    <CardContent className="p-4">
                      <div className="text-sm text-blue-500">Your Portfolio</div>
                      <div className="text-xl font-bold">+75.0%</div>
                      <div className="text-xs text-muted-foreground">Since inception</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-500/10">
                    <CardContent className="p-4">
                      <div className="text-sm text-amber-500">BTC Performance</div>
                      <div className="text-xl font-bold">+55.0%</div>
                      <div className="text-xs text-muted-foreground">Since inception</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-indigo-500/10">
                    <CardContent className="p-4">
                      <div className="text-sm text-indigo-500">ETH Performance</div>
                      <div className="text-xl font-bold">+50.0%</div>
                      <div className="text-xs text-muted-foreground">Since inception</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roi" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>ROI by Asset</CardTitle>
                <CardDescription>
                  Return on investment for each asset in your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Asset</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Initial Investment</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Current Value</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">ROI</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoROI.map((asset) => (
                        <tr key={asset.symbol} className="border-b last:border-b-0">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                {asset.symbol}
                              </div>
                              <div>
                                <div className="font-medium">{asset.asset}</div>
                                <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">${asset.invested.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">${asset.currentValue.toLocaleString()}</td>
                          <td className={`py-3 px-4 text-right ${asset.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <div className="flex items-center justify-end">
                              {asset.roi >= 0 ? 
                                <ArrowUp className="h-3 w-3 mr-1" /> : 
                                <ArrowDown className="h-3 w-3 mr-1" />
                              }
                              {asset.roi}%
                            </div>
                          </td>
                          <td className={`py-3 px-4 text-right ${asset.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${(asset.currentValue - asset.invested).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-medium">
                          ${cryptoROI.reduce((sum, asset) => sum + asset.invested, 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          ${cryptoROI.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-500">
                          <div className="flex items-center justify-end">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            176.6%
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-500">
                          $31,922
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="h-[300px] mt-8">
                  {/* ROI Comparison Chart */}
                  <ResponsiveLine
                    data={[
                      {
                        id: 'roi',
                        color: 'blue',
                        data: cryptoROI.map(asset => ({
                          x: asset.symbol,
                          y: asset.roi
                        }))
                      }
                    ]}
                    margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                      type: 'linear',
                      min: 'auto',
                      max: 'auto'
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'ROI %',
                      legendOffset: -40,
                      legendPosition: 'middle'
                    }}
                    enableGridX={false}
                    colors={{ scheme: 'set1' }}
                    enablePoints={true}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    markers={[
                      {
                        axis: 'y',
                        value: 0,
                        lineStyle: { stroke: 'rgba(255, 255, 255, 0.5)', strokeWidth: 1, strokeDasharray: '4 4' },
                      }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortfolioAnalyticsPage;
