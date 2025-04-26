import React, { useState, useEffect } from "react";
import { Bell, Plus, Trash, Check, X, ArrowUp, ArrowDown, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean; // true for price above target, false for below
  createdAt: Date;
  enabled: boolean;
  recurring: boolean;
  percentageChange?: number;
  notifyVia: Array<"app" | "email" | "push">;
}

interface VolumeAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  thresholdPercent: number;
  timeframe: "1h" | "4h" | "24h";
  createdAt: Date;
  enabled: boolean;
}

interface TechnicalAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
  createdAt: Date;
  enabled: boolean;
}

type AlertType = PriceAlert | VolumeAlert | TechnicalAlert;

export const createPriceAlert = (formData: any): PriceAlert => {
  return {
    id: `alert-${Date.now()}`,
    createdAt: new Date(),
    coinId: formData.coinId,
    coinName: formData.coinName,
    coinSymbol: formData.coinSymbol,
    targetPrice: formData.targetPrice,
    isAbove: formData.isAbove,
    enabled: true,
    recurring: formData.recurring,
    percentageChange: formData.percentageChange || 0,
    notifyVia: formData.notifyVia as ("email" | "app" | "push")[]
  };
};

const EnhancedAlertSystem = () => {
  const { activeCurrency, formatValue } = useCurrencyConverter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("price");
  const [activeFilterTab, setActiveFilterTab] = useState<string>("all");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  // Price alert state
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [newPriceAlert, setNewPriceAlert] = useState({
    coinId: "bitcoin",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    targetPrice: 0,
    isAbove: true,
    enabled: true,
    recurring: false,
    percentageChange: 0,
    notifyVia: ["app"]
  });

  // Volume alert state
  const [volumeAlerts, setVolumeAlerts] = useState<VolumeAlert[]>([]);
  const [newVolumeAlert, setNewVolumeAlert] = useState({
    coinId: "bitcoin",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    thresholdPercent: 15,
    timeframe: "1h" as const,
    enabled: true
  });

  // Technical alert state
  const [technicalAlerts, setTechnicalAlerts] = useState<TechnicalAlert[]>([]);
  const [newTechnicalAlert, setNewTechnicalAlert] = useState({
    coinId: "bitcoin",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    indicator: "RSI",
    condition: "above",
    value: 70,
    enabled: true
  });
  
  // Load alerts from localStorage
  useEffect(() => {
    const savedPriceAlerts = localStorage.getItem("priceAlerts");
    const savedVolumeAlerts = localStorage.getItem("volumeAlerts");
    const savedTechnicalAlerts = localStorage.getItem("technicalAlerts");
    const savedAlertsEnabled = localStorage.getItem("alertsEnabled");
    
    if (savedPriceAlerts) {
      try {
        setPriceAlerts(JSON.parse(savedPriceAlerts));
      } catch (error) {
        console.error("Failed to load price alerts:", error);
      }
    }
    
    if (savedVolumeAlerts) {
      try {
        setVolumeAlerts(JSON.parse(savedVolumeAlerts));
      } catch (error) {
        console.error("Failed to load volume alerts:", error);
      }
    }
    
    if (savedTechnicalAlerts) {
      try {
        setTechnicalAlerts(JSON.parse(savedTechnicalAlerts));
      } catch (error) {
        console.error("Failed to load technical alerts:", error);
      }
    }
    
    if (savedAlertsEnabled) {
      setAlertsEnabled(JSON.parse(savedAlertsEnabled));
    }
  }, []);

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("priceAlerts", JSON.stringify(priceAlerts));
    localStorage.setItem("volumeAlerts", JSON.stringify(volumeAlerts));
    localStorage.setItem("technicalAlerts", JSON.stringify(technicalAlerts));
    localStorage.setItem("alertsEnabled", JSON.stringify(alertsEnabled));
  }, [priceAlerts, volumeAlerts, technicalAlerts, alertsEnabled]);
  
  // Check alerts against current prices (simulation)
  useEffect(() => {
    if (!alertsEnabled) return;
    
    const checkInterval = setInterval(() => {
      // In a real implementation, we'd fetch current prices here
      const currentPrices = { 
        bitcoin: Math.random() * 50000 + 20000,
        ethereum: Math.random() * 3000 + 1500,
        solana: Math.random() * 100 + 50,
        cardano: Math.random() * 1 + 0.3,
        ripple: Math.random() * 1 + 0.3
      };
      
      // Check price alerts
      priceAlerts.forEach(alert => {
        if (!alert.enabled) return;
        
        const currentPrice = currentPrices[alert.coinId as keyof typeof currentPrices];
        if (currentPrice && 
            ((alert.isAbove && currentPrice > alert.targetPrice) || 
             (!alert.isAbove && currentPrice < alert.targetPrice))) {
          toast({
            title: "Price Alert!",
            description: `${alert.coinName} is now ${alert.isAbove ? "above" : "below"} ${formatValue(alert.targetPrice)}`,
          });
          
          // Disable non-recurring alerts after triggering
          if (!alert.recurring) {
            setPriceAlerts(prev => 
              prev.map(a => a.id === alert.id ? {...a, enabled: false} : a)
            );
          }
        }
      });
      
      // Simulate checking volume alerts (in a real app, we'd fetch actual volume data)
      volumeAlerts.forEach(alert => {
        if (!alert.enabled) return;
        
        // Random chance to trigger volume alert for simulation
        if (Math.random() > 0.95) {
          const currentVolume = alert.thresholdPercent * 1.2; // Just for simulation
          toast({
            title: "Volume Alert!",
            description: `${alert.coinName} ${alert.timeframe} volume increased by ${currentVolume.toFixed(1)}%`,
          });
        }
      });
      
      // Simulate checking technical alerts
      technicalAlerts.forEach(alert => {
        if (!alert.enabled) return;
        
        // Random chance to trigger technical alert for simulation
        if (Math.random() > 0.95) {
          toast({
            title: "Technical Alert!",
            description: `${alert.coinName} ${alert.indicator} is now ${alert.condition} ${alert.value}`,
          });
        }
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(checkInterval);
  }, [priceAlerts, volumeAlerts, technicalAlerts, alertsEnabled, formatValue]);
  
  const addPriceAlert = () => {
    if (newPriceAlert.targetPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price target",
        variant: "destructive",
      });
      return;
    }
    
    const alert: PriceAlert = {
      id: Date.now().toString(),
      ...newPriceAlert,
      createdAt: new Date()
    };
    
    setPriceAlerts([...priceAlerts, alert]);
    setNewPriceAlert({
      ...newPriceAlert,
      targetPrice: 0
    });
    
    toast({
      title: "Alert Created",
      description: `You'll be notified when ${alert.coinName} is ${alert.isAbove ? "above" : "below"} ${formatValue(alert.targetPrice)}`,
    });
  };
  
  const addVolumeAlert = () => {
    if (newVolumeAlert.thresholdPercent <= 0) {
      toast({
        title: "Invalid Volume Threshold",
        description: "Please enter a valid volume percentage",
        variant: "destructive",
      });
      return;
    }
    
    const alert: VolumeAlert = {
      id: Date.now().toString(),
      ...newVolumeAlert,
      createdAt: new Date()
    };
    
    setVolumeAlerts([...volumeAlerts, alert]);
    
    toast({
      title: "Volume Alert Created",
      description: `You'll be notified when ${alert.coinName} ${alert.timeframe} volume increases by ${alert.thresholdPercent}%`,
    });
  };
  
  const addTechnicalAlert = () => {
    const alert: TechnicalAlert = {
      id: Date.now().toString(),
      ...newTechnicalAlert,
      createdAt: new Date()
    };
    
    setTechnicalAlerts([...technicalAlerts, alert]);
    
    toast({
      title: "Technical Alert Created",
      description: `You'll be notified when ${alert.coinName} ${alert.indicator} is ${alert.condition} ${alert.value}`,
    });
  };
  
  const removePriceAlert = (id: string) => {
    setPriceAlerts(alerts => alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "Price alert has been removed",
    });
  };
  
  const removeVolumeAlert = (id: string) => {
    setVolumeAlerts(alerts => alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "Volume alert has been removed",
    });
  };
  
  const removeTechnicalAlert = (id: string) => {
    setTechnicalAlerts(alerts => alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "Technical alert has been removed",
    });
  };
  
  const toggleAlertEnabled = (type: 'price' | 'volume' | 'technical', id: string) => {
    if (type === 'price') {
      setPriceAlerts(alerts => 
        alerts.map(alert => 
          alert.id === id ? {...alert, enabled: !alert.enabled} : alert
        )
      );
    } else if (type === 'volume') {
      setVolumeAlerts(alerts => 
        alerts.map(alert => 
          alert.id === id ? {...alert, enabled: !alert.enabled} : alert
        )
      );
    } else if (type === 'technical') {
      setTechnicalAlerts(alerts => 
        alerts.map(alert => 
          alert.id === id ? {...alert, enabled: !alert.enabled} : alert
        )
      );
    }
  };
  
  const toggleGlobalAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    toast({
      title: alertsEnabled ? "Alerts Disabled" : "Alerts Enabled",
      description: alertsEnabled 
        ? "All alerts have been disabled" 
        : "All alerts have been enabled",
    });
  };

  const getTotalAlertsCount = () => {
    return priceAlerts.length + volumeAlerts.length + technicalAlerts.length;
  };
  
  const getActiveAlertsCount = () => {
    return priceAlerts.filter(a => a.enabled).length 
      + volumeAlerts.filter(a => a.enabled).length
      + technicalAlerts.filter(a => a.enabled).length;
  };
  
  const getFilteredAlerts = () => {
    switch (activeFilterTab) {
      case 'all':
        return [
          ...priceAlerts.map(a => ({ ...a, type: 'price' as const })),
          ...volumeAlerts.map(a => ({ ...a, type: 'volume' as const })),
          ...technicalAlerts.map(a => ({ ...a, type: 'technical' as const }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'active':
        return [
          ...priceAlerts.filter(a => a.enabled).map(a => ({ ...a, type: 'price' as const })),
          ...volumeAlerts.filter(a => a.enabled).map(a => ({ ...a, type: 'volume' as const })),
          ...technicalAlerts.filter(a => a.enabled).map(a => ({ ...a, type: 'technical' as const }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price':
        return priceAlerts.map(a => ({ ...a, type: 'price' as const }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'volume':
        return volumeAlerts.map(a => ({ ...a, type: 'volume' as const }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'technical':
        return technicalAlerts.map(a => ({ ...a, type: 'technical' as const }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return [];
    }
  };
  
  const renderAlertItem = (alert: any) => {
    switch(alert.type) {
      case 'price':
        return (
          <div key={alert.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="font-medium">{alert.coinName} ({alert.coinSymbol})</span>
                {alert.recurring && <Badge variant="outline">Recurring</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Price {alert.isAbove ? "above" : "below"} {formatValue(alert.targetPrice)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleAlertEnabled('price', alert.id)}
                className="h-8 w-8"
              >
                {alert.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePriceAlert(alert.id)}
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      case 'volume':
        return (
          <div key={alert.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="font-medium">{alert.coinName} ({alert.coinSymbol})</span>
                <Badge variant="outline">Volume</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.timeframe} volume increase of {alert.thresholdPercent}%+
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleAlertEnabled('volume', alert.id)}
                className="h-8 w-8"
              >
                {alert.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVolumeAlert(alert.id)}
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      case 'technical':
        return (
          <div key={alert.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="font-medium">{alert.coinName} ({alert.coinSymbol})</span>
                <Badge variant="outline">Technical</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.indicator} {alert.condition} {alert.value}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleAlertEnabled('technical', alert.id)}
                className="h-8 w-8"
              >
                {alert.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTechnicalAlert(alert.id)}
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {getTotalAlertsCount() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {getActiveAlertsCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Price Alerts</SheetTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="alerts-enabled" className="text-xs">Alerts {alertsEnabled ? 'On' : 'Off'}</Label>
            <Switch id="alerts-enabled" checked={alertsEnabled} onCheckedChange={toggleGlobalAlerts} />
          </div>
        </SheetHeader>
        
        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Coin</label>
                      <Select
                        value={newPriceAlert.coinId}
                        onValueChange={(value) => {
                          const coinMap: Record<string, { name: string, symbol: string }> = {
                            bitcoin: { name: "Bitcoin", symbol: "BTC" },
                            ethereum: { name: "Ethereum", symbol: "ETH" },
                            solana: { name: "Solana", symbol: "SOL" },
                            cardano: { name: "Cardano", symbol: "ADA" },
                            ripple: { name: "XRP", symbol: "XRP" }
                          };
                          
                          setNewPriceAlert({ 
                            ...newPriceAlert, 
                            coinId: value,
                            coinName: coinMap[value].name,
                            coinSymbol: coinMap[value].symbol
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="solana">Solana (SOL)</SelectItem>
                          <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                          <SelectItem value="ripple">XRP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Alert me when price is</label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={newPriceAlert.isAbove ? "above" : "below"}
                          onValueChange={(value) => setNewPriceAlert({ 
                            ...newPriceAlert, 
                            isAbove: value === "above"
                          })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="above">Above</SelectItem>
                            <SelectItem value="below">Below</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {activeCurrency === "USD" ? "$" : "A$"}
                            </span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              className="pl-6"
                              value={newPriceAlert.targetPrice || ""}
                              onChange={(e) => setNewPriceAlert({ 
                                ...newPriceAlert, 
                                targetPrice: parseFloat(e.target.value) || 0 
                              })}
                              placeholder="Enter price"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="recurring"
                          checked={newPriceAlert.recurring}
                          onCheckedChange={(checked) => setNewPriceAlert({
                            ...newPriceAlert,
                            recurring: checked
                          })}
                        />
                        <Label htmlFor="recurring">Recurring Alert</Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {newPriceAlert.recurring 
                          ? "Alert will trigger repeatedly" 
                          : "Alert will trigger once"}
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <label className="text-sm font-medium mb-2 block">Notification Methods</label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={newPriceAlert.notifyVia.includes("app") ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newNotifyVia = newPriceAlert.notifyVia.includes("app")
                              ? newPriceAlert.notifyVia.filter(v => v !== "app")
                              : [...newPriceAlert.notifyVia, "app"];
                            setNewPriceAlert({ ...newPriceAlert, notifyVia: newNotifyVia });
                          }}
                        >
                          App
                        </Button>
                        <Button
                          variant={newPriceAlert.notifyVia.includes("email") ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newNotifyVia = newPriceAlert.notifyVia.includes("email")
                              ? newPriceAlert.notifyVia.filter(v => v !== "email")
                              : [...newPriceAlert.notifyVia, "email"];
                            setNewPriceAlert({ ...newPriceAlert, notifyVia: newNotifyVia });
                          }}
                        >
                          Email
                        </Button>
                        <Button
                          variant={newPriceAlert.notifyVia.includes("push") ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newNotifyVia = newPriceAlert.notifyVia.includes("push")
                              ? newPriceAlert.notifyVia.filter(v => v !== "push")
                              : [...newPriceAlert.notifyVia, "push"];
                            setNewPriceAlert({ ...newPriceAlert, notifyVia: newNotifyVia });
                          }}
                        >
                          Push
                        </Button>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={addPriceAlert}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Price Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="volume" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Coin</label>
                      <Select
                        value={newVolumeAlert.coinId}
                        onValueChange={(value) => {
                          const coinMap: Record<string, { name: string, symbol: string }> = {
                            bitcoin: { name: "Bitcoin", symbol: "BTC" },
                            ethereum: { name: "Ethereum", symbol: "ETH" },
                            solana: { name: "Solana", symbol: "SOL" },
                            cardano: { name: "Cardano", symbol: "ADA" },
                            ripple: { name: "XRP", symbol: "XRP" }
                          };
                          
                          setNewVolumeAlert({ 
                            ...newVolumeAlert, 
                            coinId: value,
                            coinName: coinMap[value].name,
                            coinSymbol: coinMap[value].symbol
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="solana">Solana (SOL)</SelectItem>
                          <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                          <SelectItem value="ripple">XRP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Volume Increase Threshold (%)</label>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={newVolumeAlert.thresholdPercent || ""}
                          onChange={(e) => setNewVolumeAlert({ 
                            ...newVolumeAlert, 
                            thresholdPercent: parseFloat(e.target.value) || 0 
                          })}
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Timeframe</label>
                      <Select
                        value={newVolumeAlert.timeframe}
                        onValueChange={(value: "1h" | "4h" | "24h") => setNewVolumeAlert({ 
                          ...newVolumeAlert, 
                          timeframe: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="4h">4 Hours</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full" onClick={addVolumeAlert}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Volume Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Coin</label>
                      <Select
                        value={newTechnicalAlert.coinId}
                        onValueChange={(value) => {
                          const coinMap: Record<string, { name: string, symbol: string }> = {
                            bitcoin: { name: "Bitcoin", symbol: "BTC" },
                            ethereum: { name: "Ethereum", symbol: "ETH" },
                            solana: { name: "Solana", symbol: "SOL" },
                            cardano: { name: "Cardano", symbol: "ADA" },
                            ripple: { name: "XRP", symbol: "XRP" }
                          };
                          
                          setNewTechnicalAlert({ 
                            ...newTechnicalAlert, 
                            coinId: value,
                            coinName: coinMap[value].name,
                            coinSymbol: coinMap[value].symbol
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="solana">Solana (SOL)</SelectItem>
                          <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                          <SelectItem value="ripple">XRP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Indicator</label>
                      <Select
                        value={newTechnicalAlert.indicator}
                        onValueChange={(value) => setNewTechnicalAlert({ 
                          ...newTechnicalAlert, 
                          indicator: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RSI">RSI</SelectItem>
                          <SelectItem value="MACD">MACD</SelectItem>
                          <SelectItem value="Bollinger Bands">Bollinger Bands</SelectItem>
                          <SelectItem value="Moving Average">Moving Average</SelectItem>
                          <SelectItem value="Stochastic">Stochastic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Condition</label>
                        <Select
                          value={newTechnicalAlert.condition}
                          onValueChange={(value) => setNewTechnicalAlert({ 
                            ...newTechnicalAlert, 
                            condition: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="above">Above</SelectItem>
                            <SelectItem value="below">Below</SelectItem>
                            <SelectItem value="crosses above">Crosses Above</SelectItem>
                            <SelectItem value="crosses below">Crosses Below</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Value</label>
                        <Input
                          type="number"
                          value={newTechnicalAlert.value || ""}
                          onChange={(e) => setNewTechnicalAlert({ 
                            ...newTechnicalAlert, 
                            value: parseFloat(e.target.value) || 0 
                          })}
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={addTechnicalAlert}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Technical Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Active Alerts</h3>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              <Tabs value={activeFilterTab} onValueChange={setActiveFilterTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs px-2">Active</TabsTrigger>
                  <TabsTrigger value="price" className="text-xs px-2">Price</TabsTrigger>
                  <TabsTrigger value="volume" className="text-xs px-2">Volume</TabsTrigger>
                  <TabsTrigger value="technical" className="text-xs px-2">Technical</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {getFilteredAlerts().length === 0 ? (
            <div className="text-center py-4 border rounded-md">
              <p className="text-sm text-muted-foreground">No alerts found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {getFilteredAlerts().map(alert => renderAlertItem(alert))}
            </div>
          )}
        </div>
        
        <SheetFooter className="mt-4 flex-row items-center justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            {getTotalAlertsCount()} alerts • {getActiveAlertsCount()} active
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              if(confirm("Are you sure you want to clear all alerts?")) {
                setPriceAlerts([]);
                setVolumeAlerts([]);
                setTechnicalAlerts([]);
                toast({
                  title: "Alerts Cleared",
                  description: "All alerts have been removed",
                });
              }
            }}>
              Clear All
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedAlertSystem;
