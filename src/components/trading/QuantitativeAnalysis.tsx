
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { QuantitativeAnalysisProps } from '@/types/trading';

interface TrendIndicator {
  rsi: number;
  macd: number;
  adx: number;
  interpretation?: {
    rsi: string;
    macd: string;
    adx: string;
    overall: string;
  };
}

interface VolatilityIndicator {
  atr: number;
  bbWidth: number;
  historicalVol: number;
  interpretation?: {
    atr: string;
    bbWidth: string;
    historicalVol: string;
    overall: string;
  };
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({
  symbol = "BTC",
  timeframe = "1d",
  depth = 14
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [selectedDepth, setSelectedDepth] = useState<number>(depth);

  // Mock data for trend indicators
  const trendIndicators: TrendIndicator = {
    rsi: 62.4,
    macd: 1.35,
    adx: 24.8,
    interpretation: {
      rsi: "Bullish but approaching overbought conditions",
      macd: "Positive momentum with recent crossover",
      adx: "Moderate trend strength developing",
      overall: "Cautiously bullish, monitor for potential reversal"
    }
  };

  // Mock data for volatility indicators
  const volatilityIndicators: VolatilityIndicator = {
    atr: 1240,
    bbWidth: 4.2,
    historicalVol: 58.3,
    interpretation: {
      atr: "High daily price movement, indicating volatile conditions",
      bbWidth: "Expanded bands suggest increased volatility",
      historicalVol: "Above average volatility compared to 30-day baseline",
      overall: "Increased volatility regime, suggesting possible large price movements"
    }
  };

  // Mock data for price patterns
  const pricePatterns = [
    { name: "Double Bottom", probability: 78, significance: "High" },
    { name: "Bull Flag", probability: 65, significance: "Medium" },
    { name: "Support Level", probability: 82, significance: "High" }
  ];

  // Mock data for historical price
  const historicalData = Array.from({ length: 30 }, (_, i) => {
    const basePrice = 58000;
    const randomWalk = Math.random() > 0.5 ? 1 : -1;
    const volatility = Math.random() * 1000;
    return {
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: basePrice + (i * randomWalk * 100) + (randomWalk * volatility),
      ma20: basePrice + (i * 80),
      ma50: basePrice + (i * 50),
    };
  });

  // Calculate support and resistance levels
  const prices = historicalData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const resistanceLevel = maxPrice - (maxPrice - minPrice) * 0.2;
  const supportLevel = minPrice + (maxPrice - minPrice) * 0.2;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantitative Analysis</CardTitle>
        <CardDescription>
          Advanced technical indicators and statistical analysis
        </CardDescription>
        <div className="flex flex-wrap gap-3 mt-4">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="SOL">SOL</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDepth.toString()} onValueChange={(value) => setSelectedDepth(parseInt(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Depth" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">14 Periods</SelectItem>
              <SelectItem value="21">21 Periods</SelectItem>
              <SelectItem value="50">50 Periods</SelectItem>
              <SelectItem value="200">200 Periods</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="trend">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
            <TabsTrigger value="volatility">Volatility</TabsTrigger>
            <TabsTrigger value="patterns">Price Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">RSI (14)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{trendIndicators.rsi.toFixed(1)}</div>
                  <div className="mt-2 h-2 rounded bg-gray-200">
                    <div 
                      className={`h-full rounded ${trendIndicators.rsi > 70 ? 'bg-red-500' : trendIndicators.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                      style={{ width: `${trendIndicators.rsi}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Oversold (30)</span>
                    <span>Neutral</span>
                    <span>Overbought (70)</span>
                  </div>
                  <p className="text-sm mt-3 text-muted-foreground">
                    {trendIndicators.interpretation?.rsi}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">MACD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{trendIndicators.macd > 0 ? "+" : ""}{trendIndicators.macd.toFixed(2)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-4 h-4 rounded-full ${trendIndicators.macd > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">{trendIndicators.macd > 0 ? 'Bullish' : 'Bearish'} Signal</span>
                  </div>
                  <p className="text-sm mt-3 text-muted-foreground">
                    {trendIndicators.interpretation?.macd}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">ADX (14)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{trendIndicators.adx.toFixed(1)}</div>
                  <div className="mt-2 h-2 rounded bg-gray-200">
                    <div 
                      className={`h-full rounded ${trendIndicators.adx > 50 ? 'bg-green-500' : trendIndicators.adx > 25 ? 'bg-yellow-500' : 'bg-gray-400'}`} 
                      style={{ width: `${Math.min(100, trendIndicators.adx * 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Weak (0-25)</span>
                    <span>Strong (25-50)</span>
                    <span>V. Strong (50+)</span>
                  </div>
                  <p className="text-sm mt-3 text-muted-foreground">
                    {trendIndicators.interpretation?.adx}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Price Action with Moving Averages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 1000', 'dataMax + 1000']} />
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, ""]} />
                      <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="ma20" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="ma50" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                      <ReferenceLine y={resistanceLevel} stroke="#ef4444" strokeDasharray="3 3" />
                      <ReferenceLine y={supportLevel} stroke="#22c55e" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#10b981]" />
                    <span className="text-xs">Price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#3b82f6]" />
                    <span className="text-xs">20 MA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#8b5cf6]" />
                    <span className="text-xs">50 MA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#ef4444]" style={{ width: '12px' }} />
                    <span className="text-xs">Resistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#22c55e]" style={{ width: '12px' }} />
                    <span className="text-xs">Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Trend Analysis Summary</h3>
              <p className="text-sm text-muted-foreground">
                {trendIndicators.interpretation?.overall}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="volatility" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">ATR (14)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">${volatilityIndicators.atr.toFixed(0)}</div>
                  <div className="mt-2 h-2 rounded bg-gray-200">
                    <div 
                      className="h-full rounded bg-blue-500" 
                      style={{ width: '70%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Average</span>
                    <span>High</span>
                  </div>
                  <p className="text-sm mt-3 text-muted-foreground">
                    {volatilityIndicators.interpretation?.atr}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Bollinger Band Width</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{volatilityIndicators.bbWidth.toFixed(1)}</div>
                  <div className="mt-2 h-2 rounded bg-gray-200">
                    <div 
                      className="h-full rounded bg-purple-500" 
                      style={{ width: `${Math.min(100, volatilityIndicators.bbWidth * 18)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Narrow</span>
                    <span>Average</span>
                    <span>Wide</span>
                  </div>
                  <p className="text-sm mt-3 text-muted-foreground">
                    {volatilityIndicators.interpretation?.bbWidth}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Historical Volatility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{volatilityIndicators.historicalVol.toFixed(1)}%</div>
                  <div className="mt-2 h-2 rounded bg-gray-200">
                    <div 
                      className="h-full rounded bg-orange-500" 
                      style={{ width: `${Math.min(100, volatilityIndicators.historicalVol * 1.2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>30d Low</span>
                    <span>30d Avg</span>
                    <span>30d High</span>
                  </div>
                  <p className="text-sm mt-3 text-muted-foreground">
                    {volatilityIndicators.interpretation?.historicalVol}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Volatility Summary</h3>
              <p className="text-sm text-muted-foreground">
                {volatilityIndicators.interpretation?.overall}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Detected Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pricePatterns.map((pattern, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{pattern.name}</div>
                          <div className="text-xs text-muted-foreground">Significance: {pattern.significance}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{pattern.probability}%</div>
                          <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full ${pattern.probability > 75 ? 'bg-green-500' : pattern.probability > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${pattern.probability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Support & Resistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Major Resistance</div>
                      <div className="font-mono text-lg">${(maxPrice + 500).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Minor Resistance</div>
                      <div className="font-mono text-lg">${resistanceLevel.toLocaleString()}</div>
                    </div>
                    <div className="my-2 border-t border-dashed pt-2">
                      <div className="text-sm">Current Price</div>
                      <div className="font-mono text-lg font-bold">${historicalData[historicalData.length - 1].price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Minor Support</div>
                      <div className="font-mono text-lg">${supportLevel.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Major Support</div>
                      <div className="font-mono text-lg">${(minPrice - 500).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Pattern Analysis Summary</h3>
              <p className="text-sm text-muted-foreground">
                Multiple bullish patterns detected with high probability, indicating potential for upward price movement. The double bottom pattern with 78% probability is most significant. Key support and resistance levels are defining a trading range.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
