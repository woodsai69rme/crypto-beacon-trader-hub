import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Check, 
  X, 
  Link,
  Link2Off,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Lock,
  Wallet,
  Trash2
} from "lucide-react";

import { supportedExchanges, exchangeService, type Exchange, type ExchangeCredentials } from "@/services/api/exchangeIntegrations";

const ExchangeIntegration: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>(exchangeService.getAllExchanges());
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  
  const [credentials, setCredentials] = useState<ExchangeCredentials>({
    apiKey: "",
    apiSecret: "",
    passphrase: ""
  });

  const selectedExchange = selectedExchangeId ? 
    exchanges.find(e => e.id === selectedExchangeId) : null;

  const handleRefreshList = () => {
    setExchanges(exchangeService.getAllExchanges());
  };

  const handleConnectExchange = async () => {
    if (!selectedExchangeId) return;

    // Validate form
    if (!credentials.apiKey.trim() || !credentials.apiSecret.trim()) {
      toast({
        title: "Validation Error",
        description: "API Key and Secret are required",
        variant: "destructive"
      });
      return;
    }

    // Connect to exchange
    const success = await exchangeService.connectExchange(selectedExchangeId, credentials);

    if (success) {
      // Update UI
      handleRefreshList();
      setCredentials({ apiKey: "", apiSecret: "", passphrase: "" });
      setFormOpen(false);
    }
  };

  const handleDisconnectExchange = (id: string) => {
    exchangeService.disconnectExchange(id);
    handleRefreshList();
  };

  const handleTestConnection = async (id: string) => {
    await exchangeService.testConnection(id);
  };

  const renderExchangeFeatures = (exchange: Exchange) => {
    const features = exchange.supportedFeatures;
    
    return (
      <div className="flex flex-wrap gap-2">
        {features.spotTrading && <Badge variant="outline">Spot</Badge>}
        {features.marginTrading && <Badge variant="outline">Margin</Badge>}
        {features.futuresTrading && <Badge variant="outline">Futures</Badge>}
        {features.stakingSupport && <Badge variant="outline">Staking</Badge>}
        {features.websocketSupport && <Badge variant="outline">Websocket</Badge>}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exchange Integrations</CardTitle>
        <CardDescription>
          Connect to cryptocurrency exchanges via API to enable trading, data access, and portfolio tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connected">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="available">Available Exchanges</TabsTrigger>
            <TabsTrigger value="settings">API Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Connected Exchanges</h3>
                <Button variant="outline" size="sm" onClick={handleRefreshList}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              {exchanges.filter(e => e.connectionStatus === 'connected').length === 0 ? (
                <div className="border rounded-md p-8 text-center">
                  <KeyRound className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Connected Exchanges</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect to exchanges to enable trading and portfolio tracking.
                  </p>
                  <Button onClick={() => setSelectedExchangeId(supportedExchanges[0]?.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect an Exchange
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exchange</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Connected</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exchanges
                        .filter(exchange => exchange.connectionStatus === 'connected')
                        .map(exchange => (
                          <TableRow key={exchange.id}>
                            <TableCell className="font-medium">{exchange.name}</TableCell>
                            <TableCell>{renderExchangeFeatures(exchange)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                Connected
                              </div>
                            </TableCell>
                            <TableCell>
                              {exchange.lastConnected ? 
                                new Date(exchange.lastConnected).toLocaleDateString() : 
                                'N/A'
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleTestConnection(exchange.id)}
                              >
                                Test
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => handleDisconnectExchange(exchange.id)}
                              >
                                Disconnect
                              </Button>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportedExchanges.map(exchange => {
                const isConnected = exchanges.find(e => e.id === exchange.id)?.connectionStatus === 'connected';
                
                return (
                  <Card key={exchange.id} className="border overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{exchange.name}</div>
                          <Badge variant={isConnected ? "default" : "outline"}>
                            {isConnected ? "Connected" : "Available"}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          {renderExchangeFeatures(exchange)}
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">
                          API Rate Limit: {exchange.supportedFeatures.apiRateLimit} requests/min
                        </div>
                        <div className="flex items-center justify-between">
                          <a 
                            href={exchange.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center text-blue-500 hover:underline"
                          >
                            Visit website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                          
                          <Dialog open={formOpen && selectedExchangeId === exchange.id} onOpenChange={(open) => {
                            setFormOpen(open);
                            if (!open) setSelectedExchangeId(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant={isConnected ? "outline" : "default"}
                                onClick={() => setSelectedExchangeId(exchange.id)}
                              >
                                {isConnected ? (
                                  <>
                                    <Link2Off className="h-4 w-4 mr-1" />
                                    Disconnect
                                  </>
                                ) : (
                                  <>
                                    <Link className="h-4 w-4 mr-1" />
                                    Connect
                                  </>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Connect to {exchange.name}</DialogTitle>
                                <DialogDescription>
                                  Enter your API credentials to connect to {exchange.name}.
                                  You can generate API keys in your exchange account settings.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="flex items-center justify-between">
                                  <a 
                                    href={exchange.apiDocs} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs flex items-center text-blue-500 hover:underline"
                                  >
                                    View API documentation
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                                
                                <div>
                                  <Label htmlFor="api-key">API Key</Label>
                                  <Input 
                                    id="api-key" 
                                    value={credentials.apiKey}
                                    onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                                    placeholder="Enter your API key" 
                                    className="mt-1"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="api-secret">API Secret</Label>
                                  <Input 
                                    id="api-secret" 
                                    type="password"
                                    value={credentials.apiSecret}
                                    onChange={(e) => setCredentials({...credentials, apiSecret: e.target.value})}
                                    placeholder="Enter your API secret" 
                                    className="mt-1"
                                  />
                                </div>
                                
                                {exchange.id === 'coinbase' || exchange.id === 'kraken' ? (
                                  <div>
                                    <Label htmlFor="passphrase">API Passphrase</Label>
                                    <Input 
                                      id="passphrase" 
                                      type="password"
                                      value={credentials.passphrase || ''}
                                      onChange={(e) => setCredentials({
                                        ...credentials, 
                                        passphrase: e.target.value
                                      })}
                                      placeholder="Enter your API passphrase (if required)" 
                                      className="mt-1"
                                    />
                                  </div>
                                ) : null}
                                
                                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md border border-amber-200 dark:border-amber-800 mt-2">
                                  <div className="flex items-start">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                                    <div className="text-sm text-amber-800 dark:text-amber-300">
                                      <p className="font-medium">Important Security Note</p>
                                      <p className="mt-1">
                                        For security, create API keys with read-only or limited permissions.
                                        Never share your API secrets with anyone.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setFormOpen(false);
                                    setSelectedExchangeId(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleConnectExchange}>Connect</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="border rounded-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">API Security Settings</h3>
                </div>
                
                <div className="grid gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Encryption</h4>
                      <p className="text-sm text-muted-foreground">
                        API keys are encrypted in storage
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">IP Restrictions</h4>
                      <p className="text-sm text-muted-foreground">
                        Limit API access to specific IP addresses
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">2FA for Trading</h4>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA confirmation for all trades
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">API Access Controls</h3>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Read Market Data</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        Access to price data and order books
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Allowed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Read Account Data</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        View balances and trade history
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Allowed
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Create Orders</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        Place buy/sell orders on exchanges
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Requires 2FA
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Withdraw Funds</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        Withdraw assets from exchanges
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Blocked
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="border rounded-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">API Key Management</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Automatic API Key Rotation</h4>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Delete All API Keys</h4>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Keys
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExchangeIntegration;
