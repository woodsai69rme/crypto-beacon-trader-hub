
import React, { useState, useEffect } from "react";
import { Bell, Plus, Trash, Check, X, ArrowUp, ArrowDown, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { PriceAlert, VolumeAlert, AlertFrequency, TechnicalAlertFormData } from "@/types/alerts";
import { COIN_OPTIONS } from "./AlertComponents/AlertTypes";
import PriceAlertForm from "./AlertComponents/PriceAlertForm";
import VolumeAlertForm from "./AlertComponents/VolumeAlertForm";
import TechnicalAlertForm from "./AlertComponents/TechnicalAlertForm";
import AlertList from "./AlertComponents/AlertList";

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
  type: 'technical';
}

type AlertWithType = 
  | (PriceAlert & { type: 'price' })
  | (VolumeAlert & { type: 'volume' })
  | (TechnicalAlert & { type: 'technical' });

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
    notifyVia: formData.notifyVia as ("email" | "app" | "push")[],
    type: 'price'
  };
};

const EnhancedAlertSystem = () => {
  const { formatValue } = useCurrencyConverter();
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
    notifyVia: ["app"] as ("email" | "app" | "push")[],
    type: 'price' as const
  });

  // Volume alert state
  const [volumeAlerts, setVolumeAlerts] = useState<VolumeAlert[]>([]);
  const [newVolumeAlert, setNewVolumeAlert] = useState({
    coinId: "bitcoin",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    volumeThreshold: 15,
    frequency: "1h" as AlertFrequency,
    enabled: true,
    notifyVia: ["app"] as ("email" | "app" | "push")[],
    type: 'volume' as const
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
    enabled: true,
    type: 'technical' as const
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
      const currentPrices = { 
        bitcoin: Math.random() * 50000 + 20000,
        ethereum: Math.random() * 3000 + 1500,
        solana: Math.random() * 100 + 50,
        cardano: Math.random() * 1 + 0.3,
        ripple: Math.random() * 1 + 0.3
      };
      
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
          
          if (!alert.recurring) {
            setPriceAlerts(prev => 
              prev.map(a => a.id === alert.id ? {...a, enabled: false} : a)
            );
          }
        }
      });
      
      volumeAlerts.forEach(alert => {
        if (!alert.enabled) return;
        
        if (Math.random() > 0.95) {
          const currentVolume = alert.volumeThreshold * 1.2;
          toast({
            title: "Volume Alert!",
            description: `${alert.coinName} ${alert.frequency} volume increased by ${currentVolume.toFixed(1)}%`,
          });
        }
      });
      
      technicalAlerts.forEach(alert => {
        if (!alert.enabled) return;
        
        if (Math.random() > 0.95) {
          toast({
            title: "Technical Alert!",
            description: `${alert.coinName} ${alert.indicator} is now ${alert.condition} ${alert.value}`,
          });
        }
      });
    }, 30000);
    
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
      coinId: newPriceAlert.coinId,
      coinName: newPriceAlert.coinName,
      coinSymbol: newPriceAlert.coinSymbol,
      targetPrice: newPriceAlert.targetPrice,
      isAbove: newPriceAlert.isAbove,
      enabled: true,
      recurring: newPriceAlert.recurring,
      percentageChange: newPriceAlert.percentageChange,
      notifyVia: [...newPriceAlert.notifyVia],
      createdAt: new Date(),
      type: 'price'
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
    if (newVolumeAlert.volumeThreshold <= 0) {
      toast({
        title: "Invalid Volume Threshold",
        description: "Please enter a valid volume percentage",
        variant: "destructive",
      });
      return;
    }
    
    const alert: VolumeAlert = {
      id: Date.now().toString(),
      coinId: newVolumeAlert.coinId,
      coinName: newVolumeAlert.coinName,
      coinSymbol: newVolumeAlert.coinSymbol,
      volumeThreshold: newVolumeAlert.volumeThreshold,
      frequency: newVolumeAlert.frequency,
      enabled: true,
      notifyVia: [...newVolumeAlert.notifyVia],
      createdAt: new Date(),
      type: 'volume'
    };
    
    setVolumeAlerts([...volumeAlerts, alert]);
    
    toast({
      title: "Volume Alert Created",
      description: `You'll be notified when ${alert.coinName} ${alert.frequency} volume increases by ${alert.volumeThreshold}%`,
    });
  };
  
  const addTechnicalAlert = () => {
    const alert: TechnicalAlert = {
      id: Date.now().toString(),
      ...newTechnicalAlert,
      createdAt: new Date(),
      type: 'technical'
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
  
  const handleRemoveAlert = (type: 'price' | 'volume' | 'technical', id: string) => {
    if (type === 'price') {
      removePriceAlert(id);
    } else if (type === 'volume') {
      removeVolumeAlert(id);
    } else {
      removeTechnicalAlert(id);
    }
  };
  
  const handleTechnicalAlertChange = (data: Partial<TechnicalAlertFormData>) => {
    setNewTechnicalAlert((prev) => ({
      ...prev,
      ...data
    }));
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
              <PriceAlertForm 
                formData={newPriceAlert}
                setFormData={(data) => {
                  if (typeof data === 'function') {
                    setNewPriceAlert(data);
                  } else {
                    setNewPriceAlert(prev => ({...prev, ...data}));
                  }
                }}
                onSubmit={addPriceAlert}
              />
            </TabsContent>
            
            <TabsContent value="volume" className="space-y-4">
              <VolumeAlertForm 
                formData={newVolumeAlert}
                setFormData={(data) => {
                  if (typeof data === 'function') {
                    setNewVolumeAlert(data);
                  } else {
                    setNewVolumeAlert(prev => ({...prev, ...data}));
                  }
                }}
                onSubmit={addVolumeAlert}
              />
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <TechnicalAlertForm
                formData={newTechnicalAlert}
                setFormData={(data) => {
                  if (typeof data === 'function') {
                    setNewTechnicalAlert(data);
                  } else {
                    setNewTechnicalAlert(prev => ({...prev, ...data}));
                  }
                }}
                onSubmit={addTechnicalAlert}
              />
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
          
          <AlertList 
            alerts={getFilteredAlerts()}
            onToggleEnabled={toggleAlertEnabled}
            onRemoveAlert={handleRemoveAlert}
          />
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
