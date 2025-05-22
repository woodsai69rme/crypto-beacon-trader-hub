
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertType, NotificationMethod, PriceAlert, Alert } from '@/types/trading';
import { Bell, Volume2, TrendingUp, LineChart, Trash } from 'lucide-react';

interface EnhancedAlertSystemProps {
  onCreateAlert?: (alert: Alert) => void;
  onDeleteAlert?: (alertId: string) => void;
  activeAlerts?: Alert[];
}

const EnhancedAlertSystem: React.FC<EnhancedAlertSystemProps> = ({
  onCreateAlert,
  onDeleteAlert,
  activeAlerts = [],
}) => {
  const [selectedCoin, setSelectedCoin] = useState({ id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' });
  const [targetPrice, setTargetPrice] = useState(50000);
  const [isAbove, setIsAbove] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [percentageChange, setPercentageChange] = useState(5);
  const [enabled, setEnabled] = useState(true);
  const [notificationMethods, setNotificationMethods] = useState<NotificationMethod[]>(['app']);

  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 50000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3000 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.20 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150 },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.5 },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 20 },
  ];

  const handleCreatePriceAlert = () => {
    if (onCreateAlert) {
      const alert: PriceAlert = {
        id: `alert-${Date.now()}`,
        type: 'price',
        createdAt: new Date(),
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol,
        targetPrice,
        isAbove,
        enabled: true,
        recurring,
        percentageChange,
        notifyVia: notificationMethods,
      };
      onCreateAlert(alert);
    }
  };

  const handleToggleNotification = (method: NotificationMethod) => {
    setNotificationMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert System</CardTitle>
        <CardDescription>
          Set up price, volume, pattern, or technical alerts for your favorite cryptocurrencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="price" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Price</span>
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              <span className="hidden md:inline">Volume</span>
            </TabsTrigger>
            <TabsTrigger value="pattern" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Pattern</span>
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span className="hidden md:inline">Technical</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Select Cryptocurrency</Label>
                <Select
                  value={selectedCoin.id}
                  onValueChange={(value) => {
                    const coin = coins.find(c => c.id === value);
                    if (coin) setSelectedCoin(coin);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a coin" />
                  </SelectTrigger>
                  <SelectContent>
                    {coins.map((coin) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Price Condition</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select 
                    value={isAbove ? "above" : "below"}
                    onValueChange={(value) => setIsAbove(value === "above")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="col-span-2"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring-alert">Recurring Alert</Label>
                <Switch
                  id="recurring-alert"
                  checked={recurring}
                  onCheckedChange={setRecurring}
                />
              </div>
              
              {recurring && (
                <div>
                  <Label>Percentage Change</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Select
                      value={isAbove ? "increase" : "decrease"}
                      onValueChange={(value) => setIsAbove(value === "increase")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase">Increases</SelectItem>
                        <SelectItem value="decrease">Decreases</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      value={percentageChange}
                      onChange={(e) => setPercentageChange(Number(e.target.value))}
                      className="col-span-2"
                    />
                    
                    <div className="flex items-center">
                      <span>%</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <Label className="block mb-2">Notification Methods</Label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'App', value: 'app' as const },
                    { label: 'Email', value: 'email' as const },
                    { label: 'Push', value: 'push' as const },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`notification-${option.value}`}
                        checked={notificationMethods.includes(option.value)}
                        onCheckedChange={() => handleToggleNotification(option.value)}
                      />
                      <label
                        htmlFor={`notification-${option.value}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleCreatePriceAlert} className="w-full">
                Create Alert
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            <p className="text-muted-foreground">
              Set up alerts for when trading volume exceeds or falls below a certain threshold.
            </p>
            {/* Volume alert form would go here */}
            <Button disabled className="w-full">Coming Soon</Button>
          </TabsContent>
          
          <TabsContent value="pattern" className="space-y-4">
            <p className="text-muted-foreground">
              Get notified when specific chart patterns form, such as Head & Shoulders, Double Tops, etc.
            </p>
            {/* Pattern alert form would go here */}
            <Button disabled className="w-full">Coming Soon</Button>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <p className="text-muted-foreground">
              Create alerts based on technical indicators like RSI, MACD, Moving Averages, etc.
            </p>
            {/* Technical alert form would go here */}
            <Button disabled className="w-full">Coming Soon</Button>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Active Alerts ({activeAlerts.length})</h3>
          
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <p className="mt-2 text-muted-foreground">No active alerts. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">{alert.coinName} ({alert.coinSymbol})</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.type === 'price' && (
                        <span>
                          Price {(alert as PriceAlert).isAbove ? 'above' : 'below'} $
                          {(alert as PriceAlert).targetPrice.toLocaleString()}
                        </span>
                      )}
                      {alert.type === 'volume' && <span>Volume Alert</span>}
                      {alert.type === 'pattern' && <span>Pattern Alert</span>}
                      {alert.type === 'technical' && <span>Technical Alert</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 h-2 w-2 rounded-full" title="Active"></div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteAlert && onDeleteAlert(alert.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAlertSystem;
