
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Percent,
  ArrowRight
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { TradePrediction } from '@/types/trading';

const AVAILABLE_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', currentPrice: 61245.32 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', currentPrice: 3010.45 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', currentPrice: 142.87 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', currentPrice: 0.45 },
];

const TIMEFRAMES = [
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
];

const INDICATORS = [
  { name: 'RSI', value: 48.2, signal: 'neutral' },
  { name: 'MACD', value: 1.2, signal: 'buy' },
  { name: 'Stochastic', value: 72.5, signal: 'neutral' },
  { name: 'ADX', value: 28.6, signal: 'buy' },
  { name: 'Bollinger', value: -0.6, signal: 'sell' },
  { name: 'Ichimoku', value: 1.8, signal: 'buy' },
  { name: 'Williams %R', value: -15.3, signal: 'sell' },
  { name: 'CCI', value: 56.8, signal: 'neutral' },
  { name: 'OBV', value: 1.4, signal: 'buy' },
];

// Generate probability distribution data
const generateProbabilityData = (mean: number, stdDev: number, count: number) => {
  const data = [];
  const range = stdDev * 3;
  
  for (let i = 0; i < count; i++) {
    const x = mean - range + (2 * range * i / (count - 1));
    
    // Normal distribution formula
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
              
    data.push({
      price: x,
      probability: y * 100, // Scale for visualization
      isCurrentPrice: Math.abs(x - mean) < stdDev * 0.05
    });
  }
  
  return data;
};

const generateTradePrediction = (coinId: string, timeframe: string): TradePrediction => {
  const coin = AVAILABLE_COINS.find(c => c.id === coinId) || AVAILABLE_COINS[0];
  const currentPrice = coin.currentPrice;
  
  // Randomly determine direction with bias toward realistic scenarios
  const rand = Math.random();
  const direction = rand > 0.6 ? 'up' : rand > 0.25 ? 'sideways' : 'down';
  
  // Calculate target based on direction and timeframe volatility
  let timeframeVolatility: number;
  switch (timeframe) {
    case '15m':
      timeframeVolatility = 0.005; // 0.5%
      break;
    case '1h':
      timeframeVolatility = 0.015; // 1.5%
      break;
    case '4h':
      timeframeVolatility = 0.03; // 3%
      break;
    case '1d':
      timeframeVolatility = 0.05; // 5%
      break;
    default:
      timeframeVolatility = 0.02;
  }
  
  // Calculate target price based on direction
  let targetPrice, confidence, probability;
  if (direction === 'up') {
    targetPrice = currentPrice * (1 + timeframeVolatility * (1 + Math.random()));
    confidence = 0.5 + Math.random() * 0.4; // 50-90%
    probability = 0.5 + Math.random() * 0.35; // 50-85%
  } else if (direction === 'down') {
    targetPrice = currentPrice * (1 - timeframeVolatility * (1 + Math.random()));
    confidence = 0.5 + Math.random() * 0.4; // 50-90%
    probability = 0.5 + Math.random() * 0.35; // 50-85%
  } else {
    targetPrice = currentPrice * (1 + (Math.random() - 0.5) * timeframeVolatility * 0.5);
    confidence = 0.4 + Math.random() * 0.3; // 40-70%
    probability = 0.6 + Math.random() * 0.2; // 60-80%
  }
  
  // Calculate stop loss
  const stopLoss = direction === 'up' 
    ? currentPrice * (1 - timeframeVolatility * 0.8) 
    : currentPrice * (1 + timeframeVolatility * 0.8);
  
  // Pick relevant indicators and assign signals based on direction
  const selectedIndicators = INDICATORS.map(indicator => {
    let signal: 'buy' | 'sell' | 'neutral';
    
    if (direction === 'up') {
      signal = Math.random() > 0.3 ? 'buy' : Math.random() > 0.5 ? 'neutral' : 'sell';
    } else if (direction === 'down') {
      signal = Math.random() > 0.3 ? 'sell' : Math.random() > 0.5 ? 'neutral' : 'buy';
    } else {
      signal = Math.random() > 0.6 ? 'neutral' : Math.random() > 0.5 ? 'buy' : 'sell';
    }
    
    return {
      ...indicator,
      signal
    };
  });

  return {
    coin: coinId,
    timeframe,
    direction,
    confidence,
    targetPrice,
    stopLoss,
    probability,
    indicators: selectedIndicators,
    timestamp: new Date().toISOString()
  };
};

