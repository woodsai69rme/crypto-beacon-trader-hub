
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Info } from "lucide-react";

interface CryptoCorrelationData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  returns: number[];
}

interface CorrelationPair {
  asset1: string;
  asset2: string;
  correlation: number;
  color: string;
  scatterData: { x: number; y: number }[];
}

const AVAILABLE_ASSETS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "xrp", symbol: "XRP", name: "XRP" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "binancecoin", symbol: "BNB", name: "Binance Coin" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "avalanche", symbol: "AVAX", name: "Avalanche" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin" }
];

const CORRELATION_COLORS = {
  STRONG_POSITIVE: "#22c55e", // Green
  MODERATE_POSITIVE: "#84cc16", // Lime
  WEAK_POSITIVE: "#d9f99d", // Light green
  NEUTRAL: "#e5e5e5", // Gray
  WEAK_NEGATIVE: "#fecdd3", // Light red
  MODERATE_NEGATIVE: "#f87171", // Red
  STRONG_NEGATIVE: "#dc2626" // Dark red
};

// Generate mock price data with realistic correlations
const generateMockPriceData = (): CryptoCorrelationData[] => {
  // Base random walks for correlated assets
  const btcReturns = Array(30).fill(0).map(() => Math.random() * 0.06 - 0.03); // -3% to 3%
  const ethReturns = btcReturns.map(r => r * 0.9 + (Math.random() * 0.02 - 0.01)); // Highly correlated to BTC
  const solReturns = btcReturns.map(r => r * 0.7 + (Math.random() * 0.04 - 0.02)); // Moderately correlated to BTC
  const bnbReturns = btcReturns.map(r => r * 0.8 + (Math.random() * 0.03 - 0.015)); // Highly correlated to BTC
  const xrpReturns = btcReturns.map(r => r * 0.5 + (Math.random() * 0.05 - 0.025)); // Weakly correlated to BTC
  const adaReturns = solReturns.map(r => r * 0.85 + (Math.random() * 0.03 - 0.015)); // Highly correlated to SOL
  const dogeReturns = btcReturns.map(r => r * 0.3 + (Math.random() * 0.08 - 0.04)); // Very weakly correlated to BTC
  const dotReturns = ethReturns.map(r => r * 0.8 + (Math.random() * 0.03 - 0.015)); // Highly correlated to ETH
  const avaxReturns = ethReturns.map(r => r * 0.75 + (Math.random() * 0.04 - 0.02)); // Highly correlated to ETH
  
  // Stablecoin (nearly uncorrelated)
  const usdcReturns = Array(30).fill(0).map(() => Math.random() * 0.002 - 0.001); // -0.1% to 0.1%
  
  return [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 61245.32, returns: btcReturns },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3010.45, returns: ethReturns },
    { id: "solana", symbol: "SOL", name: "Solana", price: 142.87, returns: solReturns },
    { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.45, returns: adaReturns },
    { id: "xrp", symbol: "XRP", name: "XRP", price: 0.57, returns: xrpReturns },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.14, returns: dogeReturns },
    { id: "binancecoin", symbol: "BNB", name: "Binance Coin", price: 541.87, returns: bnbReturns },
    { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 6.33, returns: dotReturns },
    { id: "avalanche", symbol: "AVAX", name: "Avalanche", price: 25.12, returns: avaxReturns },
    { id: "usd-coin", symbol: "USDC", name: "USD Coin", price: 1.00, returns: usdcReturns }
  ];
};

// Calculate correlation between two arrays
const calculateCorrelation = (returns1: number[], returns2: number[]): number => {
  const n = Math.min(returns1.length, returns2.length);
  
  // Calculate means
  const mean1 = returns1.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const mean2 = returns2.slice(0, n).reduce((a, b) => a + b, 0) / n;
  
  // Calculate variances and covariance
  let variance1 = 0;
  let variance2 = 0;
  let covariance = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;
    
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
    covariance += diff1 * diff2;
  }
  
  // Prevent division by zero
  if (variance1 === 0 || variance2 === 0) return 0;
  
  // Calculate correlation
  return covariance / Math.sqrt(variance1 * variance2);
};

// Get color based on correlation value
const getCorrelationColor = (correlation: number): string => {
  const abs = Math.abs(correlation);
  if (correlation > 0) {
    if (abs >= 0.7) return CORRELATION_COLORS.STRONG_POSITIVE;
    if (abs >= 0.4) return CORRELATION_COLORS.MODERATE_POSITIVE;
    if (abs > 0.1) return CORRELATION_COLORS.WEAK_POSITIVE;
  } else if (correlation < 0) {
    if (abs >= 0.7) return CORRELATION_COLORS.STRONG_NEGATIVE;
    if (abs >= 0.4) return CORRELATION_COLORS.MODERATE_NEGATIVE;
    if (abs > 0.1) return CORRELATION_COLORS.WEAK_NEGATIVE;
  }
  return CORRELATION_COLORS.NEUTRAL;
};

// Helper to create scatter data from returns
const createScatterData = (returns1: number[], returns2: number[]): { x: number; y: number }[] => {
  const n = Math.min(returns1.length, returns2.length);
  return Array(n).fill(0).map((_, i) => ({ x: returns1[i], y: returns2[i] }));
};

