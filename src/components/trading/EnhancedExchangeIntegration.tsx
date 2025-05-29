
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Shield, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { exchangeService } from '@/services/exchanges/exchangeService';

const EnhancedExchangeIntegration: React.FC = () => {
  const [exchanges, setExchanges] = useState(exchangeService.getAvailableExchanges());
  const [paperBalances, setPaperBalances] = useState(exchangeService.getPaperBalances());
  const [paperOrders, setPaperOrders] = useState(exchangeService.getPaperOrders());
  const [selectedExchange, setSelectedExchange] = useState('binance');
  const [orderForm, setOrderForm] = useState({
    symbol: 'BTCUSDT',
    side: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: ''
  });

  const handlePlacePaperOrder = async () => {
    try {
      const order = await exchangeService.createPaperOrder(
        selectedExchange,
        orderForm.symbol,
        orderForm.side,
        parseFloat(orderForm.quantity),
        orderForm.price ? parseFloat(orderForm.price) : undefined
      );
      
      setPaperOrders([...paperOrders, order]);
      setOrderForm({ symbol: 'BTCUSDT', side: 'buy', quantity: '', price: '' });
    } catch (error) {
      console.error('Error placing paper order:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Exchange Integration</h2>
        <Badge variant="outline">Paper Trading Mode</Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exchanges.map((exchange) => (
              <Card key={exchange.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exchange.name}</CardTitle>
                    <Badge variant={exchange.apiKey ? 'default' : 'secondary'}>
                      {exchange.apiKey ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${exchange.apiKey ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm text-muted-foreground">
                        {exchange.testnet ? 'Testnet' : 'Mainnet'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {exchange.supportedFeatures.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order (Paper Trading)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symbol">Trading Pair</Label>
                    <Input
                      id="symbol"
                      value={orderForm.symbol}
                      onChange={(e) => setOrderForm({ ...orderForm, symbol: e.target.value })}
                      placeholder="BTCUSDT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="side">Side</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={orderForm.side}
                      onChange={(e) => setOrderForm({ ...orderForm, side: e.target.value as 'buy' | 'sell' })}
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                      placeholder="0.001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                      placeholder="Market Price"
                    />
                  </div>
                </div>

                <Button onClick={handlePlacePaperOrder} className="w-full">
                  Place Paper Order
                </Button>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {paperOrders.slice(-10).reverse().map((order, index) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{order.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.side.toUpperCase()} {order.quantity} @ ${order.price?.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.status === 'filled' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {paperOrders.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No orders yet. Place your first paper trade above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paper Trading Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paperBalances.map((balance) => (
                  <div key={balance.asset} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold">
                        {balance.asset}
                      </div>
                      <div>
                        <p className="font-medium">{balance.asset}</p>
                        <p className="text-sm text-muted-foreground">Available: {balance.free.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{balance.total.toFixed(4)}</p>
                      <p className="text-sm text-muted-foreground">
                        {balance.locked > 0 && `Locked: ${balance.locked.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exchange API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Paper Trading Mode</span>
                </div>
                <p className="text-sm text-yellow-700">
                  You're currently in paper trading mode. No real trades will be executed. 
                  Configure your exchange API keys to enable live trading.
                </p>
              </div>

              {exchanges.map((exchange) => (
                <Card key={exchange.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exchange.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`${exchange.id}-api-key`}>API Key</Label>
                      <Input
                        id={`${exchange.id}-api-key`}
                        type="password"
                        placeholder="Enter your API key"
                        value={exchange.apiKey || ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${exchange.id}-secret`}>Secret Key</Label>
                      <Input
                        id={`${exchange.id}-secret`}
                        type="password"
                        placeholder="Enter your secret key"
                        value={exchange.secretKey || ''}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id={`${exchange.id}-testnet`} checked={exchange.testnet} />
                      <Label htmlFor={`${exchange.id}-testnet`}>Use Testnet</Label>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>Paper Trading Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      exchangeService.clearPaperTradingHistory();
                      setPaperOrders([]);
                    }}
                  >
                    Clear Trading History
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPaperBalances(exchangeService.getPaperBalances())}
                  >
                    Reset Balances
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedExchangeIntegration;
