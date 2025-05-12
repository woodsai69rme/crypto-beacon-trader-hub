
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  BarChart2, 
  Activity, 
  Users, 
  DollarSign, 
  ArrowUp, 
  ArrowDown,
  RefreshCw, 
  XCircle,
  AlertTriangle
} from "lucide-react";
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { OnChainMetrics } from '@/types/trading';

// Mock data
const ethereumOnChainData: OnChainMetrics[] = [
  {
    networkId: 'ethereum',
    name: 'Ethereum',
    activeAddresses: 562432,
    activeAddressesChange: 5.2,
    transactionCount: 1245378,
    transactionCountChange: 3.7,
    averageFee: 4.25,
    averageFeeChange: -2.1,
    newWallets: 34521,
    newWalletsChange: 7.5,
    timestamp: new Date().toISOString()
  }
];

const bitcoinOnChainData: OnChainMetrics[] = [
  {
    networkId: 'bitcoin',
    name: 'Bitcoin',
    activeAddresses: 982345,
    activeAddressesChange: 2.8,
    transactionCount: 325689,
    transactionCountChange: 1.5,
    averageFee: 2.85,
    averageFeeChange: 6.2,
    newWallets: 28752,
    newWalletsChange: 3.9,
    timestamp: new Date().toISOString()
  }
];

// Generate time series data for the charts
const generateTimeSeries = (days: number, metric: string, networkId: string, growthRate: number = 1.005) => {
  const data = [];
  let baseValue = networkId === 'ethereum' ? 
    (metric === 'activeAddresses' ? 500000 : metric === 'transactionCount' ? 1200000 : metric === 'averageFee' ? 4 : 30000) :
    (metric === 'activeAddresses' ? 950000 : metric === 'transactionCount' ? 300000 : metric === 'averageFee' ? 2.5 : 25000);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Add some randomness and trend
    const randomFactor = 0.95 + Math.random() * 0.1;
    baseValue = baseValue * growthRate * randomFactor;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: metric === 'averageFee' ? Number(baseValue.toFixed(2)) : Math.round(baseValue)
    });
  }
  
  return data;
};

