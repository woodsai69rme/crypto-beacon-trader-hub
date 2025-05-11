import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, ArrowRightLeft, Wallet, LineChart, Bell } from "lucide-react";
import { WalletAccount, WalletProvider, CoinOption } from '@/types/trading';
import WalletConnector from '@/components/wallets/WalletConnector';
import RealTimeTrader from '../RealTimeTrader';
import RealTimePrices from '../RealTimePrices';
import RealTimePriceChart from '../RealTimePriceChart';
import { toast } from "@/components/ui/use-toast";

const SUPPORTED_WALLETS: Partial<WalletProvider>[] = [
  {
    id: "metamask",
    name: "MetaMask",
    logo: "https://metamask.io/images/metamask-fox.svg",
    description: "https://metamask.io/download/",
    isInstalled: true, // In production, we would check if MetaMask is installed
    isConnected: false,
    supportsChains: ["ETH", "BSC", "Polygon"]
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    logo: "https://trustwallet.com/assets/images/favicon.png",
    description: "https://trustwallet.com/",
    isInstalled: true,
    isConnected: false,
    supportsChains: ["ETH", "BSC", "Polygon", "BTC", "SOL"]
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    logo: "https://www.coinbase.com/assets/press/icons/coinbase-icon.svg",
    description: "https://www.coinbase.com/wallet",
    isInstalled: false,
    isConnected: false,
    supportsChains: ["ETH", "BSC", "Polygon", "SOL"]
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    logo: "https://avatars.githubusercontent.com/u/37784886",
    description: "https://walletconnect.com/",
    isInstalled: true,
    isConnected: false,
    supportsChains: ["ETH", "BSC", "Polygon", "SOL", "AVAX"]
  }
];

const initialCoins: CoinOption[] = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 61245.32,
    priceChange: 1200,
    changePercent: 2.3,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "BTC",
    label: "Bitcoin (BTC)" 
  },
  { 
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3010.45,
    priceChange: -120,
    changePercent: -1.5,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    volume: 15000000000,
    marketCap: 360000000000,
    value: "ETH",
    label: "Ethereum (ETH)"
  },
  { 
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 121.33,
    priceChange: 3.56,
    changePercent: 3.1,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    volume: 5200000000,
    marketCap: 90000000000,
    value: "SOL",
    label: "Solana (SOL)"
  }
];

const RealTrading: React.FC = () => {
  const [activeWallet, setActiveWallet] = useState<WalletAccount | null>(null);
  const [wallets, setWallets] = useState<WalletProvider[]>(SUPPORTED_WALLETS);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("bitcoin");
  
  const handleWalletConnect = (account: WalletAccount) => {
    setActiveWallet(account);
    
    // Update wallet status
    setWallets(prev => prev.map(wallet => 
      wallet.id === account.provider 
        ? { ...wallet, isConnected: true }
        : wallet
    ));
  };
  
  const handleTrade = (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => {
    if (!activeWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would integrate with the blockchain via wallet
    // For demo purposes, we'll just simulate the trade
    
    const coin = initialCoins.find(c => c.id === coinId);
    if (!coin) return;
    
    const total = amount * price;
    
    // Simulate transaction time
    toast({
      title: "Transaction Initiated",
      description: `${type === 'buy' ? 'Buying' : 'Selling'} ${amount} ${coin.symbol}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Transaction Successful",
        description: `${type === 'buy' ? 'Bought' : 'Sold'} ${amount} ${coin.symbol} at $${price.toFixed(2)}`,
        variant: "default"
      });
      
      // In a real implementation, we would update the wallet balance
      setActiveWallet(prev => {
        if (!prev) return null;
        
        const newBalance = type === 'buy' 
          ? (parseFloat(prev.balance) - total).toFixed(4)
          : (parseFloat(prev.balance) + total).toFixed(4);
          
        return {
          ...prev,
          balance: newBalance
        };
      });
    }, 2000);
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">Real Trading</CardTitle>
        <CardDescription>
          Trade with real crypto assets using your connected wallet
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-0">
        {!activeWallet ? (
          <WalletConnector 
            supportedWallets={wallets}
            onConnect={handleWalletConnect}
          />
        ) : (
          <>
            <div className="mb-6 p-4 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Connected Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeWallet.address.substring(0, 6)}...{activeWallet.address.substring(activeWallet.address.length - 4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{activeWallet.balance} {activeWallet.network}</div>
                <p className="text-xs text-muted-foreground">Available Balance</p>
              </div>
            </div>
            
            <Tabs defaultValue="trader">
              <TabsList className="mb-6 grid grid-cols-3">
                <TabsTrigger value="trader">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Trader
                </TabsTrigger>
                <TabsTrigger value="chart">
                  <LineChart className="h-4 w-4 mr-2" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="prices">
                  <Bell className="h-4 w-4 mr-2" />
                  Prices
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="trader">
                <RealTimeTrader
                  marketData={initialCoins}
                  selectedCoinId={selectedCoinId}
                  onSelectCoin={setSelectedCoinId}
                />
              </TabsContent>
              
              <TabsContent value="chart">
                <RealTimePriceChart
                  coinId={selectedCoinId}
                  selectedCoinId={selectedCoinId}
                  onSelectCoin={setSelectedCoinId}
                  availableCoins={initialCoins}
                />
              </TabsContent>
              
              <TabsContent value="prices">
                <RealTimePrices
                  initialCoins={initialCoins}
                  selectedCoinId={selectedCoinId}
                  onSelectCoin={setSelectedCoinId}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTrading;
