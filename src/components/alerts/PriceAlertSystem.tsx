
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Volume2 } from 'lucide-react';
import { PriceAlert, CoinOption } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

const PriceAlertSystem: React.FC = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      userId: 'user1',
      symbol: 'BTC',
      targetValue: 50000,
      currentValue: 45230,
      conditionMet: false,
      isActive: true,
      notificationSent: false,
      createdAt: '2024-01-15T10:00:00Z',
      type: 'price_above'
    },
    {
      id: '2',
      userId: 'user1',
      symbol: 'ETH',
      targetValue: 3000,
      currentValue: 3105,
      conditionMet: true,
      isActive: true,
      notificationSent: true,
      triggeredAt: '2024-01-16T14:30:00Z',
      createdAt: '2024-01-14T09:00:00Z',
      type: 'price_above'
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetValue: '',
    type: 'price_above' as PriceAlert['type']
  });

  const [availableCoins] = useState<CoinOption[]>([
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 45230, value: 'BTC', label: 'Bitcoin (BTC)' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3105, value: 'ETH', label: 'Ethereum (ETH)' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 95.67, value: 'SOL', label: 'Solana (SOL)' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.65, value: 'ADA', label: 'Cardano (ADA)' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 8.45, value: 'DOT', label: 'Polkadot (DOT)' }
  ]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => {
          const coin = availableCoins.find(c => c.symbol === alert.symbol);
          if (coin) {
            const newPrice = coin.price + (Math.random() - 0.5) * coin.price * 0.02; // ±2% variation
            const conditionMet = checkAlertCondition(alert.type, newPrice, alert.targetValue);
            
            if (conditionMet && !alert.conditionMet && alert.isActive) {
              // Trigger notification
              triggerNotification(alert, newPrice);
              return {
                ...alert,
                currentValue: newPrice,
                conditionMet: true,
                triggeredAt: new Date().toISOString(),
                notificationSent: true
              };
            }
            
            return {
              ...alert,
              currentValue: newPrice
            };
          }
          return alert;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [availableCoins]);

  const checkAlertCondition = (type: PriceAlert['type'], currentPrice: number, targetPrice: number): boolean => {
    switch (type) {
      case 'price_above':
        return currentPrice >= targetPrice;
      case 'price_below':
        return currentPrice <= targetPrice;
      case 'percentage_change':
        // Implementation for percentage change
        return false;
      case 'volume_spike':
        // Implementation for volume spike
        return false;
      default:
        return false;
    }
  };

  const triggerNotification = (alert: PriceAlert, currentPrice: number) => {
    const message = `${alert.symbol} has ${alert.type === 'price_above' ? 'reached' : 'dropped to'} $${currentPrice.toFixed(2)}!`;
    
    toast({
      title: "Price Alert Triggered! 🚨",
      description: message,
    });

    // Send browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('Crypto Price Alert', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.targetValue) {
      toast({
        title: "Invalid Alert",
        description: "Please select a coin and enter a target price.",
        variant: "destructive"
      });
      return;
    }

    const coin = availableCoins.find(c => c.symbol === newAlert.symbol);
    if (!coin) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      userId: 'user1',
      symbol: newAlert.symbol,
      targetValue: parseFloat(newAlert.targetValue),
      currentValue: coin.price,
      conditionMet: false,
      isActive: true,
      notificationSent: false,
      createdAt: new Date().toISOString(),
      type: newAlert.type
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({ symbol: '', targetValue: '', type: 'price_above' });

    toast({
      title: "Alert Created",
      description: `Price alert for ${newAlert.symbol} has been set up.`
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed."
    });
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive browser notifications for price alerts."
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getAlertIcon = (type: PriceAlert['type']) => {
    switch (type) {
      case 'price_above':
        return <TrendingUp className="h-4 w-4" />;
      case 'price_below':
        return <TrendingDown className="h-4 w-4" />;
      case 'volume_spike':
        return <Volume2 className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertDescription = (alert: PriceAlert) => {
    const symbol = alert.symbol;
    const target = formatCurrency(alert.targetValue);
    
    switch (alert.type) {
      case 'price_above':
        return `${symbol} above ${target}`;
      case 'price_below':
        return `${symbol} below ${target}`;
      case 'percentage_change':
        return `${symbol} ±${alert.targetValue}%`;
      case 'volume_spike':
        return `${symbol} volume spike`;
      default:
        return `${symbol} alert`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alert System
          </CardTitle>
          <CardDescription>
            Get notified when your crypto assets hit target prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Browser Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive instant notifications in your browser
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={requestNotificationPermission}
              disabled={Notification.permission === 'granted'}
            >
              {Notification.permission === 'granted' ? 'Enabled' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>Set up a new price alert for any cryptocurrency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coin">Cryptocurrency</Label>
              <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert({ ...newAlert, symbol: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {availableCoins.map(coin => (
                    <SelectItem key={coin.id} value={coin.symbol}>
                      {coin.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Alert Type</Label>
              <Select value={newAlert.type} onValueChange={(value) => setNewAlert({ ...newAlert, type: value as PriceAlert['type'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_above">Price Above</SelectItem>
                  <SelectItem value="price_below">Price Below</SelectItem>
                  <SelectItem value="percentage_change">% Change</SelectItem>
                  <SelectItem value="volume_spike">Volume Spike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                placeholder="Enter target price"
                value={newAlert.targetValue}
                onChange={(e) => setNewAlert({ ...newAlert, targetValue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={createAlert} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </div>

          {newAlert.symbol && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Current {newAlert.symbol} price: {formatCurrency(availableCoins.find(c => c.symbol === newAlert.symbol)?.price || 0)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Price Alerts ({alerts.length})</CardTitle>
          <CardDescription>Manage your active and triggered alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No alerts set up</h3>
              <p className="text-muted-foreground">Create your first price alert to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 border rounded-lg ${alert.conditionMet ? 'border-green-200 bg-green-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className="font-semibold">{alert.symbol}</span>
                      </div>
                      
                      <div className="space-x-2">
                        <Badge variant={alert.conditionMet ? 'default' : 'secondary'}>
                          {alert.conditionMet ? 'Triggered' : 'Active'}
                        </Badge>
                        {!alert.isActive && <Badge variant="outline">Paused</Badge>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Alert:</span>
                      <p className="font-medium">{getAlertDescription(alert)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Price:</span>
                      <p className="font-medium">{formatCurrency(alert.currentValue || 0)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(alert.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className={`font-medium ${alert.conditionMet ? 'text-green-600' : 'text-blue-600'}`}>
                        {alert.conditionMet ? 'Triggered' : 'Monitoring'}
                      </p>
                    </div>
                  </div>

                  {alert.triggeredAt && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <p className="text-sm text-green-800">
                        🎯 Alert triggered on {new Date(alert.triggeredAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.isActive && !a.conditionMet).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Triggered</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.conditionMet).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceAlertSystem;
