
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { WalletProvider, WalletAccount } from '@/types/trading';

interface WalletConnectorProps {
  supportedWallets: WalletProvider[];
  onConnect: (account: WalletAccount) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({ supportedWallets, onConnect }) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (wallet: WalletProvider) => {
    setConnecting(wallet.id);
    
    try {
      // Simulate wallet connection
      const mockAccount: WalletAccount = {
        address: '0x' + Math.random().toString(16).slice(2, 42),
        balance: Math.floor(Math.random() * 10000) / 100,
        assets: [],
        network: 'ethereum',
        provider: wallet.id
      };
      
      setTimeout(() => {
        onConnect(mockAccount);
        setConnecting(null);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground">
          Choose a wallet to connect and start trading with real funds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportedWallets.map((wallet) => (
          <Card key={wallet.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <img 
                      src={wallet.logo || wallet.icon} 
                      alt={wallet.name}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{wallet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {wallet.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  {wallet.isInstalled ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Installed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Installed
                    </Badge>
                  )}
                  
                  {wallet.isConnected && (
                    <Badge variant="default">Connected</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {wallet.isInstalled ? (
                  <Button
                    onClick={() => handleConnect(wallet)}
                    disabled={connecting === wallet.id || wallet.isConnected}
                    className="w-full"
                  >
                    {connecting === wallet.id ? (
                      "Connecting..."
                    ) : wallet.isConnected ? (
                      "Connected"
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(wallet.description, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Install {wallet.name}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
          Always verify you're on the correct website before connecting your wallet.
        </p>
      </div>
    </div>
  );
};

export default WalletConnector;
