
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { deribitService } from '@/services/exchanges/deribitService';
import { useToast } from '@/hooks/use-toast';

const IntegrationSettings: React.FC = () => {
  const { toast } = useToast();
  const [deribitCredentials, setDeribitCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    sandbox: true
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(deribitService.getConnectionStatus());

  const handleDeribitConnect = async () => {
    if (!deribitCredentials.apiKey || !deribitCredentials.apiSecret) {
      toast({
        title: 'Missing Credentials',
        description: 'Please enter both API key and secret',
        variant: 'destructive'
      });
      return;
    }

    setIsConnecting(true);
    try {
      const success = await deribitService.connect(deribitCredentials);
      if (success) {
        setConnectionStatus(deribitService.getConnectionStatus());
        toast({
          title: 'Connected Successfully',
          description: 'Deribit connection established'
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect to Deribit',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'An error occurred while connecting',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Exchange Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deribit Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Deribit</h3>
              <Badge variant={connectionStatus.connected ? 'default' : 'secondary'}>
                {connectionStatus.connected ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
                ) : (
                  <><XCircle className="h-3 w-3 mr-1" /> Disconnected</>
                )}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deribit-api-key">API Key</Label>
                <Input
                  id="deribit-api-key"
                  type="password"
                  value={deribitCredentials.apiKey}
                  onChange={(e) => setDeribitCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter Deribit API Key"
                />
              </div>
              <div>
                <Label htmlFor="deribit-api-secret">API Secret</Label>
                <Input
                  id="deribit-api-secret"
                  type="password"
                  value={deribitCredentials.apiSecret}
                  onChange={(e) => setDeribitCredentials(prev => ({ ...prev, apiSecret: e.target.value }))}
                  placeholder="Enter Deribit API Secret"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={deribitCredentials.sandbox}
                onCheckedChange={(checked) => setDeribitCredentials(prev => ({ ...prev, sandbox: checked }))}
              />
              <Label>Sandbox Mode</Label>
            </div>

            <Button onClick={handleDeribitConnect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect to Deribit'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
