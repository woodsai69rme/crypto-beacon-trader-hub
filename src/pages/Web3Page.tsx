
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Link, Coins, Shield } from 'lucide-react';
import AlgorandNetwork from '@/components/web3/AlgorandNetwork';

const Web3Page: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            Web3 & DeFi Integration
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect wallets, track DeFi positions, and manage on-chain assets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Wallets</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DeFi Positions</p>
                <p className="text-2xl font-bold">$12,847</p>
              </div>
              <Coins className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Protocols</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Link className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlgorandNetwork />
    </div>
  );
};

export default Web3Page;
