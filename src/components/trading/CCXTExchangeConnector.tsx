
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ccxtService } from '@/services/exchanges/ccxtService';
import { useToast } from '@/hooks/use-toast';
import { 
  Plug, 
  Unplug, 
  Eye, 
  EyeOff, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Loader2,
  TrendingUp,
  Wallet
} from 'lucide-react';

const CCXTExchangeConnector: React.FC = () => {
  const [selectedExchange, setSelectedExchange] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  const [sandbox, setSandbox] = useState(true);
  const [showSecrets, setShowSecrets] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedExchanges, setConnectedExchanges] = useState<string[]>([]);
  const [balances, setBalances] = useState<any>({});
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const supportedExchanges = ccxtService.getSupportedExchanges();

  useEffect(() => {
    updateConnectedExchanges();
  }, []);

  const updateConnectedExchanges = () => {
    const connected = ccxtService.getConnectedExchanges();
    setConnectedExchanges(connected);
  };

  const handleConnect = async () => {
    if (!selectedExchange || !apiKey || !secret) {
      toast({
        title: "Missing Information",
        description: "Please fill in exchange, API key, and secret",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    const success = await ccxtService.connectExchange({
      id: selectedExchange,
      name: selectedExchange,
      apiKey,
      secret,
      password: password || undefined,
      sandbox,
      enableRateLimit: true,
    });

    if (success) {
      updateConnectedExchanges();
      setApiKey('');
      setSecret('');
      setPassword('');
      fetchBalance(selectedExchange);
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async (exchangeId: string) => {
    await ccxtService.disconnectExchange(exchangeId);
    updateConnectedExchanges();
    setBalances(prev => {
      const newBalances = { ...prev };
      delete newBalances[exchangeId];
      return newBalances;
    });
  };

  const fetchBalance = async (exchangeId: string) => {
    const balance = await ccxtService.fetchBalance(exchangeId);
    if (balance) {
      setBalances(prev => ({ ...prev, [exchangeId]: balance }));
    }
  };

  const testConnection = async (exchangeId: string) => {
    const result = await ccxtService.testConnection(exchangeId);
    setTestResults(prev => ({ ...prev, [exchangeId]: result }));
  };

  const getBalanceDisplay = (exchangeBalance: any) => {
    if (!exchangeBalance) return null;
    
    const currencies = Object.keys(exchangeBalance)
      .filter(currency => currency !== 'info' && currency !== 'free' && currency !== 'used' && currency !== 'total')
      .filter(currency => exchangeBalance[currency]?.total > 0)
      .slice(0, 5);

    return currencies.map(currency => (
      <div key={currency} className="flex justify-between text-sm">
        <span>{currency}</span>
        <span className="font-mono">{exchangeBalance[currency]?.total?.toFixed(6) || '0'}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            CCXT Exchange Connector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="connect" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connect">Connect Exchange</TabsTrigger>
              <TabsTrigger value="manage">Manage Connected</TabsTrigger>
            </TabsList>

            <TabsContent value="connect" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchange">Exchange</Label>
                  <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exchange" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedExchanges.map(exchange => (
                        <SelectItem key={exchange} value={exchange}>
                          {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sandbox-mode"
                    checked={sandbox}
                    onCheckedChange={setSandbox}
                  />
                  <Label htmlFor="sandbox-mode">Sandbox Mode</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showSecrets ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret">Secret Key</Label>
                  <Input
                    id="secret"
                    type={showSecrets ? "text" : "password"}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter your secret key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passphrase (if required)</Label>
                  <Input
                    id="password"
                    type={showSecrets ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter passphrase (optional)"
                  />
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  {sandbox ? 
                    "🧪 Sandbox mode is enabled. This will connect to the test environment." :
                    "⚠️ Live mode is enabled. Real trades will be executed!"
                  }
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting || !selectedExchange || !apiKey || !secret}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Plug className="mr-2 h-4 w-4" />
                    Connect Exchange
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              {connectedExchanges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No exchanges connected yet
                </div>
              ) : (
                <div className="grid gap-4">
                  {connectedExchanges.map(exchangeId => (
                    <Card key={exchangeId}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {exchangeId.charAt(0).toUpperCase() + exchangeId.slice(1)}
                            </Badge>
                            {testResults[exchangeId] !== undefined && (
                              testResults[exchangeId] ? 
                                <CheckCircle className="h-4 w-4 text-green-500" /> :
                                <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testConnection(exchangeId)}
                            >
                              <TestTube className="h-4 w-4 mr-1" />
                              Test
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchBalance(exchangeId)}
                            >
                              <Wallet className="h-4 w-4 mr-1" />
                              Refresh
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDisconnect(exchangeId)}
                            >
                              <Unplug className="h-4 w-4 mr-1" />
                              Disconnect
                            </Button>
                          </div>
                        </div>

                        {balances[exchangeId] && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Account Balance
                            </h4>
                            <div className="space-y-1">
                              {getBalanceDisplay(balances[exchangeId])}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CCXTExchangeConnector;
