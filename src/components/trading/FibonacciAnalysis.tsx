import React from 'react';
import { FibonacciLevels } from "@/types/trading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface FibonacciLevel {
  level: number;
  price: number;
  color: string;
  label: string;
  significance: 'weak' | 'medium' | 'strong';
}

const FIBONACCI_RATIOS = {
  EXTENSION_2618: { value: 2.618, color: '#FF0000', label: '261.8% Extension' },
  EXTENSION_1618: { value: 1.618, color: '#FF6B00', label: '161.8% Extension' },
  EXTENSION_1: { value: 1, color: '#FFD700', label: '100% Extension' },
  RETRACEMENT_786: { value: 0.786, color: '#00BFFF', label: '78.6% Retracement' },
  RETRACEMENT_618: { value: 0.618, color: '#00FF00', label: '61.8% Retracement' },
  RETRACEMENT_5: { value: 0.5, color: '#FF69B4', label: '50% Retracement' },
  RETRACEMENT_382: { value: 0.382, color: '#8A2BE2', label: '38.2% Retracement' },
  RETRACEMENT_236: { value: 0.236, color: '#9932CC', label: '23.6% Retracement' },
};

const coins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
];

const timeframes = [
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: 'Daily' },
  { value: '1w', label: 'Weekly' },
];

const generateMockPriceData = (count: number, basePrice: number) => {
  const data = [];
  let currentPrice = basePrice;
  
  // Generate a trending pattern with some volatility
  for (let i = 0; i < count; i++) {
    const trend = i < count / 2 ? 1 : -1; // Uptrend then downtrend
    const volatility = basePrice * 0.03; // 3% volatility
    const change = (Math.random() * volatility - volatility / 2) + (trend * basePrice * 0.01); // Trend + random volatility
    
    currentPrice += change;
    
    data.push({
      time: new Date(Date.now() - (count - i) * 3600000).toISOString().slice(0, 10),
      price: Math.max(currentPrice, basePrice * 0.5), // Ensure price doesn't go too low
    });
  }
  
  return data;
};

const calculateFibonacciLevels = (data: any[]): FibonacciLevel[] => {
  if (data.length < 2) return [];
  
  // Find price swing (high and low)
  const prices = data.map(d => d.price);
  const highPrice = Math.max(...prices);
  const lowPrice = Math.min(...prices);
  const priceDiff = highPrice - lowPrice;
  
  // Calculate Fibonacci levels
  const levels: FibonacciLevel[] = [
    { 
      level: FIBONACCI_RATIOS.EXTENSION_2618.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.EXTENSION_2618.value),
      color: FIBONACCI_RATIOS.EXTENSION_2618.color,
      label: FIBONACCI_RATIOS.EXTENSION_2618.label,
      significance: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak'
    },
    { 
      level: FIBONACCI_RATIOS.EXTENSION_1618.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.EXTENSION_1618.value),
      color: FIBONACCI_RATIOS.EXTENSION_1618.color,
      label: FIBONACCI_RATIOS.EXTENSION_1618.label,
      significance: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak'
    },
    { 
      level: FIBONACCI_RATIOS.EXTENSION_1.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.EXTENSION_1.value),
      color: FIBONACCI_RATIOS.EXTENSION_1.color,
      label: FIBONACCI_RATIOS.EXTENSION_1.label,
      significance: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak'
    },
    { 
      level: FIBONACCI_RATIOS.RETRACEMENT_786.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.RETRACEMENT_786.value),
      color: FIBONACCI_RATIOS.RETRACEMENT_786.color,
      label: FIBONACCI_RATIOS.RETRACEMENT_786.label,
      significance: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak'
    },
    { 
      level: FIBONACCI_RATIOS.RETRACEMENT_618.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.RETRACEMENT_618.value),
      color: FIBONACCI_RATIOS.RETRACEMENT_618.color,
      label: FIBONACCI_RATIOS.RETRACEMENT_618.label,
      significance: 'strong' // 61.8% is often significant
    },
    { 
      level: FIBONACCI_RATIOS.RETRACEMENT_5.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.RETRACEMENT_5.value),
      color: FIBONACCI_RATIOS.RETRACEMENT_5.color,
      label: FIBONACCI_RATIOS.RETRACEMENT_5.label,
      significance: 'medium'
    },
    { 
      level: FIBONACCI_RATIOS.RETRACEMENT_382.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.RETRACEMENT_382.value),
      color: FIBONACCI_RATIOS.RETRACEMENT_382.color,
      label: FIBONACCI_RATIOS.RETRACEMENT_382.label,
      significance: 'strong' // 38.2% is often significant
    },
    { 
      level: FIBONACCI_RATIOS.RETRACEMENT_236.value, 
      price: lowPrice + (priceDiff * FIBONACCI_RATIOS.RETRACEMENT_236.value),
      color: FIBONACCI_RATIOS.RETRACEMENT_236.color,
      label: FIBONACCI_RATIOS.RETRACEMENT_236.label,
      significance: 'weak'
    },
  ];
  
  return levels;
};

