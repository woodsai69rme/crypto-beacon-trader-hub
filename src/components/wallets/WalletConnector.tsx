
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletProvider, WalletAccount, WalletConnectionProps } from '@/types/trading';
import { Wallet, Check } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const WalletConnector: React.FC<WalletConnectionProps> = ({ onConnect, supportedWallets }) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  
  const handleConnect = async (wallet: WalletProvider) => {
    setConnecting(wallet.id);
    
    try {
      // Simulated wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if wallet extension is installed
      if (!wallet.isInstalled) {
        window.open(wallet.description, '_blank');
        toast({
          title: "Wallet not installed",
          description: `Please install ${wallet.name} and reload the page`,
          variant: "destructive"
        });
        setConnecting(null);
        return;
      }
      
      // Mock account data - in a real implementation this would use the wallet's API
      const mockAccount: WalletAccount = {
        address: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        balance: (Math.random() * 10).toFixed(4),
        network: "ETH",
        provider: wallet.id
      };
      
      onConnect(mockAccount);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${wallet.name}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${wallet.name}`,
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to start real trading
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportedWallets.map(wallet => (
            <Button
              key={wallet.id}
              variant={wallet.isConnected ? "outline" : "default"}
              className={`flex items-center justify-start gap-3 h-auto py-3 px-4 ${wallet.isConnected ? 'border-green-500' : ''}`}
              onClick={() => handleConnect(wallet)}
              disabled={connecting !== null || wallet.isConnected}
            >
              {wallet.logo && (
                <img src={wallet.logo} alt={wallet.name} className="w-6 h-6" />
              )}
              <div className="flex flex-col items-start">
                <span>{wallet.name}</span>
                <span className="text-xs text-muted-foreground">{wallet.isConnected ? 'Connected' : 'Click to connect'}</span>
              </div>
              {wallet.isConnected && (
                <Check className="ml-auto h-4 w-4 text-green-500" />
              )}
              {connecting === wallet.id && (
                <span className="ml-auto animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnector;
