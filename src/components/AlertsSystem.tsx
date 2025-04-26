
import React, { useState } from "react";
import { Bell, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
} from "@/components/ui/sheet";
import { useAlerts } from "@/hooks/use-alerts";
import { AlertFormSheet } from "./widgets/AlertComponents/AlertFormSheet";
import { COIN_OPTIONS } from "./widgets/AlertComponents/AlertTypes";

const AlertsSystem = () => {
  const { alerts, addAlert, removeAlert } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    coinId: "bitcoin",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    targetPrice: 0,
    isAbove: true,
    enabled: true,
    recurring: false,
    percentageChange: 0,
    notifyVia: ["app"] as ("email" | "app" | "push")[]
  });
  
  const handleSubmit = () => {
    addAlert(newAlert);
    setNewAlert({
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
    setIsOpen(false);
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
        
        <AlertFormSheet 
          formData={newAlert}
          onFormChange={setNewAlert}
          onSubmit={handleSubmit}
        />
        
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
