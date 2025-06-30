
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, TrendingUp, TrendingDown, DollarSign, 
  Zap, AlertTriangle, CheckCircle, RefreshCw,
  Play, Pause, Settings, BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RealTimeTrading: React.FC = () => {
  const [isTrading, setIsTrading] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [priceData, setPriceData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time trading data
    const interval = setInterval(() => {
      const btcPrice = 67000 + Math.random() * 10000;
      const ethPrice = 3400 + Math.random() * 600;
      
      setRealTimeData({
        btcPrice,
        ethPrice,
        totalValue: 125000 + Math.random() * 25000,
        pnl: 12500 + Math.random() * 5000,
        pnlPercent: 8.5 + Math.random() * 3,
        activeOrders: 3 + Math.floor(Math.random() * 5),
        volume24h: 2500000 + Math.random() * 1000000
      });

      // Update price chart data
      setPriceData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          price: btcPrice,
          volume: Math.random() * 1000000
        };
        return [...prev.slice(-29), newPoint];
      });

      // Simulate order updates
      if (Math.random() > 0.7) {
        const newOrder = {
          id: Date.now(),
          symbol: Math.random() > 0.5 ? 'BTC' : 'ETH',
          side: Math.random() > 0.5 ? 'BUY' : 'SELL',
          amount: (Math.random() * 2).toFixed(4),
          price: Math.random() > 0.5 ? btcPrice : ethPrice,
          status: 'FILLED',
          timestamp: new Date().toLocaleTimeString()
        };
        setOrders(prev => [newOrder, ...prev.slice(0, 9)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initialize positions
    setPositions([
      {
        symbol: 'BTC',
        amount: 1.2456,
        entryPrice: 63250.00,
        currentPrice: realTimeData.btcPrice || 67000,
        pnl: (realTimeData.btcPrice || 67000) - 63250,
        pnlPercent: (((realTimeData.btcPrice || 67000) - 63250) / 63250) * 100
      },
      {
        symbol: 'ETH',
        amount: 8.7543,
        entryPrice: 3180.50,
        currentPrice: realTimeData.ethPrice || 3400,
        pnl: (realTimeData.ethPrice || 3400) - 3180.50,
        pnlPercent: (((realTimeData.ethPrice || 3400) - 3180.50) / 3180.50) * 100
      }
    ]);
  }, [realTimeData]);

  return (
    <div className="space-y-6">
      {/* Woods Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Woods Real-Time Trading - Live Market Access
        </h1>
        <p className="text-muted-foreground">Professional trading interface with real-time data and instant execution</p>
      </div>

      {/* Trading Status Bar */}
      <Card className={`${isTrading ? 'ring-2 ring-green-500' : 'ring-2 ring-gray-300'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isTrading ? (
                  <div className="flex items-center text-green-600">
                    <Activity className="h-5 w-5 mr-2" />
                    <span className="font-semibold">LIVE TRADING</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Pause className="h-5 w-5 mr-2" />
                    <span className="font-semibold">TRADING PAUSED</span>
                  </div>
                )}
              </div>
              <Badge variant={isTrading ? 'default' : 'secondary'}>
                {isTrading ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Account Value</div>
                <div className="text-lg font-bold">${realTimeData.totalValue?.toLocaleString() || '0'}</div>
              </div>
              <Button 
                onClick={() => setIsTrading(!isTrading)}
                variant={isTrading ? "destructive" : "default"}
              >
                {isTrading ? (
                  <><Pause className="h-4 w-4 mr-2" />Stop Trading</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" />Start Trading</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">P&L Today</p>
                <p className="text-2xl font-bold text-green-600">
                  +${realTimeData.pnl?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600">+{realTimeData.pnlPercent?.toFixed(2) || '0'}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">{realTimeData.activeOrders || 0}</p>
                <p className="text-xs text-blue-600">Live execution</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">${(realTimeData.volume24h / 1000000)?.toFixed(1) || '0'}M</p>
                <p className="text-xs text-purple-600">Market activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Market Status</p>
                <p className="text-2xl font-bold text-green-600">OPEN</p>
                <p className="text-xs text-orange-600">24/7 trading</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trading" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trading Form */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Trade - Woods Standard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Asset</label>
                  <Select defaultValue="BTC">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Order Type</label>
                  <Select defaultValue="market">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input type="number" placeholder="0.001" step="0.001" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price (AUD)</label>
                  <Input type="number" placeholder={realTimeData.btcPrice?.toFixed(2) || '67000'} />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-green-600 hover:bg-green-700" disabled={!isTrading}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    BUY
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700" disabled={!isTrading}>
                    <TrendingDown className="h-4 w-4 mr-2" />
                    SELL
                  </Button>
                </div>
                
                {!isTrading && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Trading is paused - Enable to place orders</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Market Data */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Market Prices</span>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        BTC
                      </div>
                      <div>
                        <div className="font-semibold">Bitcoin</div>
                        <div className="text-sm text-muted-foreground">BTC/AUD</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${realTimeData.btcPrice?.toFixed(2) || '67,000'}</div>
                      <div className="text-sm text-green-600">+2.34% (24h)</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        ETH
                      </div>
                      <div>
                        <div className="font-semibold">Ethereum</div>
                        <div className="text-sm text-muted-foreground">ETH/AUD</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${realTimeData.ethPrice?.toFixed(2) || '3,400'}</div>
                      <div className="text-sm text-green-600">+1.87% (24h)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${position.symbol === 'BTC' ? 'bg-orange-500' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                        {position.symbol}
                      </div>
                      <div>
                        <div className="font-semibold">{position.symbol}/AUD</div>
                        <div className="text-sm text-muted-foreground">{position.amount} {position.symbol}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Entry</div>
                      <div className="font-semibold">${position.entryPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Current</div>
                      <div className="font-semibold">${position.currentPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </div>
                      <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={order.side === 'BUY' ? 'default' : 'destructive'}>
                          {order.side}
                        </Badge>
                        <div>
                          <div className="font-semibold">{order.symbol}/AUD</div>
                          <div className="text-sm text-muted-foreground">{order.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{order.amount} {order.symbol}</div>
                        <div className="text-sm text-muted-foreground">${order.price.toFixed(2)}</div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Price Chart - BTC/AUD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']} />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeTrading;