const QuantitativeAnalysis: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState(AVAILABLE_COINS[0].id);
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[2].value);
  const [prediction, setPrediction] = useState<TradePrediction | null>(null);
  const [probabilityData, setProbabilityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const selectedCoinData = AVAILABLE_COINS.find(c => c.id === selectedCoin) || AVAILABLE_COINS[0];
  
  // Analyze indicator signals
  const getSignalCounts = () => {
    if (!prediction) return { buy: 0, sell: 0, neutral: 0, total: 0 };
    
    const buy = prediction.indicators.filter(i => i.signal === 'buy').length;
    const sell = prediction.indicators.filter(i => i.signal === 'sell').length;
    const neutral = prediction.indicators.filter(i => i.signal === 'neutral').length;
    
    return {
      buy,
      sell,
      neutral,
      total: prediction.indicators.length
    };
  };
  
  const signalCounts = getSignalCounts();
  
  const pieData = [
    { name: 'Buy', value: signalCounts.buy },
    { name: 'Sell', value: signalCounts.sell },
    { name: 'Neutral', value: signalCounts.neutral }
  ];
  
  const COLORS = ['#4CAF50', '#F44336', '#9E9E9E'];
  
  // Generate prediction on coin/timeframe change
  const generatePrediction = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newPrediction = generateTradePrediction(selectedCoin, selectedTimeframe);
      setPrediction(newPrediction);
      
      // Generate probability distribution data
      const currentPrice = selectedCoinData.currentPrice;
      let stdDev;
      
      switch (selectedTimeframe) {
        case '15m':
          stdDev = currentPrice * 0.005; // 0.5%
          break;
        case '1h':
          stdDev = currentPrice * 0.01; // 1%
          break;
        case '4h':
          stdDev = currentPrice * 0.02; // 2%
          break;
        case '1d':
          stdDev = currentPrice * 0.04; // 4%
          break;
        default:
          stdDev = currentPrice * 0.02;
      }
      
      const distribution = generateProbabilityData(
        newPrediction.direction === 'up' 
          ? currentPrice * 1.01 
          : newPrediction.direction === 'down' 
            ? currentPrice * 0.99 
            : currentPrice,
        stdDev,
        40
      );
      
      setProbabilityData(distribution);
      setLoading(false);
    }, 800);
  };
  
  useEffect(() => {
    generatePrediction();
  }, [selectedCoin, selectedTimeframe]);
  
  // Calculate risk/reward ratio
  const calculateRiskReward = () => {
    if (!prediction) return 0;
    
    const currentPrice = selectedCoinData.currentPrice;
    const targetPrice = prediction.targetPrice;
    const stopLoss = prediction.stopLoss;
    
    const reward = Math.abs(targetPrice - currentPrice);
    const risk = Math.abs(stopLoss - currentPrice);
    
    return reward / risk;
  };
  
  const riskReward = calculateRiskReward();
  
  // Direction color and icon
  const directionColor = 
    prediction?.direction === 'up' ? 'text-green-500' :
    prediction?.direction === 'down' ? 'text-red-500' :
    'text-yellow-500';
    
  const DirectionIcon = 
    prediction?.direction === 'up' ? ArrowUpRight :
    prediction?.direction === 'down' ? ArrowDownRight :
    ArrowRight;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start flex-wrap">
          <div>
            <CardTitle className="text-lg">Quantitative Trade Analysis</CardTitle>
            <CardDescription>
              AI-powered probability analysis and trade outcome prediction
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
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAMES.map(tf => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={generatePrediction}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {prediction && (
          <>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="bg-card border rounded-lg p-4 flex-1">
                <div className="text-sm text-muted-foreground mb-2">Price Prediction</div>
                <div className="flex items-center gap-2">
                  <DirectionIcon className={`h-6 w-6 ${directionColor}`} />
                  <span className={`text-2xl font-bold ${directionColor}`}>
                    ${prediction.targetPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Current: ${selectedCoinData.currentPrice.toFixed(2)} 
                  <span className={directionColor}> 
                    ({((prediction.targetPrice / selectedCoinData.currentPrice - 1) * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 flex-1">
                <div className="text-sm text-muted-foreground mb-1">Probability</div>
                <div className="flex items-center gap-1">
                  <Percent className="h-5 w-5" />
                  <span className="text-2xl font-bold">{(prediction.probability * 100).toFixed(0)}%</span>
                </div>
                <Progress value={prediction.probability * 100} className="h-2 mt-2" />
              </div>
              
              <div className="bg-card border rounded-lg p-4 flex-1">
                <div className="text-sm text-muted-foreground mb-1">Risk / Reward</div>
                <div className="text-2xl font-bold">1:{riskReward.toFixed(2)}</div>
                <div className="flex gap-2 mt-1 text-xs">
                  <Badge variant="outline" className="bg-red-500/10 text-red-500">
                    Stop: ${prediction.stopLoss.toFixed(2)}
                  </Badge>
                  <Badge variant={prediction.direction === 'up' ? "default" : "destructive"}>
                    Target: ${prediction.targetPrice.toFixed(2)}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 flex-1">
                <div className="text-sm text-muted-foreground mb-1">Key Timeframe</div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xl font-bold">{selectedTimeframe}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Direction: 
                  <Badge 
                    variant={
                      prediction.direction === 'up' 
                        ? "default" 
                        : prediction.direction === 'down' 
                          ? "destructive" 
                          : "outline"
                    }
                    className="ml-1"
                  >
                    {prediction.direction === 'up' 
                      ? 'Uptrend' 
                      : prediction.direction === 'down' 
                        ? 'Downtrend' 
                        : 'Sideways'
                    }
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Probability Distribution Chart */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Price Probability Distribution</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={probabilityData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                      barCategoryGap={0}
                      barGap={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                      <XAxis 
                        dataKey="price"
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                        tick={{ fontSize: 10 }}
                        interval={Math.floor(probabilityData.length / 5)}
                      />
                      <YAxis tick={{ fontSize: 10 }} hide />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toFixed(2)}%`, 'Probability']}
                        labelFormatter={(label) => `Price: $${parseFloat(label).toFixed(0)}`}
                      />
                      <Bar 
                        dataKey="probability" 
                        fill={(entry) => {
                          if (entry.isCurrentPrice) return '#FFD700';
                          const priceDiff = entry.price - selectedCoinData.currentPrice;
                          if (prediction.direction === 'up') {
                            return priceDiff > 0 ? '#4CAF50' : '#F44336';
                          } else if (prediction.direction === 'down') {
                            return priceDiff < 0 ? '#4CAF50' : '#F44336';
                          }
                          return '#9E9E9E';
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex justify-center">
                  <Badge variant="outline" className="mr-2">Target: ${prediction.targetPrice.toFixed(0)}</Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                    Current: ${selectedCoinData.currentPrice.toFixed(0)}
                  </Badge>
                </div>
              </div>
              
              {/* Technical Indicators Breakdown */}
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3 flex justify-between items-center">
                  Technical Indicators
                  <div>
                    <PieChart width={80} height={40}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={10}
                        outerRadius={20}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                </h3>
                
                <div className="grid grid-cols-3 gap-y-2 text-xs">
                  {prediction.indicators.map((indicator, index) => (
                    <div key={index} className="flex justify-between items-center pr-2">
                      <span>{indicator.name}</span>
                      <Badge
                        variant={
                          indicator.signal === 'buy'
                            ? 'default'
                            : indicator.signal === 'sell'
                              ? 'destructive'
                              : 'outline'
                        }
                        className="text-[10px] h-5"
                      >
                        {indicator.signal}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div>
                    <span className="font-medium">Summary:</span>{' '}
                    {signalCounts.buy > signalCounts.sell ? (
                      <Badge variant="default">BUY</Badge>
                    ) : signalCounts.sell > signalCounts.buy ? (
                      <Badge variant="destructive">SELL</Badge>
                    ) : (
                      <Badge variant="outline">NEUTRAL</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {signalCounts.buy} buy • {signalCounts.sell} sell • {signalCounts.neutral} neutral
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/10">
              <h3 className="text-sm font-medium mb-2">Quantitative Trading Strategy</h3>
              <div className="text-sm space-y-2">
                <p>
                  {prediction.direction === 'up' ? (
                    <>
                      <span className="font-medium">Buy strategy:</span>{' '}
                      Enter long position at ${selectedCoinData.currentPrice.toFixed(2)} with target at $
                      {prediction.targetPrice.toFixed(2)} and stop loss at ${prediction.stopLoss.toFixed(2)}.
                      Risk/reward ratio of 1:{riskReward.toFixed(2)}.
                    </>
                  ) : prediction.direction === 'down' ? (
                    <>
                      <span className="font-medium">Sell strategy:</span>{' '}
                      Enter short position at ${selectedCoinData.currentPrice.toFixed(2)} with target at $
                      {prediction.targetPrice.toFixed(2)} and stop loss at ${prediction.stopLoss.toFixed(2)}.
                      Risk/reward ratio of 1:{riskReward.toFixed(2)}.
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Range strategy:</span>{' '}
                      Market likely to remain range-bound between ${(selectedCoinData.currentPrice * 0.98).toFixed(2)} and $
                      {(selectedCoinData.currentPrice * 1.02).toFixed(2)}. Consider range trading strategies.
                    </>
                  )}
                </p>
                <p>
                  <span className="font-medium">Confidence score:</span>{' '}
                  {(prediction.confidence * 100).toFixed(0)}% based on {prediction.indicators.length} technical indicators and historical patterns.
                </p>
                <p>
                  <span className="font-medium">Trade suggestion:</span>{' '}
                  {signalCounts.buy > signalCounts.sell && prediction.probability > 0.65 ? (
                    <Badge className="bg-green-500">STRONG BUY</Badge>
                  ) : signalCounts.buy > signalCounts.sell ? (
                    <Badge variant="outline" className="border-green-500 text-green-500">BUY</Badge>
                  ) : signalCounts.sell > signalCounts.buy && prediction.probability > 0.65 ? (
                    <Badge className="bg-red-500">STRONG SELL</Badge>
                  ) : signalCounts.sell > signalCounts.buy ? (
                    <Badge variant="outline" className="border-red-500 text-red-500">SELL</Badge>
                  ) : (
                    <Badge variant="outline">NEUTRAL/HOLD</Badge>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
