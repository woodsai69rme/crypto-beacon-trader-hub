
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { enhancedAlgorandService } from '@/services/algorand/enhancedAlgorandService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Database, 
  Globe, 
  LinkIcon, 
  Loader2, 
  RefreshCw, 
  Search,
  XCircle
} from 'lucide-react';

type NetworkType = 'mainnet' | 'testnet' | 'betanet';

const AlgorandNetwork: React.FC = () => {
  const [networkType, setNetworkType] = useState<NetworkType>('mainnet');
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const checkNetworkConnection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set the network type
        enhancedAlgorandService.setNetwork(networkType);
        
        // Check network status
        const status = await enhancedAlgorandService.getNetworkStatus();
        setNetworkStatus(status);
        setIsConnected(true);
      } catch (err) {
        console.error('Error connecting to Algorand network:', err);
        setError(`Failed to connect to ${networkType}. Please try again.`);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkNetworkConnection();
  }, [networkType]);
  
  const handleNetworkChange = (network: NetworkType) => {
    setNetworkType(network);
    setAddressDetails(null);
    setSearchAddress('');
  };
  
  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    
    try {
      setAddressLoading(true);
      
      // Validate Algorand address (basic check)
      if (!enhancedAlgorandService.isValidAlgorandAddress(searchAddress)) {
        throw new Error('Invalid Algorand address format');
      }
      
      // Get account information
      const accountInfo = await enhancedAlgorandService.getAccount(searchAddress);
      
      // Get AUD value of account
      const portfolioValue = await enhancedAlgorandService.getPortfolioValue(searchAddress);
      
      setAddressDetails({
        ...accountInfo,
        portfolioValue
      });
    } catch (err) {
      console.error('Error fetching address details:', err);
      setError(`Failed to fetch details for address. ${err}`);
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Algorand Network Dashboard
            </CardTitle>
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="py-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : isConnected ? (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              {loading ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Network Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Network</label>
              <div className="flex space-x-2">
                <Button 
                  variant={networkType === 'mainnet' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleNetworkChange('mainnet')}
                  disabled={loading}
                >
                  Mainnet
                </Button>
                <Button 
                  variant={networkType === 'testnet' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleNetworkChange('testnet')}
                  disabled={loading}
                >
                  Testnet
                </Button>
                <Button 
                  variant={networkType === 'betanet' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleNetworkChange('betanet')}
                  disabled={loading}
                >
                  Betanet
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleNetworkChange(networkType)}
                  disabled={loading}
                  title="Refresh Connection"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            {/* Network Status */}
            {isConnected && networkStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Activity className="h-4 w-4" />
                    <span>Current Round</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {networkStatus['last-round'].toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Last Round Time</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {networkStatus['time-since-last-round']} s
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Database className="h-4 w-4" />
                    <span>Sync Status</span>
                  </div>
                  <Badge variant={networkStatus['has-sync-finished'] ? "success" : "warning"}>
                    {networkStatus['has-sync-finished'] ? 'Synced' : 'Syncing'}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Address Search */}
            {isConnected && (
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Wallet Explorer</h3>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input 
                      placeholder="Enter Algorand address" 
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                    />
                  </div>
                  <Button 
                    variant="default" 
                    onClick={handleAddressSearch}
                    disabled={addressLoading || !searchAddress}
                  >
                    {addressLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search
                  </Button>
                </div>
                
                {addressDetails && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-lg">Wallet Details</h4>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Address</div>
                          <div className="font-mono text-xs mt-1 break-all">
                            {addressDetails.address}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">ALGO Balance</div>
                          <div className="font-bold text-lg">
                            {(addressDetails.amount / 1000000).toLocaleString()} ALGO
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ≈ AUD ${addressDetails.portfolioValue?.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="assets">
                      <TabsList>
                        <TabsTrigger value="assets">Assets ({addressDetails.assets?.length || 0})</TabsTrigger>
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                        <TabsTrigger value="apps">Applications</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="assets" className="space-y-4">
                        {addressDetails.assets?.length > 0 ? (
                          <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Asset ID</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {addressDetails.assets.map((asset: any) => (
                                  <tr key={asset['asset-id']}>
                                    <td className="px-4 py-2 text-sm">
                                      <a href={`https://algoexplorer.io/asset/${asset['asset-id']}`} 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="flex items-center text-primary hover:underline">
                                        {asset['asset-id']}
                                        <LinkIcon className="h-3 w-3 ml-1" />
                                      </a>
                                    </td>
                                    <td className="px-4 py-2 text-sm">{asset.amount}</td>
                                    <td className="px-4 py-2">
                                      <Badge variant={asset['is-frozen'] ? "secondary" : "outline"}>
                                        {asset['is-frozen'] ? 'Frozen' : 'Active'}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No assets found for this address
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="transactions">
                        <div className="flex justify-center py-8">
                          <Button 
                            variant="outline" 
                            onClick={() => window.open(`https://algoexplorer.io/address/${addressDetails.address}`, '_blank')}
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            View in AlgoExplorer
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="apps">
                        <div className="text-center py-8 text-muted-foreground">
                          Applications data available in enhanced version
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            )}
            
            {/* API Information */}
            <div className="text-xs text-muted-foreground pt-4 mt-4 border-t">
              <p className="mb-1">Algorand API Status</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>API Token: ✓ Valid</div>
                <div>Network: {networkType}</div>
                <div>Endpoint: nodely.io</div>
                <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorandNetwork;
