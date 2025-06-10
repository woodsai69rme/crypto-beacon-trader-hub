
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Wallet, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedAlgorandService } from '@/services/algorand/enhancedAlgorandService';

const AlgorandNetwork: React.FC = () => {
  const { toast } = useToast();
  const [algorandService] = useState(() => new EnhancedAlgorandService());
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkNetworkHealth();
  }, []);

  const checkNetworkHealth = async () => {
    try {
      const health = await algorandService.healthCheck();
      const status = await algorandService.getNetworkStatus();
      setNetworkStatus({ health, status });
    } catch (error) {
      console.error('Network health check failed:', error);
    }
  };

  const lookupAccount = async () => {
    if (!accountAddress.trim()) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Algorand address',
        variant: 'destructive'
      });
      return;
    }

    if (!algorandService.isValidAlgorandAddress(accountAddress)) {
      toast({
        title: 'Invalid Address Format',
        description: 'Please enter a valid Algorand address',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const info = await algorandService.getAccount(accountAddress);
      setAccountInfo(info);
      
      toast({
        title: 'Account Found',
        description: 'Successfully retrieved account information'
      });
    } catch (error) {
      toast({
        title: 'Account Lookup Failed',
        description: 'Could not retrieve account information',
        variant: 'destructive'
      });
      setAccountInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const formatAlgoAmount = (microAlgos: number) => {
    return (microAlgos / 1000000).toFixed(6);
  };

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              networkStatus?.health?.status ? 'bg-green-500' : 'bg-red-500'
            }`} />
            Algorand Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {networkStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {networkStatus.health.status ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {networkStatus.health.status ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Network: </span>
                <Badge variant="secondary">{networkStatus.health.network}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Last Round: </span>
                <span className="font-mono">
                  {networkStatus.status?.['last-round'] || 'N/A'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-pulse text-muted-foreground">
                Checking network status...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Account Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="address">Algorand Address</Label>
              <Input
                id="address"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
                placeholder="Enter Algorand address..."
                className="font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={lookupAccount} disabled={loading}>
                {loading ? 'Looking up...' : 'Lookup'}
              </Button>
            </div>
          </div>

          {accountInfo && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Address</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {accountInfo.address}
                  </div>
                </div>
                <div>
                  <Label>ALGO Balance</Label>
                  <div className="text-lg font-semibold">
                    {formatAlgoAmount(accountInfo.amount)} ALGO
                  </div>
                </div>
              </div>

              {accountInfo.assets && accountInfo.assets.length > 0 && (
                <div>
                  <Label>Assets</Label>
                  <div className="space-y-2 mt-2">
                    {accountInfo.assets.map((asset: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">{asset.name}</span>
                          <span className="text-muted-foreground ml-2">({asset.symbol})</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{asset.amount.toFixed(6)}</div>
                          {asset.valueAUD > 0 && (
                            <div className="text-sm text-muted-foreground">
                              ${asset.valueAUD.toFixed(2)} AUD
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {accountInfo.apps && accountInfo.apps.length > 0 && (
                <div>
                  <Label>Applications</Label>
                  <Badge variant="secondary" className="ml-2">
                    {accountInfo.apps.length} apps
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
            <Button variant="outline" onClick={checkNetworkHealth}>
              Refresh Status
            </Button>
            <Button variant="outline">
              View Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorandNetwork;