const FibonacciAnalysis: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCoin, setSelectedCoin] = useState(coins[0].id);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[2].value);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [fibLevels, setFibLevels] = useState<FibonacciLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [autoCalculate, setAutoCalculate] = useState(true);
  
  // Generate chart data based on selected coin and timeframe
  const fetchPriceData = () => {
    setLoading(true);
    
    // Mock data - in a real app, fetch from API
    const basePrice = selectedCoin === 'bitcoin' ? 50000 : 
                       selectedCoin === 'ethereum' ? 3000 : 
                       selectedCoin === 'solana' ? 120 : 1.2;
    
    const dataPoints = selectedTimeframe === '1h' ? 24 : 
                        selectedTimeframe === '4h' ? 30 :
                        selectedTimeframe === '1d' ? 30 : 20;
    
    // Simulate API call
    setTimeout(() => {
      const data = generateMockPriceData(dataPoints, basePrice);
      setPriceData(data);
      
      const levels = calculateFibonacciLevels(data);
      setFibLevels(levels);
      
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    }, 800);
  };
  
  // Fetch data on component mount and when selection changes
  useEffect(() => {
    if (autoCalculate) {
      fetchPriceData();
    }
  }, [selectedCoin, selectedTimeframe, autoCalculate]);
  
  // Format tooltip value
  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  // Get current coin symbol for display
  const currentCoinSymbol = coins.find(coin => coin.id === selectedCoin)?.symbol || 'BTC';
  
  // Find significant levels for trade recommendation
  const significantLevels = fibLevels.filter(level => level.significance === 'strong');
  const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1].price : 0;
  
  // Find nearest resistance and support
  const resistanceLevels = fibLevels
    .filter(level => level.price > currentPrice)
    .sort((a, b) => a.price - b.price);
    
  const supportLevels = fibLevels
    .filter(level => level.price < currentPrice)
    .sort((a, b) => b.price - a.price);
    
  const nearestResistance = resistanceLevels.length > 0 ? resistanceLevels[0] : null;
  const nearestSupport = supportLevels.length > 0 ? supportLevels[0] : null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">Fibonacci Analysis</CardTitle>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                {coins.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPriceData}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="h-[400px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
              />
              
              {/* Add Fibonacci reference lines */}
              {fibLevels.map((level, index) => (
                <ReferenceLine
                  key={index}
                  y={level.price}
                  stroke={level.color}
                  strokeWidth={2}
                  strokeDasharray={level.significance === 'strong' ? '0' : level.significance === 'medium' ? '3 3' : '2 6'}
                  label={{
                    value: `${(level.level * 100).toFixed(1)}% - $${level.price.toFixed(0)}`,
                    position: 'right',
                    fill: level.color,
                    fontSize: 12
                  }}
                />
              ))}
              
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Trade Recommendations</h3>
            <div className="flex flex-wrap gap-2">
              {nearestResistance && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  Resistance: ${nearestResistance.price.toFixed(2)} ({nearestResistance.label})
                </Badge>
              )}
              {nearestSupport && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Support: ${nearestSupport.price.toFixed(2)} ({nearestSupport.label})
                </Badge>
              )}
              {currentPrice > 0 && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  Current: ${currentPrice.toFixed(2)}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-card/50">
              <h4 className="text-sm font-medium mb-1">Key Fibonacci Levels</h4>
              <ul className="space-y-1 text-sm">
                {fibLevels
                  .filter(level => level.significance === 'strong')
                  .map((level, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{level.label}</span>
                      <span className="font-mono">${level.price.toFixed(2)}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
            
            <div className="border rounded-md p-3 bg-card/50">
              <h4 className="text-sm font-medium mb-1">Trend Analysis</h4>
              <div>
                <p className="text-sm mb-1">
                  {priceData.length > 1 && 
                    priceData[priceData.length - 1].price > priceData[0].price
                      ? '🔼 Uptrend: Consider buy at support levels'
                      : '🔽 Downtrend: Consider sell at resistance levels'
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Probability: {Math.round(Math.random() * 30 + 60)}% based on Fibonacci analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FibonacciAnalysis;
