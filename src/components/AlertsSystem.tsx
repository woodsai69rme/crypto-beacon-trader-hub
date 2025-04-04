
import { useState, useEffect } from "react";
import { Bell, Plus, Trash, Check, X } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  targetPrice: number;
  isAbove: boolean; // true for price above target, false for below
  createdAt: Date;
}

const AlertsSystem = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    coinId: "bitcoin",
    coinName: "Bitcoin",
    targetPrice: 0,
    isAbove: true
  });
  const [isOpen, setIsOpen] = useState(false);
  
  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem("priceAlerts");
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error("Failed to load alerts:", error);
      }
    }
  }, []);

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("priceAlerts", JSON.stringify(alerts));
  }, [alerts]);
  
  // Check alerts against current prices (simulation)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // In a real implementation, we'd fetch current prices here
      const currentPrices = { bitcoin: Math.random() * 50000 + 20000 };
      
      alerts.forEach(alert => {
        const currentPrice = currentPrices[alert.coinId as keyof typeof currentPrices];
        if (currentPrice && 
            ((alert.isAbove && currentPrice > alert.targetPrice) || 
             (!alert.isAbove && currentPrice < alert.targetPrice))) {
          toast({
            title: "Price Alert!",
            description: `${alert.coinName} is now ${alert.isAbove ? "above" : "below"} $${alert.targetPrice.toLocaleString()}`,
          });
        }
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(checkInterval);
  }, [alerts]);
  
  const addAlert = () => {
    if (newAlert.targetPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price target",
        variant: "destructive",
      });
      return;
    }
    
    const alert: PriceAlert = {
      id: Date.now().toString(),
      ...newAlert,
      createdAt: new Date()
    };
    
    setAlerts([...alerts, alert]);
    setNewAlert({
      coinId: "bitcoin",
      coinName: "Bitcoin",
      targetPrice: 0,
      isAbove: true
    });
    
    toast({
      title: "Alert Created",
      description: `You'll be notified when ${alert.coinName} is ${alert.isAbove ? "above" : "below"} $${alert.targetPrice.toLocaleString()}`,
    });
    
    setIsOpen(false);
  };
  
  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "Price alert has been removed",
    });
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {alerts.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Price Alerts</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Coin</label>
            <select
              className="rounded border border-border bg-background px-2 py-1 text-foreground"
              value={newAlert.coinId}
              onChange={(e) => setNewAlert({ 
                ...newAlert, 
                coinId: e.target.value,
                coinName: e.target.options[e.target.selectedIndex].text 
              })}
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
              <option value="cardano">Cardano</option>
              <option value="ripple">XRP</option>
            </select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Alert me when price is</label>
            <div className="flex items-center space-x-2">
              <select
                className="rounded border border-border bg-background px-2 py-1 text-foreground"
                value={newAlert.isAbove ? "above" : "below"}
                onChange={(e) => setNewAlert({ 
                  ...newAlert, 
                  isAbove: e.target.value === "above"
                })}
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min="0"
                    className="pl-6"
                    value={newAlert.targetPrice || ""}
                    onChange={(e) => setNewAlert({ 
                      ...newAlert, 
                      targetPrice: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Enter price"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button className="w-full" onClick={addAlert}>
            <Plus className="mr-1 h-4 w-4" />
            Add Alert
          </Button>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium">Active Alerts</h3>
          {alerts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No active alerts.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between rounded-md border border-border bg-background p-2"
                >
                  <div>
                    <p className="font-medium">{alert.coinName}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.isAbove ? "Above" : "Below"} ${alert.targetPrice.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAlert(alert.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlertsSystem;
