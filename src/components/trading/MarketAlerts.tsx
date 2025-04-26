
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  BellOff, 
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Alert types
type AlertType = 'price' | 'volume' | 'volatility' | 'technical';

// Alert severity
type AlertSeverity = 'low' | 'medium' | 'high';

// Alert data structure
interface MarketAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  coin: string;
  message: string;
  timestamp: Date;
  read: boolean;
  details?: {
    price?: number;
    change?: number;
    volume?: number;
    indicator?: string;
  };
}

const MarketAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [filter, setFilter] = useState<AlertType | 'all'>('all');
  
  // Initialize with some sample alerts
  useEffect(() => {
    const initialAlerts: MarketAlert[] = [
      {
        id: 'alert-1',
        type: 'price',
        severity: 'high',
        coin: 'Bitcoin',
        message: 'BTC price dropped 5% in the last hour',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        read: false,
        details: {
          price: 58432.21,
          change: -5.2
        }
      },
      {
        id: 'alert-2',
        type: 'volume',
        severity: 'medium',
        coin: 'Ethereum',
        message: 'ETH trading volume 150% above daily average',
        timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
        read: true,
        details: {
          volume: 2500000000
        }
      },
      {
        id: 'alert-3',
        type: 'technical',
        severity: 'low',
        coin: 'Solana',
        message: 'SOL RSI entered oversold territory',
        timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
        read: true,
        details: {
          indicator: 'RSI'
        }
      }
    ];
    
    setAlerts(initialAlerts);
  }, []);
  
  // Simulate receiving new alerts
  useEffect(() => {
    if (!alertsEnabled) return;
    
    const intervalId = setInterval(() => {
      // 30% chance to generate a new alert
      if (Math.random() < 0.3) {
        generateRandomAlert();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [alertsEnabled, alerts]);
  
  // Generate a random alert for demonstration
  const generateRandomAlert = () => {
    const alertTypes: AlertType[] = ['price', 'volume', 'volatility', 'technical'];
    const coins = ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'XRP', 'Polygon'];
    const severities: AlertSeverity[] = ['low', 'medium', 'high'];
    
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const coin = coins[Math.floor(Math.random() * coins.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    let message = '';
    const details: any = {};
    
    // Generate message based on alert type
    switch (type) {
      case 'price': {
        const isPriceUp = Math.random() > 0.5;
        const changePercent = (Math.random() * 8 + 2).toFixed(1); // 2% to 10%
        const basePrice = coin === 'Bitcoin' ? 60000 : coin === 'Ethereum' ? 3000 : 100;
        const price = basePrice * (1 + (isPriceUp ? 0.1 : -0.1) * Math.random());
        
        message = `${coin} price ${isPriceUp ? 'surged' : 'dropped'} ${changePercent}% in the last hour`;
        details.price = price;
        details.change = isPriceUp ? parseFloat(changePercent) : -parseFloat(changePercent);
        break;
      }
      case 'volume': {
        const volumePercent = (Math.random() * 200 + 50).toFixed(0); // 50% to 250%
        const volume = coin === 'Bitcoin' ? 5000000000 : coin === 'Ethereum' ? 2000000000 : 500000000;
        
        message = `${coin} trading volume ${volumePercent}% above daily average`;
        details.volume = volume * (1 + parseInt(volumePercent, 10) / 100);
        break;
      }
      case 'volatility': {
        const volatilityPercent = (Math.random() * 100 + 50).toFixed(0); // 50% to 150%
        
        message = `${coin} volatility increased by ${volatilityPercent}%`;
        break;
      }
      case 'technical': {
        const indicators = ['RSI', 'MACD', 'Moving Average', 'Bollinger Bands'];
        const indicator = indicators[Math.floor(Math.random() * indicators.length)];
        const conditions = ['oversold', 'overbought', 'crossed', 'divergence'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        message = `${coin} ${indicator} entered ${condition} territory`;
        details.indicator = indicator;
        break;
      }
    }
    
    const newAlert: MarketAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      severity,
      coin,
      message,
      timestamp: new Date(),
      read: false,
      details
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show toast for new alert
    toast({
      title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} ${type} Alert`,
      description: message,
      variant: severity === 'high' ? 'destructive' : 'default',
    });
  };
  
  // Mark an alert as read
  const markAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? {...alert, read: true} : alert
      )
    );
  };
  
  // Mark all alerts as read
  const markAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({...alert, read: true}))
    );
  };
  
  // Filter alerts based on selected filter
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Market Alerts
            </CardTitle>
            <CardDescription>Real-time market condition alerts</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={alertsEnabled} 
                onCheckedChange={setAlertsEnabled} 
                id="alerts-mode"
              />
              <label htmlFor="alerts-mode" className="text-sm cursor-pointer">
                {alertsEnabled ? (
                  <span className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    On
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <BellOff className="h-3 w-3" />
                    Off
                  </span>
                )}
              </label>
            </div>
            <Badge variant="secondary">{unreadCount} New</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-1">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'price' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('price')}
              className="flex items-center"
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Price
            </Button>
            <Button 
              variant={filter === 'volume' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setFilter('volume')}
            >
              Volume
            </Button>
            <Button 
              variant={filter === 'technical' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('technical')}
            >
              Technical
            </Button>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No alerts found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Alerts will appear here when market conditions change
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 border rounded-md ${!alert.read ? 'bg-muted/30' : ''}`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'high' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : alert.severity === 'medium' ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <div className="font-medium">{alert.coin}</div>
                      <div className="text-sm">{alert.message}</div>
                    </div>
                  </div>
                  <Badge variant={
                    alert.severity === 'high' ? 'destructive' : 
                    alert.severity === 'medium' ? 'default' : 
                    'outline'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
                
                {alert.details?.change !== undefined && (
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    {alert.details.change >= 0 ? (
                      <TrendingUp className={`h-4 w-4 text-green-500`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 text-red-500`} />
                    )}
                    <span className={alert.details.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {alert.details.change >= 0 ? '+' : ''}{alert.details.change.toFixed(2)}%
                    </span>
                    
                    <span className="text-muted-foreground mx-1">•</span>
                    <span>${alert.details.price?.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketAlerts;
