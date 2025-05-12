
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BellRing, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart, 
  Trash2, 
  X, 
  Bell 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PriceAlertForm from "./PriceAlertForm";
import { useToast } from "@/hooks/use-toast";
import { PriceAlertFormData } from '@/types/trading';

interface EnhancedAlertSystemProps {
  onAlertCreated?: (alert: any) => void;
  existingAlerts?: any[];
}

const EnhancedAlertSystem: React.FC<EnhancedAlertSystemProps> = ({
  onAlertCreated,
  existingAlerts = []
}) => {
  const [alerts, setAlerts] = useState(existingAlerts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('price');
  const { toast } = useToast();
  
  // Initialize form data for different alert types
  const [priceFormData, setPriceFormData] = useState<PriceAlertFormData>({
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: 0,
    isAbove: true,
    recurring: false,
    notifyVia: ['app']
  });
  
  const handleAddAlert = () => {
    if (activeTab === 'price') {
      const newAlert = {
        id: `alert-${Date.now()}`,
        type: 'price',
        coinId: priceFormData.coinId,
        coinName: priceFormData.coinName,
        coinSymbol: priceFormData.coinSymbol,
        condition: priceFormData.isAbove ? 'above' : 'below',
        price: priceFormData.targetPrice,
        recurring: priceFormData.recurring,
        notifyVia: priceFormData.notifyVia,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      setAlerts(prev => [...prev, newAlert]);
      
      if (onAlertCreated) {
        onAlertCreated(newAlert);
      }
      
      toast({
        title: "Alert Created",
        description: `You will be notified when ${newAlert.coinSymbol} is ${newAlert.condition} $${newAlert.price}`,
      });
      
      setIsDialogOpen(false);
      
      // Reset form data
      setPriceFormData({
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        targetPrice: 0,
        isAbove: true,
        recurring: false,
        notifyVia: ['app']
      });
    }
  };
  
  const handleRemoveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    toast({
      title: "Alert Removed",
      description: "The price alert has been removed",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Price Alerts
        </CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Alert</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="price" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="price">Price Alert</TabsTrigger>
                <TabsTrigger value="volume" disabled>Volume Alert</TabsTrigger>
              </TabsList>
              
              <TabsContent value="price">
                <PriceAlertForm
                  formData={priceFormData}
                  onFormChange={setPriceFormData}
                  onSubmit={handleAddAlert}
                />
              </TabsContent>
              
              <TabsContent value="volume">
                <div className="py-8 text-center text-muted-foreground">
                  Volume alerts coming soon
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">No price alerts set up yet</p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Alert
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="border rounded-lg p-3 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={() => handleRemoveAlert(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.condition === 'above' ? 'default' : 'destructive'} className="capitalize">
                      {alert.condition === 'above' ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {alert.condition}
                    </Badge>
                    <span className="font-medium">{alert.coinSymbol}</span>
                  </div>
                  <div className="font-mono">
                    ${alert.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  {alert.recurring ? 'Repeating alert' : 'One-time alert'} • 
                  {alert.notifyVia.includes('app') && ' App notification'}
                  {alert.notifyVia.includes('email') && ' + Email'}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-2" asChild>
              <a href="/alerts">
                <BarChart className="h-4 w-4 mr-1" />
                View All Alerts
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAlertSystem;
