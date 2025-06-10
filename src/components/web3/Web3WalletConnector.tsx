
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletInfo {
  address: string;
  type: 'MetaMask' | 'WalletConnect' | 'Coinbase';
  balance: string;
  connected: boolean;
}

const Web3WalletConnector: React.FC = () => {
  const { toast } = useToast();
  const [connectedWallets, setConnectedWallets] = useState<WalletInfo[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: '🦊',
      available: typeof window !== 'undefined' && (window as any).ethereum
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan with mobile wallet',
      icon: '📱',
      available: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase Wallet',
      icon: '🔵',
      available: true
    }
  ];

  const connectWallet = async (walletId: string) => {
    setConnecting(walletId);
    
    try {
      // Mock connection - in production, this would use real Web3 libraries
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockWallet: WalletInfo = {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        type: walletOptions.find(w => w.id === walletId)?.name as any,
        balance: `${(Math.random() * 10).toFixed(4)} ETH`,
        connected: true
      };
      
      setConnectedWallets(prev => [...prev, mockWallet]);
      
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected ${mockWallet.type}`,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setConnecting(null);
    }
  };

  const disconnectWallet = (address: string) => {
    setConnectedWallets(prev => prev.filter(w => w.address !== address));
    toast({
      title: 'Wallet Disconnected',
      description: 'Wallet has been disconnected',
    });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  return (
    <div className="space-y-6">
      {/* Connected Wallets */}
      {connectedWallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Connected Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedWallets.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{wallet.type}</span>
                        <Badge variant="secondary">Connected</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyAddress(wallet.address)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{wallet.balance}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectWallet(wallet.address)}
                      className="mt-1"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {walletOptions.map((wallet) => (
              <Card key={wallet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-4xl">{wallet.icon}</div>
                    <div>
                      <h3 className="font-semibold">{wallet.name}</h3>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    </div>
                    <Button
                      onClick={() => connectWallet(wallet.id)}
                      disabled={!wallet.available || connecting === wallet.id}
                      className="w-full"
                    >
                      {connecting === wallet.id ? 'Connecting...' : 'Connect'}
                    </Button>
                    {!wallet.available && wallet.id === 'metamask' && (
                      <p className="text-xs text-red-500">MetaMask not detected</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>DeFi Features Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded">
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Cross-chain Bridge</div>
                <div className="text-sm text-muted-foreground">Transfer assets between networks</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">DeFi Portfolio Tracker</div>
                <div className="text-sm text-muted-foreground">Track yields and liquidity positions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Web3WalletConnector;
