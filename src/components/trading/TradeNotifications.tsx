
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowRightLeft,
  Zap
} from "lucide-react";
import { useAiTrading } from "@/contexts/AiTradingContext";
import { toast } from "@/components/ui/use-toast";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { format } from "date-fns";

// Trade notification types
type NotificationType = 'execution' | 'warning' | 'info';

interface TradeNotification {
  id: string;
  type: NotificationType;
  timestamp: Date;
  title: string;
  message: string;
  coinId?: string;
  amount?: number;
  price?: number;
  botId?: string;
  read: boolean;
}

const TradeNotifications: React.FC = () => {
  const { activeBots } = useAiTrading();
  const { formatValue } = useCurrencyConverter();
  const [notifications, setNotifications] = useState<TradeNotification[]>([]);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  
  // Create a notification
  const createNotification = (
    type: NotificationType, 
    title: string, 
    message: string, 
    data?: { coinId?: string, amount?: number, price?: number, botId?: string }
  ) => {
    const newNotification: TradeNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      timestamp: new Date(),
      title,
      message,
      ...data,
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep at most 50 notifications
    
    // Show toast for new notifications
    toast({
      title: title,
      description: message,
      variant: type === 'warning' ? 'destructive' : 'default'
    });
  };
  
  // Generate sample notifications (for demo purposes)
  useEffect(() => {
    // Initial notifications
    createNotification(
      'execution',
      'Purchase Executed',
      'Successfully purchased 0.25 BTC at $60,245.32',
      { coinId: 'bitcoin', amount: 0.25, price: 60245.32 }
    );
    
    createNotification(
      'warning',
      'Order Cancelled',
      'Sell order for 0.75 ETH cancelled due to price movement',
      { coinId: 'ethereum', amount: 0.75, price: 3010.45 }
    );
    
    createNotification(
      'info',
      'Market Alert',
      'Unusual volume detected in SOL/USD - 150% above average',
      { coinId: 'solana' }
    );
    
    // Poll for AI bot trade notifications
    const intervalId = setInterval(() => {
      if (!isPolling) return;
      
      // Check for active bots with recent trades
      const activeBotIds = Object.keys(activeBots);
      if (activeBotIds.length === 0) return;
      
      // Random chance to create a bot trade notification
      if (Math.random() < 0.3) {
        const randomBotId = activeBotIds[Math.floor(Math.random() * activeBotIds.length)];
        const coinOptions = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'];
        const randomCoin = coinOptions[Math.floor(Math.random() * coinOptions.length)];
        const isBuy = Math.random() > 0.5;
        const amount = parseFloat((Math.random() * (isBuy ? 0.5 : 1.2) + 0.1).toFixed(4));
        const price = randomCoin === 'bitcoin' ? 
          60000 + Math.random() * 5000 : 
          randomCoin === 'ethereum' ? 
            3000 + Math.random() * 200 : 
            100 + Math.random() * 50;
        
        createNotification(
          'execution',
          `Bot ${isBuy ? 'Purchase' : 'Sale'} Executed`,
          `Trading bot ${randomBotId} ${isBuy ? 'bought' : 'sold'} ${amount} ${randomCoin.toUpperCase()} at ${formatValue(price)}`,
          { coinId: randomCoin, amount, price, botId: randomBotId }
        );
      }
    }, 15000); // Check every 15 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isPolling, activeBots, formatValue]);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? {...notification, read: true} : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({...notification, read: true}))
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Trade Notifications
            </CardTitle>
            <CardDescription>Real-time trade execution updates</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>Live</span>
            </Badge>
            <Badge variant="secondary">
              {notifications.filter(n => !n.read).length} Unread
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Last Updated: </span>
            {format(new Date(), 'h:mm:ss a')}
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Notifications will appear here when trades are executed
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border rounded-md ${!notification.read ? 'bg-muted/30' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {notification.type === 'execution' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {notification.type === 'warning' && (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    {notification.type === 'info' && (
                      <ArrowRightLeft className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(notification.timestamp, 'h:mm a')}</span>
                  </div>
                </div>
                
                <p className="text-sm mt-1">{notification.message}</p>
                
                {notification.botId && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="bg-muted px-2 py-1 rounded-full">Bot: {notification.botId}</span>
                    {notification.coinId && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                    {notification.coinId && (
                      <span className="bg-muted px-2 py-1 rounded-full">
                        {notification.coinId.toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeNotifications;
