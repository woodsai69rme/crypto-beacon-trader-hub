
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PriceAlertFormData } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

interface EnhancedAlertSystemProps {
  initialAlerts?: any[];
}

const EnhancedAlertSystem: React.FC<EnhancedAlertSystemProps> = ({ initialAlerts = [] }) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [formData, setFormData] = useState<PriceAlertFormData>({
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: 50000,
    isAbove: true,
    recurring: false,
    percentageChange: 5,
    enabled: true,
    notifyVia: ['app'],
    notes: '',
    currentPrice: 45000,
  });
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFormChange = (updatedData: PriceAlertFormData) => {
    setFormData(prevData => ({ ...prevData, ...updatedData }));
  };
  
  const handleCreateAlert = () => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      type: formData.isAbove ? 'price-above' : 'price-below',
      asset: {
        id: formData.coinId,
        symbol: formData.coinSymbol,
        name: formData.coinName
      },
      condition: {
        price: formData.targetPrice,
        isAbove: formData.isAbove
      },
      created: new Date().toISOString(),
      enabled: true,
      recurring: formData.recurring
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    toast({
      title: "Alert Created",
      description: `You will be notified when ${formData.coinSymbol} is ${formData.isAbove ? 'above' : 'below'} $${formData.targetPrice.toLocaleString()}`
    });
    
    setIsOpen(false);
  };
  
  const handleRemoveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Removed",
      description: "The alert has been removed successfully."
    });
  };
  
  const renderAlertItem = (alert: any) => {
    return (
      <div key={alert.id} className="border rounded-md p-3 mb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{alert.asset.symbol}</span>
              <Badge variant={alert.condition.isAbove ? "success" : "destructive"}>
                {alert.condition.isAbove ? 'Above' : 'Below'} ${alert.condition.price.toLocaleString()}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Created {new Date(alert.created).toLocaleDateString()}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => handleRemoveAlert(alert.id)}
          >
            &times;
          </Button>
        </div>
      </div>
    );
  };

  // Mock price alert form component for the example
  const PriceAlertForm = ({ formData, onFormChange, onSubmit }: { 
    formData: PriceAlertFormData, 
    onFormChange: (data: PriceAlertFormData) => void, 
    onSubmit: () => void 
  }) => {
    return (
      <div className="space-y-4">
        <p>This is a mock price alert form.</p>
        <Button onClick={onSubmit}>Create Alert</Button>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Price Alerts
        </CardTitle>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 px-2">
              <Plus className="h-4 w-4 mr-1" />
              Add Alert
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Create New Alert</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Tabs defaultValue="price">
                <TabsList>
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                </TabsList>
                <TabsContent value="price" className="pt-4">
                  <PriceAlertForm 
                    formData={formData} 
                    onFormChange={handleFormChange} 
                    onSubmit={handleCreateAlert} 
                  />
                </TabsContent>
                <TabsContent value="volume" className="pt-4">
                  <p className="text-muted-foreground">Volume alert configuration coming soon</p>
                </TabsContent>
                <TabsContent value="technical" className="pt-4">
                  <p className="text-muted-foreground">Technical indicators alert configuration coming soon</p>
                </TabsContent>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="triggered">Triggered</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {alerts.length > 0 ? (
              <div>
                {alerts.map(alert => renderAlertItem(alert))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <p>No active alerts</p>
                <p className="mt-1">Create your first price alert to get notified</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="triggered">
            <div className="text-center py-6 text-muted-foreground text-sm">
              <p>No triggered alerts</p>
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            {alerts.length > 0 ? (
              <div>
                {alerts.map(alert => renderAlertItem(alert))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <p>No alerts found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
            <Settings className="h-3 w-3" />
            Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAlertSystem;
