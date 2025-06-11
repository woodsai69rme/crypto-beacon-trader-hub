
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellRing, AlertTriangle, TrendingUp, TrendingDown, Volume2, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'price' | 'volume' | 'news' | 'technical';
  symbol: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock alerts data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'price',
        symbol: 'BTC',
        message: 'Bitcoin crossed $65,000 resistance level',
        timestamp: new Date().toISOString(),
        severity: 'high',
        isRead: false
      },
      {
        id: '2',
        type: 'volume',
        symbol: 'ETH',
        message: 'Ethereum volume spike detected - 300% above average',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        severity: 'medium',
        isRead: false
      },
      {
        id: '3',
        type: 'technical',
        symbol: 'SOL',
        message: 'Solana RSI oversold condition detected',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        severity: 'medium',
        isRead: true
      },
      {
        id: '4',
        type: 'news',
        symbol: 'ADA',
        message: 'Major Cardano development announcement',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        severity: 'low',
        isRead: false
      }
    ];

    setAlerts(mockAlerts);
    setUnreadCount(mockAlerts.filter(alert => !alert.isRead).length);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp className="h-4 w-4" />;
      case 'volume': return <Volume2 className="h-4 w-4" />;
      case 'technical': return <AlertTriangle className="h-4 w-4" />;
      case 'news': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, isRead: true }))
    );
    setUnreadCount(0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Real-time Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No alerts at the moment</p>
                <p className="text-sm">You'll be notified when important events occur</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${getSeverityColor(alert.severity)} ${
                    !alert.isRead ? 'shadow-sm' : 'opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {alert.symbol}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {alert.type}
                          </Badge>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <p className="text-xs opacity-75">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
