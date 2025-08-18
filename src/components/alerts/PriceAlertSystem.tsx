
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
      coinId: 'bitcoin',
      symbol: 'BTC',
      targetPrice: 65000,
      currentPrice: 64000,
      type: 'above',
      conditionMet: false,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      coinId: 'ethereum',
      symbol: 'ETH',
      targetPrice: 3000,
      currentPrice: 2900,
      type: 'below',
      conditionMet: true,
      isActive: false,
      createdAt: '2024-01-14T15:30:00Z'
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
            <Label htmlFor="type">Condition</Label>
            <Select
              onValueChange={(value) =>
                setNewAlert({ ...newAlert, type: value as 'above' | 'below' })
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

        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Current Alerts</h3>
            <p className="text-muted-foreground">
              {alerts.length} alerts
            </p>
          </div>
          
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{alert.symbol}</p>
                  <p className="text-sm text-muted-foreground">
                    Target: ${alert.targetPrice} ({alert.type})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getAlertStatus(alert) === 'active' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm">Active</span>
                    </>
                  )}
                  {getAlertStatus(alert) === 'triggered' && (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500 text-sm">Triggered</span>
                    </>
                  )}
                  {getAlertStatus(alert) === 'inactive' && (
                    <>
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500 text-sm">Inactive</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAlertSystem;
