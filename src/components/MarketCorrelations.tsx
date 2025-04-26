
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, 
  Cell, Rect, Surface
} from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/formatters";
import { CryptoData, fetchTopCoins } from "@/services/cryptoApi";

// Custom Heatmap implementation since recharts doesn't have a built-in Heatmap
const CustomHeatmap = ({ data, width, height, colorScale }: any) => {
  const cellWidth = width / data[0].length;
  const cellHeight = height / data.length;

  return (
    <Surface width={width} height={height}>
      {data.map((row: any, rowIndex: number) => 
        row.map((value: number, colIndex: number) => {
          // Convert correlation value (-1 to 1) to color intensity
          const colorIntensity = Math.abs(value);
          const isPositive = value >= 0;
          const color = isPositive 
            ? `rgba(0, 128, 0, ${colorIntensity})` 
            : `rgba(220, 53, 69, ${colorIntensity})`;
            
          return (
            <Rect
              key={`cell-${rowIndex}-${colIndex}`}
              x={colIndex * cellWidth}
              y={rowIndex * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={color}
              stroke="#fff"
              strokeWidth={1}
            />
          );
        })
      )}
    </Surface>
  );
};

type TimeRange = '7d' | '30d' | '90d';

interface Correlation {
  [key: string]: {
    [key: string]: number;
  };
}

const MarketCorrelations = () => {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [correlations, setCorrelations] = useState<Correlation>({});
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  
  const availableCoins = coins.slice(0, 10);
  
  useEffect(() => {
    fetchCoinsAndCorrelations();
  }, [timeRange]);
  
  const fetchCoinsAndCorrelations = async () => {
    setIsLoading(true);
    try {
      const coinsData = await fetchTopCoins(10);
      setCoins(coinsData);
      
      // Generate mock correlation data (in a real app, this would come from API)
      generateMockCorrelations(coinsData);
    } catch (error) {
      console.error("Failed to fetch correlation data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch correlation data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateMockCorrelations = (coinsData: CryptoData[]) => {
    const mockCorrelations: Correlation = {};
    
    coinsData.forEach((coin1) => {
      mockCorrelations[coin1.id] = {};
      coinsData.forEach((coin2) => {
        if (coin1.id === coin2.id) {
          mockCorrelations[coin1.id][coin2.id] = 1;
        } else {
          // Generate a random correlation value between -1 and 1
          // In a real app, this would be calculated from price movements
          const randomCorrelation = (Math.random() * 2 - 1) * (timeRange === '7d' ? 0.8 : timeRange === '30d' ? 0.6 : 0.4);
          mockCorrelations[coin1.id][coin2.id] = parseFloat(randomCorrelation.toFixed(2));
        }
      });
    });
    
    setCorrelations(mockCorrelations);
  };
  
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    
    if (value > 0) {
      // Green for positive correlations, deeper green for stronger correlation
      return `rgba(0, 128, 0, ${absValue})`;
    } else {
      // Red for negative correlations, deeper red for stronger correlation
      return `rgba(220, 53, 69, ${absValue})`;
    }
  };
  
  const getCorrelationDescription = (value: number) => {
    const absValue = Math.abs(value);
    let strength = "No";
    let direction = "correlation";
    
    if (absValue > 0.7) strength = "Strong";
    else if (absValue > 0.4) strength = "Moderate";
    else if (absValue > 0.1) strength = "Weak";
    
    if (value > 0) direction = "positive correlation";
    else if (value < 0) direction = "negative correlation";
    
    return `${strength} ${direction}`;
  };
  
  const toggleCoinSelection = (coinId: string) => {
    if (selectedCoins.includes(coinId)) {
      setSelectedCoins(selectedCoins.filter(id => id !== coinId));
    } else {
      if (selectedCoins.length < 3) {
        setSelectedCoins([...selectedCoins, coinId]);
      } else {
        toast({
          title: "Selection limit reached",
          description: "You can select up to 3 coins for detailed analysis",
        });
      }
    }
  };
  
  const prepareHeatmapData = () => {
    const coinIds = availableCoins.map(coin => coin.id);
    const heatmapData = coinIds.map(id1 => 
      coinIds.map(id2 => correlations[id1]?.[id2] || 0)
    );
    return heatmapData;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Market Correlations</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={timeRange === '7d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('7d')}
            >
              7D
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('30d')}
            >
              30D
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('90d')}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matrix" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-[100px_1fr] gap-1">
                      <div className=""></div>
                      <div className="grid grid-cols-10">
                        {availableCoins.map((coin) => (
                          <div key={`header-${coin.id}`} className="h-10 flex items-center justify-center">
                            <div className="transform -rotate-45 text-xs font-medium">{coin.symbol}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {availableCoins.map((coin1, index) => (
                      <div key={`row-${coin1.id}`} className="grid grid-cols-[100px_1fr] gap-1">
                        <div className="h-10 flex items-center">
                          <div className="text-xs font-medium">{coin1.symbol}</div>
                        </div>
                        <div className="grid grid-cols-10">
                          {availableCoins.map((coin2) => {
                            const correlation = correlations[coin1.id]?.[coin2.id] || 0;
                            return (
                              <div 
                                key={`${coin1.id}-${coin2.id}`} 
                                className="h-10 flex items-center justify-center"
                                style={{ backgroundColor: getCorrelationColor(correlation) }}
                                title={`${coin1.symbol} vs ${coin2.symbol}: ${correlation} (${getCorrelationDescription(correlation)})`}
                              >
                                <span className="text-xs font-medium text-white drop-shadow-md">
                                  {correlation.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: "rgba(220, 53, 69, 0.8)" }}></div>
                    <span>Strong negative correlation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: "rgba(0, 128, 0, 0.8)" }}></div>
                    <span>Strong positive correlation</span>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Selected Assets</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCoins.map((coin) => (
                    <Button
                      key={coin.id}
                      variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCoinSelection(coin.id)}
                    >
                      {coin.symbol}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedCoins.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-2">Correlation Analysis</h3>
                  <div className="space-y-2">
                    {selectedCoins.map((coin1Id) => {
                      const coin1 = availableCoins.find(c => c.id === coin1Id);
                      if (!coin1) return null;
                      
                      return (
                        <div key={`analysis-${coin1Id}`} className="p-3 border rounded-md">
                          <h4 className="font-medium">{coin1.name} ({coin1.symbol})</h4>
                          <div className="mt-2 space-y-1">
                            {selectedCoins
                              .filter(id => id !== coin1Id)
                              .map((coin2Id) => {
                                const coin2 = availableCoins.find(c => c.id === coin2Id);
                                if (!coin2) return null;
                                
                                const correlation = correlations[coin1Id]?.[coin2Id] || 0;
                                
                                return (
                                  <div key={`pair-${coin1Id}-${coin2Id}`} className="flex justify-between text-sm">
                                    <span>vs {coin2.name} ({coin2.symbol}): </span>
                                    <span className={correlation > 0 ? "text-green-500" : "text-red-500"}>
                                      {correlation.toFixed(2)} - {getCorrelationDescription(correlation)}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                          
                          <div className="mt-3 text-sm text-muted-foreground">
                            <strong>Insight:</strong> {' '}
                            {correlations[coin1Id] && Object.values(correlations[coin1Id]).some(val => val < -0.5) 
                              ? `${coin1.name} shows strong negative correlation with some assets, making it good for portfolio diversification.` 
                              : `${coin1.name} shows mostly positive correlations, suggesting similar price movements to other assets.`
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select up to 3 assets to see detailed correlation analysis.</p>
                </div>
              )}
              
              <div className="p-3 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                <h4 className="font-medium mb-1">What is Correlation?</h4>
                <p>Correlation measures how assets move in relation to each other:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li><strong>Positive correlation (0 to 1):</strong> Assets tend to move in the same direction</li>
                  <li><strong>Negative correlation (0 to -1):</strong> Assets tend to move in opposite directions</li>
                  <li><strong>No correlation (near 0):</strong> Assets move independently of each other</li>
                </ul>
                <p className="mt-2">Diversifying with negatively correlated assets can help reduce portfolio risk.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
