
import React, { useState } from "react";
import { Bell, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useAlerts } from "@/hooks/use-alerts";
import { useAlertForm } from "@/hooks/use-alert-form";
import { AlertFormSheet } from "./widgets/AlertComponents/AlertFormSheet";
import { AlertHeader } from "./widgets/AlertComponents/AlertHeader";
import { AlertBadge } from "./widgets/AlertComponents/AlertBadge";
import { 
  AlertData, 
  PriceAlert, 
  VolumeAlert, 
  TechnicalAlert 
} from "@/types/alerts";

const AlertsSystem = () => {
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { formData, setFormData, resetForm } = useAlertForm();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (formData.type && formData.coinId) {
      addAlert({
        ...formData,
        type: formData.type,
        coinId: formData.coinId,
        coinName: formData.coinName,
        coinSymbol: formData.coinSymbol,
        enabled: true,
      });
      resetForm();
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <AlertBadge count={alerts.length} />
        </Button>
      </SheetTrigger>
      
      <SheetContent>
        <AlertHeader />
        
        <AlertFormSheet 
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleSubmit}
        />
        
        <div className="mt-6">
          <h3 className="text-sm font-medium">Active Alerts</h3>
          {alerts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No active alerts.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {alerts.map((alert: AlertData) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between rounded-md border border-border bg-background p-2"
                >
                  <div>
                    <p className="font-medium">{alert.coinName}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.type === 'price' ? 
                        `${(alert as PriceAlert).isAbove ? "Above" : "Below"} $${(alert as PriceAlert).targetPrice?.toLocaleString() || 0}` 
                        : 
                        alert.type === 'volume' ? 
                          `Volume > ${(alert as VolumeAlert).volumeThreshold}` 
                          : 
                          `${(alert as TechnicalAlert).indicator} ${(alert as TechnicalAlert).condition}`
                      }
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAlert(alert.id || '')}
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
