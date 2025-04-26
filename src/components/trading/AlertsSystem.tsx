
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/use-alerts";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/utils/errorHandling";
import LoadingSpinner from "./LoadingSpinner";
import { AlertFormSheet } from "../widgets/AlertComponents/AlertFormSheet";
import { PriceAlertFormData } from "../widgets/AlertComponents/AlertTypes";
import { formatCurrency } from "@/utils/formatters";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

const AlertsSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { formatValue, activeCurrency } = useCurrencyConverter();
  
  // Create a default form data object that matches the PriceAlertFormData type
  const defaultFormData: PriceAlertFormData = {
    coinId: "bitcoin",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    percentageChange: 0,
    enabled: true,
    notifyVia: ["app"]
  };
  
  // State to track form data
  const [formData, setFormData] = useState<PriceAlertFormData>(defaultFormData);

  const handleSubmit = async () => {
    if (formData.targetPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price target",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await addAlert(formData);
      setIsOpen(false);
      toast({
        title: "Alert Created",
        description: `You'll be notified when ${formData.coinName} is ${formData.isAbove ? "above" : "below"} ${formatValue(formData.targetPrice)}`,
      });
      
      // Reset form after submission
      setFormData(defaultFormData);
    } catch (error) {
      handleError(error, "error", "Alert Creation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (updatedData: PriceAlertFormData) => {
    setFormData(updatedData);
  };

  const handleRemoveAlert = async (id: string) => {
    try {
      await removeAlert(id);
      toast({
        title: "Alert Removed",
        description: "Alert has been removed successfully",
      });
    } catch (error) {
      handleError(error, "error", "Alert Removal");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
                {alerts.length}
              </span>
            )}
          </Button>
          <h3 className="font-medium">Price Alerts</h3>
        </div>

        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <AlertFormSheet 
            onSubmit={handleSubmit}
            formData={formData}
            onFormChange={handleFormChange}
          />
        )}

        {alerts.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium mb-2">Active Alerts</h4>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-2 rounded-md border"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {alert.coinSymbol} {alert.isAbove ? "↑" : "↓"} {formatValue(alert.targetPrice)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {alert.recurring ? "Recurring" : "One-time"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAlert(alert.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsSystem;
