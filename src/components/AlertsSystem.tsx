
import React, { useState } from "react";
import { Bell, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useAlerts } from "@/hooks/use-alerts";
import { useAlertForm } from "@/hooks/use-alert-form";
import { AlertFormSheet } from "./widgets/AlertComponents/AlertFormSheet";
import { AlertHeader } from "./widgets/AlertComponents/AlertHeader";
import { AlertBadge } from "./widgets/AlertComponents/AlertBadge";
import { AlertType, PriceAlert, Alert, AlertFormData } from "@/types/alerts";

// Ensure we have the necessary types
declare module "@/types/alerts" {
  export type AlertType = 'price' | 'volume' | 'pattern' | 'technical';
  export type NotificationMethod = 'email' | 'push' | 'app';

  export interface BaseAlert {
    id: string;
    type: AlertType;
    coinId: string;
    coinName: string;
    coinSymbol: string;
    enabled: boolean;
    notifyVia: NotificationMethod[];
    createdAt?: Date;
  }

  export interface PriceAlert extends BaseAlert {
    type: 'price';
    targetPrice: number;
    isAbove: boolean;
    recurring: boolean;
    percentageChange?: number;
  }

  export interface VolumeAlert extends BaseAlert {
    type: 'volume';
    targetVolume: number;
    isAbove: boolean;
  }

  export interface PatternAlert extends BaseAlert {
    type: 'pattern';
    pattern: string;
  }

  export interface TechnicalAlert extends BaseAlert {
    type: 'technical';
    indicator: string;
    threshold: number;
  }

  export type Alert = PriceAlert | VolumeAlert | PatternAlert | TechnicalAlert;

  export interface AlertFormData {
    type: AlertType;
    coinId: string;
    coinName: string;
    coinSymbol: string;
    enabled: boolean;
    notifyVia: NotificationMethod[];
    targetPrice?: number;
    isAbove?: boolean;
    recurring?: boolean;
    percentageChange?: number;
    targetVolume?: number;
    pattern?: string;
    indicator?: string;
    threshold?: number;
  }
}

const AlertsSystem = () => {
  const { alerts, createAlert, deleteAlert } = useAlerts();
  const { formData, setFormData, resetForm } = useAlertForm();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    // Create the correct alert type
    const alertData: AlertFormData = {
      ...formData,
      type: formData.type as AlertType, // Ensure correct type
    };
    
    createAlert(alertData);
    resetForm();
    setIsOpen(false);
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
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between rounded-md border border-border bg-background p-2"
                >
                  <div>
                    <p className="font-medium">{alert.coinName}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.type === "price" && 
                        `${(alert as PriceAlert).isAbove ? "Above" : "Below"} $${(alert as PriceAlert).targetPrice.toLocaleString()}`
                      }
                      {alert.type === "volume" && "Volume Alert"}
                      {alert.type === "pattern" && "Pattern Alert"}
                      {alert.type === "technical" && "Technical Alert"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAlert(alert.id)}
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
