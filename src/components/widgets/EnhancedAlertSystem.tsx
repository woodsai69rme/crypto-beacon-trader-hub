
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceAlertFormData, COIN_OPTIONS } from './AlertComponents/AlertTypes';
import PriceAlertForm from './AlertComponents/PriceAlertForm';
import { Bell, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface Alert extends PriceAlertFormData {
  id: string;
  createdAt: string;
}

interface EnhancedAlertSystemProps {
  initialAlerts?: Alert[];
  onAlertCreated?: (alert: Alert) => void;
  onAlertDeleted?: (id: string) => void;
}

const EnhancedAlertSystem: React.FC<EnhancedAlertSystemProps> = ({
  initialAlerts = [],
  onAlertCreated,
  onAlertDeleted,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<string>('price');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  // Form state for creating new alerts
  const [formData, setFormData] = useState<PriceAlertFormData>({
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    enabled: true,
    notifyVia: ['app']
  });
  
  const handleFormChange = (updatedData: PriceAlertFormData) => {
    setFormData(updatedData);
  };
  
  const createAlert = () => {
    const newAlert: Alert = {
      ...formData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
    
    if (onAlertCreated) {
      onAlertCreated(newAlert);
    }
    
    toast({
      title: "Alert Created",
      description: `${newAlert.isAbove ? 'Above' : 'Below'} $${newAlert.targetPrice} for ${newAlert.coinSymbol}`,
    });
    
    setDialogOpen(false);
  };
  
  const deleteAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    
    if (onAlertDeleted) {
      onAlertDeleted(id);
    }
    
    toast({
      title: "Alert Removed",
      description: "The price alert has been deleted.",
      variant: "default"
    });
  };
  
  const toggleAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };
  
  // Get coin details by ID
  const getCoinById = (id: string) => {
    return COIN_OPTIONS.find(coin => coin.id === id);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Price Alerts
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Set up a price alert for your selected cryptocurrency.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="price">Price</TabsTrigger>
                <TabsTrigger value="technical" disabled>Technical</TabsTrigger>
                <TabsTrigger value="volume" disabled>Volume</TabsTrigger>
              </TabsList>
              
              <TabsContent value="price" className="py-4">
                <PriceAlertForm 
                  formData={formData}
                  onFormChange={handleFormChange}
                />
              </TabsContent>
              
              <TabsContent value="technical">
                <div className="py-4">
                  Technical indicators alerts coming soon.
                </div>
              </TabsContent>
              
              <TabsContent value="volume">
                <div className="py-4">
                  Volume-based alerts coming soon.
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createAlert}>
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No alerts set. Create an alert to monitor price movements.</p>
            <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Alert
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => {
              const coin = getCoinById(alert.coinId);
              
              return (
                <div key={alert.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-1">{alert.coinSymbol}</span>
                        <span className="text-sm text-muted-foreground">{alert.coinName}</span>
                        {alert.enabled ? (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
                            Disabled
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1">
                        <span className="text-sm">
                          {alert.isAbove ? 'Price above' : 'Price below'} 
                          <span className="font-mono ml-1">${alert.targetPrice.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                      >
                        {alert.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    Created on {new Date(alert.createdAt).toLocaleDateString()} • 
                    {alert.recurring ? ' Recurring' : ' One time'} • 
                    Notify via: {alert.notifyVia.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAlertSystem;
