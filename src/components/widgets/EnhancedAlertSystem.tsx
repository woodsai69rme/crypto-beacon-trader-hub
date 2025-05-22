import React, { useState, useEffect } from 'react';
import { AlertData, PriceAlert, VolumeAlert, TechnicalAlert, AlertFrequency, NotificationMethod, TechnicalAlertFormData } from '@/types/alerts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Bell, Info, Plus, Settings, Trash2 } from 'lucide-react';
import { COIN_OPTIONS, TECHNICAL_INDICATORS, TECHNICAL_CONDITIONS } from '@/components/widgets/AlertComponents/AlertTypes';

// Define dummy alerts for testing
const DUMMY_ALERTS: AlertData[] = [
  {
    id: 'price-alert-1',
    type: 'price',
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    enabled: true,
    notifyVia: ['app', 'email'],
    frequency: 'once',
    createdAt: new Date().toISOString(),
    targetPrice: 60000,
    isAbove: true,
    recurring: false,
    percentageChange: 0
  } as PriceAlert,
  {
    id: 'vol-alert-1',
    type: 'volume',
    coinId: 'ethereum',
    coinName: 'Ethereum',
    coinSymbol: 'ETH',
    enabled: true,
    notifyVia: ['app'],
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    volumeThreshold: 25
  } as VolumeAlert,
  {
    id: 'tech-alert-1',
    type: 'technical',
    coinId: 'solana',
    coinName: 'Solana',
    coinSymbol: 'SOL',
    enabled: false,
    notifyVia: ['app', 'push'],
    frequency: 'once',
    createdAt: new Date().toISOString(),
    indicator: 'RSI',
    condition: 'below',
    value: 30,
    timeframe: '1d'
  } as TechnicalAlert
];