const CorrelationAnalysisToolkit: React.FC = () => {
  const [asset1, setAsset1] = useState<string>("bitcoin");
  const [asset2, setAsset2] = useState<string>("ethereum");
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [correlationData] = useState<CryptoCorrelationData[]>(generateMockPriceData());
  const [heatmapEnabled, setHeatmapEnabled] = useState<boolean>(false);
  
  // Calculate correlation between selected assets
  const selectedCorrelation = useMemo(() => {
    const asset1Data = correlationData.find(a => a.id === asset1);
    const asset2Data = correlationData.find(a => a.id === asset2);
    
    if (!asset1Data || !asset2Data) return null;
    
    const correlation = calculateCorrelation(asset1Data.returns, asset2Data.returns);
    const color = getCorrelationColor(correlation);
    const scatterData = createScatterData(asset1Data.returns, asset2Data.returns);
    
    return {
      asset1: asset1Data.symbol,
      asset2: asset2Data.symbol,
      correlation,
      color,
      scatterData
    };
  }, [asset1, asset2, correlationData]);
  
  // Calculate all pair correlations for heatmap
  const allCorrelations = useMemo(() => {
    const pairs: CorrelationPair[] = [];
    
    for (let i = 0; i < correlationData.length; i++) {
      for (let j = i + 1; j < correlationData.length; j++) {
        const asset1Data = correlationData[i];
        const asset2Data = correlationData[j];
        
        const correlation = calculateCorrelation(asset1Data.returns, asset2Data.returns);
        const color = getCorrelationColor(correlation);
        const scatterData = createScatterData(asset1Data.returns, asset2Data.returns);
        
        pairs.push({
          asset1: asset1Data.symbol,
          asset2: asset2Data.symbol,
          correlation,
          color,
          scatterData
        });
      }
    }
    
    // Sort by correlation strength (absolute value, descending)
    return pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [correlationData]);
  
  // Format correlation for display
  const formatCorrelation = (value: number): string => {
    return value.toFixed(2);
  };
  
  // Describe correlation strength
  const describeCorrelation = (value: number): string => {
    const abs = Math.abs(value);
    const direction = value >= 0 ? "Positive" : "Negative";
    
    if (abs >= 0.7) return `Strong ${direction}`;
    if (abs >= 0.4) return `Moderate ${direction}`;
    if (abs > 0.1) return `Weak ${direction}`;
    return "No Correlation";
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Crypto Correlation Analysis</CardTitle>
          <CardDescription>
            Analyze how different cryptocurrencies move in relation to each other
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="min-w-[150px]">
              <label className="text-sm font-medium block mb-1">First Asset</label>
              <Select value={asset1} onValueChange={setAsset1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ASSETS.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.symbol} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[150px]">
              <label className="text-sm font-medium block mb-1">Second Asset</label>
              <Select value={asset2} onValueChange={setAsset2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ASSETS.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.symbol} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[120px]">
              <label className="text-sm font-medium block mb-1">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setHeatmapEnabled(!heatmapEnabled)}
              >
                {heatmapEnabled ? "Hide All Pairs" : "Show All Pairs"}
              </Button>
            </div>
          </div>
          
          {selectedCorrelation && !heatmapEnabled && (
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                {selectedCorrelation.asset1}/{selectedCorrelation.asset2} Correlation
              </h3>
              
              <div className="flex flex-wrap gap-4 md:gap-8 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Correlation Coefficient</div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: selectedCorrelation.color }}
                  >
                    {formatCorrelation(selectedCorrelation.correlation)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Relationship</div>
                  <div className="text-xl font-medium">
                    {describeCorrelation(selectedCorrelation.correlation)}
                  </div>
                </div>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name={selectedCorrelation.asset1} 
                      label={{ 
                        value: `${selectedCorrelation.asset1} Returns`,
                        position: 'bottom',
                        offset: 0
                      }} 
                      domain={['dataMin', 'dataMax']} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name={selectedCorrelation.asset2} 
                      label={{ 
                        value: `${selectedCorrelation.asset2} Returns`,
                        angle: -90,
                        position: 'left'
                      }} 
                      domain={['dataMin', 'dataMax']} 
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip 
                      formatter={(value: any) => `${(value * 100).toFixed(2)}%`}
                      labelFormatter={() => "Return"} 
                    />
                    <Scatter name="Returns" data={selectedCorrelation.scatterData}>
                      {selectedCorrelation.scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={selectedCorrelation.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 text-sm text-muted-foreground flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Each point represents daily returns for both assets
              </div>
            </div>
          )}
          
          {heatmapEnabled && (
            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">All Correlations</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Correlation</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead className="text-right">Visualization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCorrelations.map((pair, index) => (
                      <TableRow key={`${pair.asset1}-${pair.asset2}`}>
                        <TableCell>
                          {pair.asset1}/{pair.asset2}
                        </TableCell>
                        <TableCell>
                          <span style={{ color: pair.color, fontWeight: 'bold' }}>
                            {formatCorrelation(pair.correlation)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {describeCorrelation(pair.correlation)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="w-24 h-6 ml-auto">
                            <div 
                              className="h-full rounded-md"
                              style={{ 
                                background: `linear-gradient(90deg, white, ${pair.color})`,
                                opacity: Math.abs(pair.correlation)
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationAnalysisToolkit;
