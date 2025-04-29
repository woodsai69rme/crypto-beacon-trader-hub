import React from 'react';
import { HyblockLiquidityZone } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  LabelList
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { RefreshCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PriceLevel {
  price: number;
  buyVolume: number;
  sellVolume: number;
  netVolume: number;
  significance: 'low' | 'medium' | 'high';
}

interface HeatmapData {
  exchangeName: string;
  timestamp: number;
  baseCurrency: string;
  quoteCurrency: string;
  currentPrice: number;
  priceLevels: PriceLevel[];
}

const AVAILABLE_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', currentPrice: 61245.32 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', currentPrice: 3010.45 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', currentPrice: 142.87 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', currentPrice: 0.45 },
];

const EXCHANGES = [
  'All Exchanges',
  'Binance',
  'Coinbase',
  'FTX',
  'Kraken',
  'Huobi'
];

// Generate mock heatmap data
const generateMockHeatmapData = (basePrice: number) => {
  const priceLevels: PriceLevel[] = [];
  
  // Create price levels above and below the current price
  for (let i = -20; i <= 20; i++) {
    if (i === 0) continue; // Skip current price
    
    const price = basePrice * (1 + i * 0.01);
    const isRoundNumber = Math.abs(price % 1000) < 10 || Math.abs(price % 500) < 5;
    const isMajorLevel = Math.abs(i) % 5 === 0;
    
    // Generate larger volumes at key psychological levels
    const volumeMultiplier = isRoundNumber ? 5 : isMajorLevel ? 3 : 1;
    
    // More sell volume above, more buy volume below
    const buyVolume = i < 0 
      ? Math.random() * 300 * volumeMultiplier + 50
      : Math.random() * 50;
      
    const sellVolume = i > 0 
      ? Math.random() * 300 * volumeMultiplier + 50
      : Math.random() * 50;
      
    const significance: 'low' | 'medium' | 'high' = 
      volumeMultiplier === 5 ? 'high' : 
      volumeMultiplier === 3 ? 'medium' : 'low';
    
    priceLevels.push({
      price,
      buyVolume,
      sellVolume,
      netVolume: buyVolume - sellVolume,
      significance
    });
  }
  
  // Add current price reference
  priceLevels.push({
    price: basePrice,
    buyVolume: 0,
    sellVolume: 0,
    netVolume: 0,
    significance: 'high'
  });
  
  // Sort by price
  priceLevels.sort((a, b) => a.price - b.price);
  
  return {
    exchangeName: 'Hyblock Aggregated',
    timestamp: Date.now(),
    baseCurrency: 'BTC',
    quoteCurrency: 'USD',
    currentPrice: basePrice,
    priceLevels
  };
};

// Format large numbers with k/m suffixes
const formatVolume = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(0);
};

