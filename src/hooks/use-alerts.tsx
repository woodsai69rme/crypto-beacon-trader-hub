
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  coinId?: string;
  price?: number;
  condition?: {
    type: 'price' | 'volume' | 'market_cap' | 'change_percentage';
    value: number;
    operator: '>' | '<' | '=' | '>=' | '<=';
    timeframe?: string;
  };
  status: 'active' | 'triggered' | 'expired';
  read: boolean;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  useEffect(() => {
    // Calculate unread count whenever alerts change
    setUnreadCount(alerts.filter(a => !a.read).length);
  }, [alerts]);
  
  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      read: false
    };
    
    setAlerts(prev => [...prev, newAlert]);
    toast({
      title: "Alert Created",
      description: `New ${alert.type} alert has been created.`
    });
    
    return newAlert;
  };
  
  const markAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };
  
  const markAllAsRead = () => {
    setAlerts(prev =>
      prev.map(alert => ({ ...alert, read: true }))
    );
    setUnreadCount(0);
  };
  
  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };
  
  const triggerAlert = (alertId: string, currentPrice: number) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'triggered',
              message: `Alert triggered: ${alert.condition?.type} ${alert.condition?.operator} ${alert.condition?.value} (Current: ${currentPrice})`,
              read: false
            }
          : alert
      )
    );
    
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      toast({
        title: "Alert Triggered",
        description: `${alert.type} alert for ${alert.coinId} has been triggered.`,
        variant: "destructive"
      });
    }
  };
  
  return {
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    markAllAsRead,
    removeAlert,
    triggerAlert
  };
};

export default useAlerts;
