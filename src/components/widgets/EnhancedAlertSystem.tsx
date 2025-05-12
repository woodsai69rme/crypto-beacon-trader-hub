
import React, { useState, useEffect } from "react";
import { Bell, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { PriceAlertFormData } from "./AlertComponents/AlertTypes";

const AlertHeader = () => (
  <div className="flex items-center justify-between border-b pb-4">
    <h2 className="text-lg font-semibold">Price Alerts</h2>
  </div>
);

const AlertBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
      {count > 9 ? '9+' : count}
    </span>
  );
};

// Alert types
type AlertType = 'price' | 'volume' | 'percentageChange';

// Basic alert interface
interface Alert {
  id: string;
  type: AlertType;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  isAbove?: boolean;
  targetPrice?: number;
  targetVolume?: number;
  direction?: 'increase' | 'decrease';
  percentage?: number;
  timeframe?: string;
  notes?: string;
  createdAt: string;
}

// Import the real PriceAlertForm component
import PriceAlertForm from "./AlertComponents/PriceAlertForm";

const EnhancedAlertSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<AlertType>('price');
  const [formData, setFormData] = useState<PriceAlertFormData>({
    coinId: '',
    coinName: '',
    coinSymbol: '',
    isAbove: true,
    targetPrice: 0,
    currentPrice: 0
  });
  
  const { toast } = useToast();

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('alerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Failed to parse saved alerts', error);
      }
    }
  }, []);

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  const handleAlertFormChange = (updatedData: PriceAlertFormData) => {
    setFormData(updatedData);
  };

  const handleAddAlert = () => {
    if (!formData.coinId || !formData.targetPrice) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    const newAlert: Alert = {
      id: uuidv4(),
      type: 'price',
      coinId: formData.coinId,
      coinName: formData.coinName,
      coinSymbol: formData.coinSymbol,
      isAbove: formData.isAbove,
      targetPrice: formData.targetPrice,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    setAlerts([...alerts, newAlert]);
    
    toast({
      title: "Alert Created",
      description: `You will be notified when ${formData.coinName} goes ${formData.isAbove ? 'above' : 'below'} $${formData.targetPrice.toLocaleString()}.`
    });

    // Reset form
    setFormData({
      coinId: '',
      coinName: '',
      coinSymbol: '',
      isAbove: true,
      targetPrice: 0,
      currentPrice: 0
    });
    
    // Close sheet
    setIsOpen(false);
  };

  const handleRemoveAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    
    toast({
      title: "Alert Removed",
      description: "The alert has been removed successfully.",
    });
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
        
        <Tabs defaultValue="price" className="w-full mt-6" onValueChange={(value) => setActiveTab(value as AlertType)}>
          <TabsList className="w-full">
            <TabsTrigger value="price" className="flex-1">Price</TabsTrigger>
            <TabsTrigger value="volume" className="flex-1" disabled>Volume</TabsTrigger>
            <TabsTrigger value="percentageChange" className="flex-1" disabled>% Change</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="mt-4 space-y-4">
            <PriceAlertForm
              formData={formData}
              onFormChange={handleAlertFormChange}
              onSubmit={handleAddAlert}
            />
          </TabsContent>
          
          <TabsContent value="volume" className="mt-4">
            <div className="text-center text-muted-foreground py-10">
              Volume alerts coming soon...
            </div>
          </TabsContent>
          
          <TabsContent value="percentageChange" className="mt-4">
            <div className="text-center text-muted-foreground py-10">
              Percentage change alerts coming soon...
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Active Alerts</h3>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active alerts.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between rounded-md border border-border bg-background p-2"
                >
                  <div>
                    <p className="font-medium">{alert.coinName}</p>
                    {alert.type === 'price' && (
                      <p className="text-sm text-muted-foreground">
                        {alert.isAbove ? 'Above' : 'Below'} ${alert.targetPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAlert(alert.id)}
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

export default EnhancedAlertSystem;
