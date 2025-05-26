
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, Unlink, RefreshCw, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { exchangeService } from '@/services/exchangeService';
import { toast } from "@/hooks/use-toast";

const EnhancedExchangeIntegration: React.FC = () => {
  const [accounts, setAccounts] = useState(exchangeService.getAllAccounts());
  const [selectedExchange, setSelectedExchange] = useState('');
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    sandbox: true
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [orderForm, setOrderForm] = useState({
    accountId: '',
    symbol: 'BTCAUD',
    side: 'buy' as 'buy' | 'sell',
    amount: '',
    price: '',
    type: 'market' as 'market' | 'limit'
  });

  const supportedExchanges = exchangeService.getSupportedExchanges();

  useEffect(() => {
    setAccounts(exchangeService.getAllAccounts());
  }, []);

  const handleConnect = async () => {
    if (!selectedExchange || !credentials.apiKey || !credentials.apiSecret) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      await exchangeService.connectExchange(selectedExchange, {
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret,
        passphrase: credentials.passphrase || undefined,
        sandbox: credentials.sandbox
      });
      
      setAccounts(exchangeService.getAllAccounts());
      setCredentials({ apiKey: '', apiSecret: '', passphrase: '', sandbox: true });
      setSelectedExchange('');
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to exchange",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    await exchangeService.disconnectExchange(accountId);
    setAccounts(exchangeService.getAllAccounts());
  };

  const handleSync = async (accountId: string) => {
    await exchangeService.syncAccount(accountId);
    setAccounts(exchangeService.getAllAccounts());
  };

  const handlePlaceOrder = async () => {
    if (!orderForm.accountId || !orderForm.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required order fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const order = await exchangeService.placeOrder(orderForm.accountId, {
        symbol: orderForm.symbol,
        side: orderForm.side,
        amount: parseFloat(orderForm.amount),
        price: orderForm.price ? parseFloat(orderForm.price) : undefined,
        type: orderForm.type
      });

      toast({
        title: "Order Placed",
        description: `Order ${order.orderId} submitted successfully`,
      });

      // Reset form
      setOrderForm(prev => ({ ...prev, amount: '', price: '' }));
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Enhanced Exchange Integration
        </CardTitle>
        <CardDescription>
          Connect to multiple cryptocurrency exchanges for real trading
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
            <TabsTrigger value="connect">Add Exchange</TabsTrigger>
            <TabsTrigger value="trading">Live Trading</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Exchanges Connected</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your first exchange to start real trading
                </p>
                <Button onClick={() => setSelectedExchange('connect')}>
                  Connect Exchange
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{account.name}</h3>
                          <Badge variant={account.isConnected ? "default" : "secondary"}>
                            {account.isConnected ? "Connected" : "Disconnected"}
                          </Badge>
                          {account.credentials?.sandbox && (
                            <Badge variant="outline">Sandbox</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {supportedExchanges.find(e => e.id === account.exchange)?.name}
                        </p>
                        {account.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last sync: {new Date(account.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(account.id)}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Sync
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(account.id)}
                          className="flex items-center gap-1"
                        >
                          <Unlink className="h-3 w-3" />
                          Disconnect
                        </Button>
                      </div>
                    </div>
                    
                    {account.balances && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(account.balances).map(([asset, balance]) => (
                          <div key={asset} className="text-center p-2 bg-muted rounded">
                            <div className="font-semibold">{asset}</div>
                            <div className="text-sm text-muted-foreground">
                              {typeof balance === 'number' ? balance.toFixed(4) : balance}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="connect" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="exchange-select">Select Exchange</Label>
                <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                  <SelectTrigger id="exchange-select">
                    <SelectValue placeholder="Choose an exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedExchanges.map((exchange) => (
                      <SelectItem key={exchange.id} value={exchange.id}>
                        {exchange.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedExchange && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={credentials.apiKey}
                        onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="Enter your API key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input
                        id="api-secret"
                        type="password"
                        value={credentials.apiSecret}
                        onChange={(e) => setCredentials(prev => ({ ...prev, apiSecret: e.target.value }))}
                        placeholder="Enter your API secret"
                      />
                    </div>
                    {['kucoin', 'coinbase'].includes(selectedExchange) && (
                      <div>
                        <Label htmlFor="passphrase">Passphrase</Label>
                        <Input
                          id="passphrase"
                          type="password"
                          value={credentials.passphrase}
                          onChange={(e) => setCredentials(prev => ({ ...prev, passphrase: e.target.value }))}
                          placeholder="Enter your passphrase"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sandbox"
                        checked={credentials.sandbox}
                        onCheckedChange={(checked) => setCredentials(prev => ({ ...prev, sandbox: checked }))}
                      />
                      <Label htmlFor="sandbox">Use Sandbox Mode (Recommended for testing)</Label>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800">Security Notice</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Your API keys are stored locally and never sent to our servers. 
                          Always use keys with limited permissions (trading only, no withdrawals).
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? "Connecting..." : "Connect Exchange"}
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            {exchangeService.getConnectedAccounts().length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Connected Exchanges</h3>
                <p className="text-muted-foreground">
                  Connect an exchange first to enable live trading
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Place Order</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Exchange Account</Label>
                        <Select value={orderForm.accountId} onValueChange={(value) => setOrderForm(prev => ({ ...prev, accountId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {exchangeService.getConnectedAccounts().map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Trading Pair</Label>
                        <Select value={orderForm.symbol} onValueChange={(value) => setOrderForm(prev => ({ ...prev, symbol: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BTCAUD">BTC/AUD</SelectItem>
                            <SelectItem value="ETHAUD">ETH/AUD</SelectItem>
                            <SelectItem value="ADAAUD">ADA/AUD</SelectItem>
                            <SelectItem value="SOLAUD">SOL/AUD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Side</Label>
                        <Select value={orderForm.side} onValueChange={(value: 'buy' | 'sell') => setOrderForm(prev => ({ ...prev, side: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={orderForm.type} onValueChange={(value: 'market' | 'limit') => setOrderForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market</SelectItem>
                            <SelectItem value="limit">Limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={orderForm.amount}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, amount: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    {orderForm.type === 'limit' && (
                      <div>
                        <Label>Price (AUD)</Label>
                        <Input
                          type="number"
                          value={orderForm.price}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                    )}
                    
                    <Button onClick={handlePlaceOrder} className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Place {orderForm.side.toUpperCase()} Order
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedExchangeIntegration;
