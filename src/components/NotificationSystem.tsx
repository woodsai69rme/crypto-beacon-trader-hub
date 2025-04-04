
import { useState, useEffect } from "react";
import { Bell, BellOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price' | 'news' | 'system';
  read: boolean;
  timestamp: Date;
}

interface PriceAlert {
  id: string;
  coin: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  active: boolean;
}

const NotificationSystem = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const priceAlertForm = useForm({
    defaultValues: {
      coin: "bitcoin",
      symbol: "BTC",
      condition: "above" as const,
      price: 0,
    }
  });
  
  // Generate mock notifications on component mount
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Bitcoin Price Alert",
        message: "Bitcoin has crossed above $42,000",
        type: "price",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
      },
      {
        id: "2",
        title: "Ethereum Update",
        message: "Ethereum 2.0 upgrade successfully deployed",
        type: "news",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
      },
      {
        id: "3",
        title: "Portfolio Update",
        message: "Your portfolio has increased by 5.2% today",
        type: "system",
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
      },
    ];
    
    const mockPriceAlerts: PriceAlert[] = [
      {
        id: "1",
        coin: "bitcoin",
        symbol: "BTC",
        condition: "above",
        price: 45000,
        active: true,
      },
      {
        id: "2",
        coin: "ethereum",
        symbol: "ETH",
        condition: "below",
        price: 1800,
        active: true,
      }
    ];
    
    setNotifications(mockNotifications);
    setPriceAlerts(mockPriceAlerts);
    updateUnreadCount(mockNotifications);
  }, []);
  
  // Update unread count whenever notifications change
  useEffect(() => {
    updateUnreadCount(notifications);
  }, [notifications]);
  
  const updateUnreadCount = (notifications: Notification[]) => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "All notifications marked as read",
    });
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };
  
  const toggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
    });
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const deleteAlert = (id: string) => {
    setPriceAlerts(priceAlerts.filter(alert => alert.id !== id));
    toast({
      title: "Price alert deleted",
    });
  };
  
  const toggleAlert = (id: string) => {
    setPriceAlerts(priceAlerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };
  
  const onAddPriceAlert = (data: any) => {
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      coin: data.coin,
      symbol: data.symbol,
      condition: data.condition,
      price: data.price,
      active: true,
    };
    
    setPriceAlerts([...priceAlerts, newAlert]);
    toast({
      title: "Price alert created",
      description: `${data.symbol} ${data.condition} $${data.price}`,
    });
    priceAlertForm.reset();
  };
  
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };
  
  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'price': return 'bg-blue-500';
      case 'news': return 'bg-green-500';
      case 'system': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  const availableCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "solana", name: "Solana", symbol: "SOL" },
    { id: "cardano", name: "Cardano", symbol: "ADA" },
    { id: "ripple", name: "XRP", symbol: "XRP" },
  ];
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => setIsDialogOpen(true)}
      >
        {notificationsEnabled ? (
          <Bell className="h-5 w-5" />
        ) : (
          <BellOff className="h-5 w-5" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              Stay updated with price alerts and news
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                  className="mr-2"
                />
                <span className="text-xs text-muted-foreground">
                  {notificationsEnabled ? "On" : "Off"}
                </span>
              </div>
            </div>
            
            <TabsContent value="notifications" className="space-y-4">
              {notifications.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </span>
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-3 rounded-md border ${
                          notification.read ? 'bg-background' : 'bg-secondary/30'
                        }`}
                      >
                        <div className={`w-2 h-2 mt-2 rounded-full ${getNotificationTypeColor(notification.type)}`} />
                        
                        <div className="flex-1 min-w-0" onClick={() => markAsRead(notification.id)}>
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="alerts">
              <div className="space-y-4">
                <Form {...priceAlertForm}>
                  <form onSubmit={priceAlertForm.handleSubmit(onAddPriceAlert)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={priceAlertForm.control}
                        name="coin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coin</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedCoin = availableCoins.find(coin => coin.id === value);
                                if (selectedCoin) {
                                  priceAlertForm.setValue('symbol', selectedCoin.symbol);
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select coin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableCoins.map((coin) => (
                                  <SelectItem key={coin.id} value={coin.id}>
                                    {coin.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={priceAlertForm.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="above">Above</SelectItem>
                                <SelectItem value="below">Below</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={priceAlertForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Add Price Alert
                    </Button>
                  </form>
                </Form>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto mt-4">
                  {priceAlerts.length > 0 ? (
                    priceAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={alert.active}
                            onCheckedChange={() => toggleAlert(alert.id)}
                          />
                          <div>
                            <div className="flex items-center">
                              <Badge variant={alert.condition === "above" ? "default" : "destructive"} className="mr-2">
                                {alert.condition}
                              </Badge>
                              <span className="font-medium">${alert.price.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {alert.symbol}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="text-muted-foreground text-sm">No price alerts set</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts even when the app is closed
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={toggleNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <h4 className="font-medium">Price Alerts</h4>
                    <p className="text-xs text-muted-foreground">
                      Notify when coins reach target prices
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <h4 className="font-medium">News Alerts</h4>
                    <p className="text-xs text-muted-foreground">
                      Important news about your watchlist coins
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <h4 className="font-medium">Portfolio Updates</h4>
                    <p className="text-xs text-muted-foreground">
                      Daily summary of portfolio performance
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationSystem;
