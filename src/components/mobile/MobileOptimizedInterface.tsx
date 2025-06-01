
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu, TrendingUp, TrendingDown, Search, Filter, MoreHorizontal, Bell, Settings } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface MobileOptimizedInterfaceProps {
  children?: React.ReactNode;
}

const MobileOptimizedInterface: React.FC<MobileOptimizedInterfaceProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Mock data for mobile interface
  const quickStats = [
    { label: 'Portfolio', value: '$125,340', change: '+2.1%', trend: 'up' },
    { label: 'Today', value: '+$2,340', change: '+1.9%', trend: 'up' },
    { label: 'Active Bots', value: '3', change: 'Running', trend: 'neutral' }
  ];

  const quickActions = [
    { label: 'Trade', icon: TrendingUp, action: () => {} },
    { label: 'Alerts', icon: Bell, action: () => {}, badge: notifications },
    { label: 'Search', icon: Search, action: () => {} },
    { label: 'Settings', icon: Settings, action: () => {} }
  ];

  const topAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$45,234', change: '+2.3%', trend: 'up' },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,245', change: '+1.8%', trend: 'up' },
    { symbol: 'SOL', name: 'Solana', price: '$125', change: '-0.5%', trend: 'down' },
    { symbol: 'ADA', name: 'Cardano', price: '$0.85', change: '+3.2%', trend: 'up' }
  ];

  if (!isMobile) {
    return <div className="p-4">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Crypto Trader Hub</SheetTitle>
                <SheetDescription>
                  Your comprehensive trading platform
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('overview')}>
                  Overview
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('trading')}>
                  Trading
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('ai-bots')}>
                  AI Bots
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('analytics')}>
                  Analytics
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="font-bold text-lg">Crypto Trader</h1>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-500' : 
                      stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                      {stat.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col gap-2 relative"
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs">{action.label}</span>
              {action.badge && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {action.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Mobile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
            <TabsTrigger value="bots" className="text-xs">Bots</TabsTrigger>
            <TabsTrigger value="more" className="text-xs">More</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-bold">$125,340.23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today's P&L</span>
                    <span className="font-bold text-green-500">+$2,340.12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="font-bold">68.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>BTC Buy Order</span>
                    </div>
                    <span className="text-muted-foreground">2m ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>AI Bot Started</span>
                    </div>
                    <span className="text-muted-foreground">5m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{asset.symbol}</span>
                        </div>
                        <div>
                          <p className="font-medium">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{asset.price}</p>
                        <p className={`text-xs ${asset.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bots" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">AI Trading Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Trend Follower</p>
                      <p className="text-xs text-muted-foreground">BTC/USD • Active</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-500">+12.5%</p>
                      <Badge variant="secondary" className="text-xs">Running</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mean Reversion</p>
                      <p className="text-xs text-muted-foreground">ETH/USD • Active</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-500">+8.3%</p>
                      <Badge variant="secondary" className="text-xs">Running</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="more" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Filter className="h-6 w-6" />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileOptimizedInterface;
