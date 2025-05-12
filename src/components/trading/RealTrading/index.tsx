
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimePrices from './RealTimePrices';
import { CoinOption } from '@/types/trading';
import { fetchTopCryptoData } from '@/services/cryptoService';
import TradingChart from '../TradingChart';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { ResizablePanel } from '@/components/ui/resizable';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/hooks/use-toast';

const RealTimeTrading: React.FC = () => {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<string>('1d');

  useEffect(() => {
    const loadInitialCoins = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopCryptoData(10);
        setCoins(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        toast({
          title: "Data Loading Error",
          description: "Failed to fetch cryptocurrency data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadInitialCoins();
  }, []);

  const handleSelectCoin = (coinId: string) => {
    setSelectedCoinId(coinId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Trading</CardTitle>
          <CardDescription>
            Track prices and analyze market trends in real-time
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="market" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {selectedCoinId} Price Chart
                          </CardTitle>
                          
                          <div className="flex items-center gap-2">
                            <Select value={timeframe} onValueChange={setTimeframe}>
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1h">1 Hour</SelectItem>
                                <SelectItem value="4h">4 Hours</SelectItem>
                                <SelectItem value="1d">1 Day</SelectItem>
                                <SelectItem value="1w">1 Week</SelectItem>
                                <SelectItem value="1m">1 Month</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={new Date()}
                                  onSelect={() => {}}
                                />
                              </PopoverContent>
                            </Popover>
                            
                            <Button variant="outline" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <TradingChart 
                          coinId={selectedCoinId} 
                          showVolume={true}
                          showControls={true}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <RealTimePrices
                      initialCoins={coins}
                      onSelectCoin={handleSelectCoin}
                      selectedCoinId={selectedCoinId}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trading">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trading Interface</CardTitle>
                      <CardDescription>
                        Place and manage orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Trading interface coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="analysis">
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Analysis</CardTitle>
                      <CardDescription>
                        In-depth market analytics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Market analysis tools coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTrading;
