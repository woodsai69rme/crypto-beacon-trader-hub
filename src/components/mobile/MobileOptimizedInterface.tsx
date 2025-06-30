
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import { TrendingUp, TrendingDown, Bot, DollarSign, Activity } from 'lucide-react';

interface MobileOptimizedInterfaceProps {
  children?: React.ReactNode;
}

const MobileOptimizedInterface: React.FC<MobileOptimizedInterfaceProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeTab, setActiveTab] = useState('overview');

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Woods Crypto</h1>
            <p className="text-sm text-muted-foreground">AI Trading Platform</p>
          </div>
          <Badge variant="default" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* Mobile Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Portfolio</p>
                <p className="text-lg font-bold">$50,247</p>
                <p className="text-xs text-green-600">+12.5%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Active Bots</p>
                <p className="text-lg font-bold">8</p>
                <p className="text-xs text-blue-600">Running</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="trading" className="text-xs">Trading</TabsTrigger>
            <TabsTrigger value="bots" className="text-xs">Bots</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="sm">
                  <Bot className="h-4 w-4 mr-2" />
                  Start All Bots
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Quick Trade
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Top Performers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['BTC Grid Bot', 'ETH Trend Bot', 'SOL Momentum'].map((bot, index) => (
                  <div key={bot} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{bot}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">+{(15 - index * 3).toFixed(1)}%</p>
                      <Badge variant="secondary" className="text-xs">Live</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { symbol: 'BTC', price: 65432, change: 3.4 },
                  { symbol: 'ETH', price: 3987, change: 2.1 },
                  { symbol: 'SOL', price: 234, change: -1.2 }
                ].map((coin) => (
                  <div key={coin.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{coin.symbol}</p>
                      <p className="text-xs text-muted-foreground">${coin.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {coin.change >= 0 ? '+' : ''}{coin.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bots" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">AI Bots Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Grid Master', status: 'active', return: 15.2 },
                  { name: 'Trend Follower', status: 'active', return: 12.8 },
                  { name: 'Arbitrage Hunter', status: 'paused', return: 8.9 }
                ].map((bot) => (
                  <div key={bot.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{bot.name}</p>
                      <Badge variant={bot.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {bot.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">+{bot.return}%</p>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        {bot.status === 'active' ? 'Pause' : 'Start'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  API Keys
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Risk Management
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {children && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedInterface;
