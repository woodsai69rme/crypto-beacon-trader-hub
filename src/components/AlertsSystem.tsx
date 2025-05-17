
import React, { useState } from "react";
import { Bell, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useAlerts } from "@/hooks/use-alerts";
import { AlertFormSheet } from "./widgets/AlertComponents/AlertFormSheet";
import { AlertHeader } from "./widgets/AlertComponents/AlertHeader";
import { AlertBadge } from "./widgets/AlertComponents/AlertBadge";
import { 
  AlertData,
  PriceAlert, 
  VolumeAlert, 
  TechnicalAlert,
  AlertFormData
} from "@/types/alerts";

const AlertsSystem = () => {
  const { alerts, addAlert, removeAlert } = useAlerts();
  const [formData, setFormData] = useState<AlertFormData>({
    type: 'price',
    coinId: '',
    coinName: '',
    coinSymbol: '',
    enabled: true,
    notifyVia: ['app'],
    frequency: 'once'
  });
  const [isOpen, setIsOpen] = useState(false);

  // Create a type-safe form data setter
  const updateFormData = (data: Partial<AlertFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      type: 'price',
      coinId: '',
      coinName: '',
      coinSymbol: '',
      enabled: true,
      notifyVia: ['app'],
      frequency: 'once'
    });
  };

  const handleSubmit = () => {
    if (formData.coinId) {
      const baseAlertData = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date(),
        enabled: true,
      };
      
      // Create the appropriate alert type
      let alertData: AlertData;
      
      if (formData.type === 'price') {
        alertData = {
          ...baseAlertData,
          type: 'price',
          targetPrice: formData.targetPrice || 0,
          isAbove: formData.isAbove || true,
          recurring: formData.recurring || false,
          percentageChange: formData.percentageChange || 0
        } as PriceAlert;
      } else if (formData.type === 'volume') {
        alertData = {
          ...baseAlertData,
          type: 'volume',
          volumeThreshold: formData.volumeThreshold || 0
        } as VolumeAlert;
      } else {
        alertData = {
          ...baseAlertData,
          type: 'technical',
          indicator: formData.indicator || '',
          condition: formData.condition || '',
          value: formData.value || 0
        } as TechnicalAlert;
      }
      
      addAlert(alertData as AlertData);
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
          formData={formData as AlertFormData}
          onFormChange={updateFormData}
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
