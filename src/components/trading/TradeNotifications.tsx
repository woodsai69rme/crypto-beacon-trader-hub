
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  type: "trade" | "alert" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

const TradeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // Generate a random trade notification
  const generateTradeNotification = () => {
    const tradeType = Math.random() > 0.5 ? "buy" : "sell";
    const tradePair = ["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD", "XRP/USD"][Math.floor(Math.random() * 5)];
    const tradeAmount = (0.1 + Math.random() * 5).toFixed(4);
    const tradePrice = (1000 + Math.random() * 60000).toFixed(2);
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: "trade",
      title: `${tradeType.toUpperCase()} ${tradePair}`,
      message: `${tradeType === "buy" ? "Bought" : "Sold"} ${tradeAmount} ${tradePair.split("/")[0]} at $${tradePrice}`,
      timestamp: new Date(),
      isRead: false,
      priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Keep only last 20
    setUnreadCount(prev => prev + 1);
    
    // Show toast for high priority notifications
    if (newNotification.priority === "high") {
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant: "default"
      });
    }
  };
  
  // Generate a system notification
  const generateSystemNotification = () => {
    const messages = [
      "API connection established",
      "New market data available",
      "Strategy parameters updated",
      "Scheduled maintenance completed",
      "New feature available: Multi-timeframe analysis",
      "Wallet balance updated"
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: "system",
      title: "System Notification",
      message,
      timestamp: new Date(),
      isRead: false,
      priority: "low"
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  };
  
  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === id && !notification.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
        return { ...notification, isRead: true };
      }
      return notification;
    }));
  };
  
  // Time formatting
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than a minute
      return "Just now";
    } else if (diff < 3600000) { // Less than an hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than a day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Initialize with some notifications
  useEffect(() => {
    // Initial notifications
    generateTradeNotification();
    generateSystemNotification();
    
    // Simulate incoming notifications
    const tradeInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        generateTradeNotification();
      }
    }, 15000); // Every 15 seconds
    
    const systemInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        generateSystemNotification();
      }
    }, 45000); // Every 45 seconds
    
    return () => {
      clearInterval(tradeInterval);
      clearInterval(systemInterval);
    };
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} unread</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-2 flex justify-between">
          <div className="text-sm text-muted-foreground">Recent notifications</div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.isRead ? 'bg-muted/40' : 'bg-muted/70'
                } border cursor-pointer transition-colors hover:bg-muted`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between">
                  <div className="font-medium flex items-center gap-2">
                    {notification.type === "trade" && (
                      <Badge variant={notification.message.includes("Bought") ? "default" : "secondary"}>
                        TRADE
                      </Badge>
                    )}
                    {notification.type === "alert" && (
                      <Badge variant="destructive">ALERT</Badge>
                    )}
                    {notification.type === "system" && (
                      <Badge variant="outline">SYSTEM</Badge>
                    )}
                    {notification.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  {notification.message}
                </div>
                {!notification.isRead && (
                  <div className="mt-2 flex justify-end">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No notifications yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeNotifications;