const EnhancedAlertSystem: React.FC = () => {
  // State management
  const [alertType, setAlertType] = useState<'price' | 'volume' | 'technical'>('price');
  const [alerts, setAlerts] = useState<AlertData[]>(DUMMY_ALERTS);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [frequency, setFrequency] = useState<AlertFrequency>('once');
  const [notificationMethods, setNotificationMethods] = useState<NotificationMethod[]>(['app']);
  const [activeTab, setActiveTab] = useState<string>('price');
  const [priceValue, setPriceValue] = useState<string>('');
  const [isAbovePrice, setIsAbovePrice] = useState<boolean>(true);
  const [volumeThreshold, setVolumeThreshold] = useState<string>('');
  const [technicalIndicator, setTechnicalIndicator] = useState<string>('RSI');
  const [technicalCondition, setTechnicalCondition] = useState<string>('above');
  const [technicalValue, setTechnicalValue] = useState<string>('');
  const [technicalTimeframe, setTechnicalTimeframe] = useState<string>('1d');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Reset form when alert type changes
    if (activeTab !== alertType) {
      setActiveTab(alertType);
    }
  }, [alertType, activeTab]);
  
  // Handle toggle notifications method
  const toggleNotificationMethod = (method: NotificationMethod) => {
    if (notificationMethods.includes(method)) {
      setNotificationMethods(notificationMethods.filter(m => m !== method));
    } else {
      setNotificationMethods([...notificationMethods, method]);
    }
  };
  
  // Create a price alert
  const handleCreatePriceAlert = () => {
    if (!priceValue || isNaN(parseFloat(priceValue))) {
      toast({ title: 'Invalid price', description: 'Please enter a valid price' });
      return;
    }
    
    const selectedCoinData = COIN_OPTIONS.find(c => c.id === selectedCoin);
    if (!selectedCoinData) {
      toast({ title: 'Invalid coin', description: 'Please select a valid coin' });
      return;
    }
    
    const newAlert: PriceAlert = {
      id: `price-alert-${Date.now()}`,
      type: 'price',
      coinId: selectedCoinData.id,
      coinName: selectedCoinData.name,
      coinSymbol: selectedCoinData.symbol,
      enabled: true,
      notifyVia: notificationMethods.length > 0 ? notificationMethods : ['app'],
      frequency,
      createdAt: new Date().toISOString(),
      targetPrice: parseFloat(priceValue),
      isAbove: isAbovePrice,
      recurring: frequency !== 'once',
      percentageChange: 0
    };
    
    setAlerts([...alerts, newAlert]);
    resetForm();
    toast({ title: 'Alert created', description: `${selectedCoinData.name} price alert created successfully` });
  };
  
  // Create a volume alert
  const handleCreateVolumeAlert = () => {
    if (!volumeThreshold || isNaN(parseFloat(volumeThreshold))) {
      toast({ title: 'Invalid threshold', description: 'Please enter a valid volume threshold' });
      return;
    }
    
    const selectedCoinData = COIN_OPTIONS.find(c => c.id === selectedCoin);
    if (!selectedCoinData) {
      toast({ title: 'Invalid coin', description: 'Please select a valid coin' });
      return;
    }
    
    const newAlert: VolumeAlert = {
      id: `volume-alert-${Date.now()}`,
      type: 'volume',
      coinId: selectedCoinData.id,
      coinName: selectedCoinData.name,
      coinSymbol: selectedCoinData.symbol,
      enabled: true,
      notifyVia: notificationMethods.length > 0 ? notificationMethods : ['app'],
      frequency,
      createdAt: new Date().toISOString(),
      volumeThreshold: parseFloat(volumeThreshold)
    };
    
    setAlerts([...alerts, newAlert]);
    resetForm();
    toast({ title: 'Alert created', description: `${selectedCoinData.name} volume alert created successfully` });
  };
  
  // Create a technical alert
  const handleCreateTechnicalAlert = () => {
    if (!technicalValue || isNaN(parseFloat(technicalValue))) {
      toast({ title: 'Invalid value', description: 'Please enter a valid indicator value' });
      return;
    }
    
    const selectedCoinData = COIN_OPTIONS.find(c => c.id === selectedCoin);
    if (!selectedCoinData) {
      toast({ title: 'Invalid coin', description: 'Please select a valid coin' });
      return;
    }
    
    const technicalAlertData: TechnicalAlertFormData = {
      type: 'technical',
      coinId: selectedCoinData.id,
      coinName: selectedCoinData.name,
      coinSymbol: selectedCoinData.symbol,
      indicator: technicalIndicator,
      condition: technicalCondition,
      value: parseFloat(technicalValue),
      timeframe: technicalTimeframe,
      enabled: true,
      notifyVia: notificationMethods.length > 0 ? notificationMethods : ['app'],
      frequency
    };
    
    const newAlert: TechnicalAlert = {
      id: `technical-alert-${Date.now()}`,
      type: 'technical',
      coinId: selectedCoinData.id,
      coinName: selectedCoinData.name,
      coinSymbol: selectedCoinData.symbol,
      enabled: true,
      notifyVia: technicalAlertData.notifyVia,
      frequency,
      createdAt: new Date().toISOString(),
      indicator: technicalAlertData.indicator,
      condition: technicalAlertData.condition,
      value: technicalAlertData.value,
      timeframe: technicalAlertData.timeframe
    };
    
    setAlerts([...alerts, newAlert]);
    resetForm();
    toast({ title: 'Alert created', description: `${selectedCoinData.name} technical alert created successfully` });
  };
  
  // Reset form fields
  const resetForm = () => {
    setPriceValue('');
    setVolumeThreshold('');
    setTechnicalValue('');
    setNotificationMethods(['app']);
    setFrequency('once');
    setIsAbovePrice(true);
    setTechnicalIndicator('RSI');
    setTechnicalCondition('above');
    setTechnicalTimeframe('1d');
  };
  
  // Delete an alert
  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({ title: 'Alert deleted', description: 'The alert has been deleted successfully' });
  };
  
  // Toggle alert enabled state
  const toggleAlertEnabled = (id: string, enabled: boolean) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled } : alert
    ));
    toast({ 
      title: enabled ? 'Alert enabled' : 'Alert disabled',
      description: `The alert has been ${enabled ? 'enabled' : 'disabled'}`
    });
  };
  
  // Format alert description for display
  const getAlertDescription = (alert: AlertData): string => {
    switch(alert.type) {
      case 'price':
        const priceAlert = alert as PriceAlert;
        return `Price ${priceAlert.isAbove ? 'above' : 'below'} $${priceAlert.targetPrice.toLocaleString()}`;
      case 'volume':
        const volumeAlert = alert as VolumeAlert;
        return `Volume increase over ${volumeAlert.volumeThreshold}%`;
      case 'technical':
        const technicalAlert = alert as TechnicalAlert;
        return `${technicalAlert.indicator} ${technicalAlert.condition} ${technicalAlert.value} (${technicalAlert.timeframe})`;
      default:
        return '';
    }
  };
  
  // Count active alerts
  const activeAlertCount = alerts.filter(alert => alert.enabled).length;
  
  // Set up tabs for different alert types
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAlertType(value as 'price' | 'volume' | 'technical');
    resetForm();
  };

  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Enhanced Alerts</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
        <CardDescription>Set up alerts for price changes, volume spikes, and technical indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="price">Price Alerts</TabsTrigger>
            <TabsTrigger value="volume">Volume Alerts</TabsTrigger>
            <TabsTrigger value="technical">Technical Alerts</TabsTrigger>
          </TabsList>
          
          {/* Price Alert Form */}
          <TabsContent value="price" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coin">Coin</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a coin" />
                </SelectTrigger>
                <SelectContent>
                  {COIN_OPTIONS.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Target Price</Label>
              <Input type="number" id="price" value={priceValue} onChange={(e) => setPriceValue(e.target.value)} placeholder="Enter target price" />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" active={isAbovePrice} onClick={() => setIsAbovePrice(true)}>Above</Button>
                <Button variant="outline" size="sm" active={!isAbovePrice} onClick={() => setIsAbovePrice(false)}>Below</Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Volume Alert Form */}
          <TabsContent value="volume" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coin">Coin</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a coin" />
                </SelectTrigger>
                <SelectContent>
                  {COIN_OPTIONS.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Volume Threshold (%)</Label>
              <Input type="number" id="volume" value={volumeThreshold} onChange={(e) => setVolumeThreshold(e.target.value)} placeholder="Enter volume threshold" />
            </div>
          </TabsContent>
          
          {/* Technical Alert Form */}
          <TabsContent value="technical" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coin">Coin</Label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a coin" />
                </SelectTrigger>
                <SelectContent>
                  {COIN_OPTIONS.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="indicator">Indicator</Label>
              <Select value={technicalIndicator} onValueChange={setTechnicalIndicator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an indicator" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNICAL_INDICATORS.map(indicator => (
                    <SelectItem key={indicator.id} value={indicator.id}>{indicator.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={technicalCondition} onValueChange={setTechnicalCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a condition" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNICAL_CONDITIONS.map(condition => (
                    <SelectItem key={condition.id} value={condition.id}>{condition.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input type="number" id="value" value={technicalValue} onChange={(e) => setTechnicalValue(e.target.value)} placeholder="Enter value" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={technicalTimeframe} onValueChange={setTechnicalTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="30m">30 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Active Alerts ({activeAlertCount})</h3>
            {alerts.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setAlerts([])}>
                Clear All
              </Button>
            )}
          </div>
          
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
              <p className="text-muted-foreground">No alerts configured yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first alert using the forms above</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded-full ${alert.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {alert.type === 'price' && <Bell className="h-4 w-4" />}
                      {alert.type === 'volume' && <AlertTriangle className="h-4 w-4" />}
                      {alert.type === 'technical' && <Info className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{alert.coinName} ({alert.coinSymbol})</p>
                      <p className="text-sm text-muted-foreground">{getAlertDescription(alert)}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="inline-flex items-center text-xs bg-muted px-1.5 py-0.5 rounded">
                          {alert.frequency}
                        </span>
                        {alert.notifyVia.map(method => (
                          <span key={method} className="inline-flex items-center text-xs bg-muted px-1.5 py-0.5 rounded">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={alert.enabled} 
                      onCheckedChange={(checked) => toggleAlertEnabled(alert.id, checked)} 
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAlert(alert.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          onClick={resetForm}
        >
          Reset Form
        </Button>
        <Button 
          onClick={() => {
            switch(alertType) {
              case 'price': handleCreatePriceAlert(); break;
              case 'volume': handleCreateVolumeAlert(); break;
              case 'technical': handleCreateTechnicalAlert(); break;
            }
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Alert
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedAlertSystem;
