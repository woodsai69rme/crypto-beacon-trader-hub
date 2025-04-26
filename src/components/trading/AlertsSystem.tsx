
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

const AlertsSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts();
  
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
    try {
      setIsLoading(true);
      await addAlert(formData);
      setIsOpen(false);
      toast({
        title: "Alert Created",
        description: "Your price alert has been set successfully",
      });
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
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-2 rounded-md border"
              >
                <span className="text-sm">
                  {alert.coinSymbol} {alert.isAbove ? "above" : "below"} $
                  {alert.targetPrice.toLocaleString()}
                </span>
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