const OnChainAnalyticsPage: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAddressesData, setActiveAddressesData] = useState<any[]>([]);
  const [transactionCountData, setTransactionCountData] = useState<any[]>([]);
  const [averageFeeData, setAverageFeeData] = useState<any[]>([]);
  const [newWalletsData, setNewWalletsData] = useState<any[]>([]);
  
  // Get the number of days for the selected time range
  const getDaysFromTimeRange = (range: string): number => {
    switch (range) {
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '1y': return 365;
      default: return 7;
    }
  };
  
  // Fetch on-chain data
  const fetchData = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const days = getDaysFromTimeRange(timeRange);
        
        // Generate time series data for each metric
        const activeAddresses = generateTimeSeries(days, 'activeAddresses', selectedNetwork, 1.002);
        const transactionCount = generateTimeSeries(days, 'transactionCount', selectedNetwork, 1.001);
        const averageFee = generateTimeSeries(days, 'averageFee', selectedNetwork, timeRange === '30d' || timeRange === '1y' ? 1.003 : 0.999);
        const newWallets = generateTimeSeries(days, 'newWallets', selectedNetwork, 1.004);
        
        // Format data for Nivo charts
        setActiveAddressesData([
          {
            id: 'activeAddresses',
            data: activeAddresses.map(item => ({ x: item.date, y: item.value }))
          }
        ]);
        
        setTransactionCountData([
          {
            id: 'transactionCount',
            data: transactionCount.map(item => ({ x: item.date, y: item.value }))
          }
        ]);
        
        setAverageFeeData([
          {
            id: 'averageFee',
            data: averageFee.map(item => ({ x: item.date, y: item.value }))
          }
        ]);
        
        setNewWalletsData([
          {
            id: 'newWallets',
            data: newWallets.map(item => ({ x: item.date, y: item.value }))
          }
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching on-chain data:", err);
        setError("Failed to load on-chain data. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };
  
  // Fetch data when network or time range changes
  useEffect(() => {
    fetchData();
  }, [selectedNetwork, timeRange]);
  
  // Get the current metrics based on selected network
  const currentMetrics = selectedNetwork === 'ethereum' ? ethereumOnChainData[0] : bitcoinOnChainData[0];
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            On-Chain Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time blockchain metrics and analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard
          title="Active Addresses"
          value={currentMetrics.activeAddresses.toLocaleString()}
          change={currentMetrics.activeAddressesChange}
          icon={<Users className="h-5 w-5" />}
          isLoading={isLoading}
        />
        
        <SummaryCard
          title="Transaction Count"
          value={currentMetrics.transactionCount.toLocaleString()}
          change={currentMetrics.transactionCountChange}
          icon={<Activity className="h-5 w-5" />}
          isLoading={isLoading}
        />
        
        <SummaryCard
          title="Average Fee"
          value={`$${currentMetrics.averageFee.toFixed(2)}`}
          change={currentMetrics.averageFeeChange}
          icon={<DollarSign className="h-5 w-5" />}
          isLoading={isLoading}
        />
        
        <SummaryCard
          title="New Wallets"
          value={currentMetrics.newWallets.toLocaleString()}
          change={currentMetrics.newWalletsChange}
          icon={<Users className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </div>
      
      {error && (
        <Card className="mb-6 border-red-500/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Charts */}
      <div className="space-y-6">
        <Tabs defaultValue="active-addresses">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="active-addresses">Active Addresses</TabsTrigger>
            <TabsTrigger value="transaction-count">Transaction Count</TabsTrigger>
            <TabsTrigger value="gas-fees">Gas Fees</TabsTrigger>
            <TabsTrigger value="wallet-growth">Wallet Growth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active-addresses">
            <ChartCard
              title="Active Addresses"
              description={`Daily active addresses on ${currentMetrics.name}`}
              data={activeAddressesData}
              isLoading={isLoading}
              yFormat=",.0f"
              color="#3b82f6"
            />
          </TabsContent>
          
          <TabsContent value="transaction-count">
            <ChartCard
              title="Transaction Count"
              description={`Daily transactions on ${currentMetrics.name}`}
              data={transactionCountData}
              isLoading={isLoading}
              yFormat=",.0f"
              color="#10b981"
            />
          </TabsContent>
          
          <TabsContent value="gas-fees">
            <ChartCard
              title="Average Gas Fees"
              description={`Average transaction fees on ${currentMetrics.name}`}
              data={averageFeeData}
              isLoading={isLoading}
              yFormat="$,.2f"
              color="#f59e0b"
            />
          </TabsContent>
          
          <TabsContent value="wallet-growth">
            <ChartCard
              title="New Wallets"
              description={`New wallet creation on ${currentMetrics.name}`}
              data={newWalletsData}
              isLoading={isLoading}
              yFormat=",.0f"
              color="#8b5cf6"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  isLoading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  icon,
  isLoading
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">{title}</span>
              <span className="text-2xl font-bold">{value}</span>
              <span className={`text-sm flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(change)}% from previous period
              </span>
            </div>
            <div className={`p-2 rounded-full h-fit ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ChartCardProps {
  title: string;
  description: string;
  data: any[];
  isLoading: boolean;
  yFormat: string;
  color: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  data,
  isLoading,
  yFormat,
  color
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date',
                legendOffset: 40,
                legendPosition: 'middle',
                tickValues: data[0]?.data.filter((_, i) => i % (data[0].data.length > 30 ? 10 : 3) === 0).map(d => d.x)
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Value',
                legendOffset: -60,
                legendPosition: 'middle',
                format: yFormat
              }}
              colors={[color]}
              lineWidth={3}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              enableArea={true}
              areaOpacity={0.15}
              useMesh={true}
              legends={[]}
              tooltip={({ point }) => (
                <div className="bg-card border p-2 rounded-md shadow-sm">
                  <div className="font-bold">{point.data.x}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: point.serieColor }}></div>
                    <div>{point.serieId}: {point.data.yFormatted}</div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnChainAnalyticsPage;
