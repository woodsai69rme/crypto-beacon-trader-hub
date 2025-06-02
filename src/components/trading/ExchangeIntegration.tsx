
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CCXTExchangeConnector from './CCXTExchangeConnector';
import { exchangeService } from '@/services/exchanges/exchangeService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Zap } from 'lucide-react';

const ExchangeIntegration: React.FC = () => {
  const exchanges = exchangeService.getAvailableExchanges();
  const paperBalances = exchangeService.getPaperBalances();
  const paperOrders = exchangeService.getPaperOrders();

  const handleClearPaperHistory = () => {
    exchangeService.clearPaperTradingHistory();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exchange Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="real-exchanges" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="real-exchanges">Real Exchanges (CCXT)</TabsTrigger>
              <TabsTrigger value="paper-trading">Paper Trading</TabsTrigger>
            </TabsList>

            <TabsContent value="real-exchanges">
              <CCXTExchangeConnector />
            </TabsContent>

            <TabsContent value="paper-trading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Paper Trading Environment</h3>
                <Button 
                  variant="outline" 
                  onClick={handleClearPaperHistory}
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Portfolio
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Paper Balances</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {paperBalances.map(balance => (
                      <div key={balance.asset} className="flex justify-between">
                        <span className="font-medium">{balance.asset}</span>
                        <span className="font-mono">{balance.total.toFixed(6)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {paperOrders.slice(-5).map(order => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <Badge variant={order.side === 'buy' ? 'default' : 'secondary'}>
                            {order.side.toUpperCase()}
                          </Badge>
                          <span className="ml-2 text-sm">{order.symbol}</span>
                        </div>
                        <span className="text-sm font-mono">{order.quantity}</span>
                      </div>
                    ))}
                    {paperOrders.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        No orders yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Available Exchanges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {exchanges.map(exchange => (
                      <div key={exchange.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{exchange.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {exchange.supportedFeatures.join(', ')}
                          </div>
                        </div>
                        <Badge variant="outline">
                          <Zap className="h-3 w-3 mr-1" />
                          Paper
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeIntegration;