const HyblockLiquidityMap: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCoin, setSelectedCoin] = useState(AVAILABLE_COINS[0].id);
  const [selectedExchange, setSelectedExchange] = useState(EXCHANGES[0]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const selectedCoinData = AVAILABLE_COINS.find(coin => coin.id === selectedCoin);
  
  // Format tooltip value
  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  const sortedChartData = chartData.sort((a, b) => a.price - b.price);
  
  const fetchLiquidityData = () => {
    if (!selectedCoinData) return;
    
    setLoading(true);
    
    // In a real implementation, this would be an API call to Hyblock
    setTimeout(() => {
      const mockData = generateMockHeatmapData(selectedCoinData.currentPrice);
      setHeatmapData(mockData);
      
      // Transform data for the chart
      const chartDataArray = mockData.priceLevels.map(level => ({
        price: level.price,
        buyVolume: level.buyVolume,
        sellVolume: -level.sellVolume, // Negative for visualization
        netVolume: level.netVolume,
        formattedPrice: `$${level.price.toFixed(0)}`,
        significance: level.significance,
        isCurrentPrice: Math.abs(level.price - mockData.currentPrice) < 0.01
      }));
      
      setChartData(chartDataArray);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
      
      toast({
        title: "Liquidity Data Updated",
        description: `Latest ${selectedCoinData.symbol} liquidity data loaded from Hyblock`,
      });
    }, 800);
  };
  
  // Fetch data on component mount and selection change
  useEffect(() => {
    fetchLiquidityData();
  }, [selectedCoin, selectedExchange]);
  
  // Find significant liquidity walls
  const buyWalls = chartData
    .filter(d => d.buyVolume > 200)
    .sort((a, b) => b.buyVolume - a.buyVolume)
    .slice(0, 3);
    
  const sellWalls = chartData
    .filter(d => d.sellVolume < -200)
    .sort((a, b) => a.sellVolume - b.sellVolume)
    .slice(0, 3);
  
  // Analyze the market maker liquidity targets
  const currentPrice = heatmapData?.currentPrice || 0;
  const biggestBuyWall = buyWalls.length > 0 ? buyWalls[0] : null;
  const biggestSellWall = sellWalls.length > 0 ? sellWalls[0] : null;
  
  // Determine if price is likely to move up or down based on liquidity
  const totalBuyVolume = chartData.reduce((sum, d) => sum + d.buyVolume, 0);
  const totalSellVolume = chartData.reduce((sum, d) => sum + Math.abs(d.sellVolume), 0);
  const netSentiment = totalBuyVolume > totalSellVolume ? 'bullish' : 'bearish';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              Hyblock Liquidity Map
              <Badge variant="outline" className="ml-2 text-xs">PREMIUM</Badge>
            </CardTitle>
            <CardDescription>
              Market maker liquidity and order book visualization
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_COINS.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedExchange} onValueChange={setSelectedExchange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Exchange" />
              </SelectTrigger>
              <SelectContent>
                {EXCHANGES.map(exchange => (
                  <SelectItem key={exchange} value={exchange}>
                    {exchange}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={fetchLiquidityData}
              disabled={loading}
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={0}
              barCategoryGap={1}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal vertical={false} />
              <XAxis 
                dataKey="formattedPrice" 
                tick={{ fontSize: 10 }}
                interval={Math.floor(sortedChartData.length / 8)}
              />
              <YAxis 
                tickFormatter={formatVolume}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  Math.abs(value).toFixed(2),
                  name === 'buyVolume' ? 'Buy Volume' : 'Sell Volume'
                ]}
                labelFormatter={(label) => `Price: ${label}`}
              />
              
              {/* Current price reference line */}
              {heatmapData && (
                <ReferenceLine
                  x={`$${heatmapData.currentPrice.toFixed(0)}`}
                  stroke="#FFD700"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: `Current $${heatmapData.currentPrice.toFixed(0)}`,
                    position: 'insideTopLeft',
                    fill: '#FFD700',
                    fontSize: 12
                  }}
                />
              )}
              
              <Bar 
                dataKey="buyVolume" 
                fill="#4CAF50" 
                radius={[0, 0, 0, 0]}
                minPointSize={2}
              />
              <Bar 
                dataKey="sellVolume" 
                fill="#F44336" 
                radius={[0, 0, 0, 0]}
                minPointSize={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-card/50">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                Buy Liquidity Zones
              </h3>
              {buyWalls.length > 0 ? (
                <ul className="space-y-2">
                  {buyWalls.map((wall, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={
                            wall.significance === 'high' 
                              ? 'bg-green-500/20 text-green-500 mr-2' 
                              : 'bg-green-500/10 text-green-400 mr-2'
                          }
                        >
                          {wall.significance === 'high' ? 'Strong' : wall.significance === 'medium' ? 'Medium' : 'Weak'}
                        </Badge>
                        ${wall.price.toFixed(0)}
                      </span>
                      <span className="text-green-500 font-medium">{formatVolume(wall.buyVolume)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No significant buy walls detected</div>
              )}
            </div>
            
            <div className="border rounded-md p-4 bg-card/50">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                Sell Liquidity Zones
              </h3>
              {sellWalls.length > 0 ? (
                <ul className="space-y-2">
                  {sellWalls.map((wall, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={
                            wall.significance === 'high' 
                              ? 'bg-red-500/20 text-red-500 mr-2' 
                              : 'bg-red-500/10 text-red-400 mr-2'
                          }
                        >
                          {wall.significance === 'high' ? 'Strong' : wall.significance === 'medium' ? 'Medium' : 'Weak'}
                        </Badge>
                        ${wall.price.toFixed(0)}
                      </span>
                      <span className="text-red-500 font-medium">{formatVolume(Math.abs(wall.sellVolume))}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No significant sell walls detected</div>
              )}
            </div>
          </div>
          
          <div className="bg-muted/20 rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Market Maker Analysis</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Liquidity sentiment:</span>{' '}
                <Badge variant={netSentiment === 'bullish' ? 'default' : 'destructive'}>
                  {netSentiment === 'bullish' ? 'Bullish' : 'Bearish'}
                </Badge>
              </p>
              
              {biggestBuyWall && (
                <p>
                  <span className="font-medium">Strongest support:</span>{' '}
                  ${biggestBuyWall.price.toFixed(0)} (Volume: {formatVolume(biggestBuyWall.buyVolume)})
                </p>
              )}
              
              {biggestSellWall && (
                <p>
                  <span className="font-medium">Strongest resistance:</span>{' '}
                  ${biggestSellWall.price.toFixed(0)} (Volume: {formatVolume(Math.abs(biggestSellWall.sellVolume))})
                </p>
              )}
              
              <p>
                <span className="font-medium">Market maker target:</span>{' '}
                {biggestBuyWall && biggestSellWall ? (
                  <>
                    {Math.abs(currentPrice - biggestBuyWall.price) < Math.abs(currentPrice - biggestSellWall.price) ? (
                      <span className="text-red-500">
                        Likely aiming to collect liquidity at ${biggestBuyWall.price.toFixed(0)} (support)
                      </span>
                    ) : (
                      <span className="text-green-500">
                        Likely aiming to collect liquidity at ${biggestSellWall.price.toFixed(0)} (resistance)
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">Insufficient data to determine</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HyblockLiquidityMap;
