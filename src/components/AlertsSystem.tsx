
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Just a mock for the alerts system
const mockAlerts = [
  {
    id: 'alert-1',
    title: 'Bitcoin price alert',
    message: 'BTC has increased by 5% in the last hour',
    timestamp: new Date().toISOString(),
    read: false,
    type: 'price',
  },
  {
    id: 'alert-2',
    title: 'Portfolio update',
    message: 'Your portfolio has increased by 3.2% today',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    type: 'portfolio',
  },
  {
    id: 'alert-3',
    title: 'New trading signal',
    message: 'Buy signal detected for ETH/USD',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    type: 'signal',
  }
];

const AlertsSystem: React.FC = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  
  // Count unread notifications
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-auto py-1 px-2" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <DropdownMenuItem 
                key={alert.id} 
                className={`p-0 focus:bg-transparent ${!alert.read ? 'bg-muted/50' : ''}`}
              >
                <div 
                  className="w-full p-3 cursor-default"
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{alert.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlertsSystem;
