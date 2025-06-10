
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Percent, ExternalLink } from 'lucide-react';

interface DeFiPosition {
  protocol: string;
  type: 'lending' | 'staking' | 'liquidity';
  asset: string;
  amount: number;
  apy: number;
  value: number;
  earnings: number;
}

const DeFiDashboard: React.FC = () => {
  const [positions] = useState<DeFiPosition[]>([
    {
      protocol: 'Aave',
      type: 'lending',
      asset: 'USDC',
      amount: 5000,
      apy: 4.2,
      value: 5000,
      earnings: 85.4
    },
    {
      protocol: 'Lido',
      type: 'staking',
      asset: 'ETH',
      amount: 2.5,
      apy: 5.8,
      value: 8750,
      earnings: 203.2
    },
    {
      protocol: 'Uniswap V3',
      type: 'liquidity',
      asset: 'ETH/USDC',
      amount: 1.2,
      apy: 12.4,
      value: 4200,
      earnings: 156.8
    }
  ]);

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalEarnings = positions.reduce((sum, pos) => sum + pos.earnings, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lending': return 'bg-blue-100 text-blue-800';
      case 'staking': return 'bg-green-100 text-green-800';
      case 'liquidity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total DeFi Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">+${totalEarnings.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg APY</p>
                <p className="text-2xl font-bold">7.5%</p>
              </div>
              <Percent className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="w-full">
        <TabsList>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active DeFi Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-sm">{position.protocol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{position.protocol}</span>
                          <Badge className={getTypeColor(position.type)}>
                            {position.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {position.amount} {position.asset}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${position.value.toLocaleString()}</div>
                      <div className="text-sm text-green-600">+${position.earnings.toFixed(2)} ({position.apy}% APY)</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Aave', 'Compound', 'Uniswap', 'Lido', 'Curve', 'SushiSwap'].map((protocol) => (
              <Card key={protocol} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="font-bold">{protocol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{protocol}</h3>
                      <p className="text-sm text-muted-foreground">DeFi Protocol</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Yield Opportunities</h3>
            <p className="text-muted-foreground">Discover high-yield DeFi opportunities coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeFiDashboard;
