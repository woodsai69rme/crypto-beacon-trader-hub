import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { List, ListHeader, ListItem } from '@/components/ui/list';
import {
  AlertCircle,
  CheckCircle,
  Bell,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { PriceAlert, CoinOption } from '@/types/trading';

const PriceAlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      symbol: 'BTC',
      targetPrice: 65000,
      condition: 'above',
      conditionMet: false,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      type: 'price_above'
    },
    {
      id: '2',
      symbol: 'ETH',
      targetPrice: 3000,
      condition: 'below',
      conditionMet: true,
      isActive: false,
      createdAt: '2024-01-14T15:30:00Z',
      type: 'price_below'
    }
  ]);

  const [newAlert, setNewAlert] = useState<Partial<PriceAlert>>({});
  const [selectedCoin, setSelectedCoin] = useState<string>('');

  // Mock coin options with all required properties
  const coinOptions: CoinOption[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 64000, change24h: 2.5, value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2900, change24h: -1.2, value: 'ethereum', label: 'Ethereum (ETH)' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 180, change24h: 3.8, value: 'solana', label: 'Solana (SOL)' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: -0.5, value: 'cardano', label: 'Cardano (ADA)' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.62, change24h: 1.8, value: 'ripple', label: 'XRP (XRP)' }
  ];

  const getAlertStatus = (alert: PriceAlert) => {
    if (!alert.isActive) return 'inactive';
    return alert.conditionMet ? 'triggered' : 'active';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Price Alert System
        </CardTitle>
        <CardDescription>
          Set up and manage price alerts for your favorite cryptocurrencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="coin">Select Coin</Label>
            <Select onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a coin" />
              </SelectTrigger>
              <SelectContent>
                {coinOptions.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetPrice">Target Price</Label>
            <Input
              id="targetPrice"
              type="number"
              placeholder="Enter target price"
              onChange={(e) =>
                setNewAlert({ ...newAlert, targetPrice: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              onValueChange={(value) =>
                setNewAlert({ ...newAlert, condition: value as 'above' | 'below' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="active">Active</Label>
          <Switch
            id="active"
            onCheckedChange={(checked) => setNewAlert({ ...newAlert, isActive: checked })}
          />
        </div>

        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>

        <List>
          <ListHeader>
            <div className="flex items-center justify-between">
              <h3>Current Alerts</h3>
              <p className="text-muted-foreground">
                {alerts.length} active alerts
              </p>
            </div>
          </ListHeader>
          {alerts.map((alert) => (
            <ListItem key={alert.id}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">{alert.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    Target: ${alert.targetPrice}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Condition</p>
                  <p className="text-sm text-muted-foreground">{alert.condition}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <div className="flex items-center gap-2">
                    {getAlertStatus(alert) === 'active' && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Active</span>
                      </>
                    )}
                    {getAlertStatus(alert) === 'triggered' && (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">Triggered</span>
                      </>
                    )}
                    {getAlertStatus(alert) === 'inactive' && (
                      <>
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PriceAlertSystem;
