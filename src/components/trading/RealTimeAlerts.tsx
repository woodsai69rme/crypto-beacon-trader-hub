
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Bell, BellPlus, BellRing, Trash2, Settings, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface RealTimeAlert {
  id: string;
  type: 'price' | 'volume' | 'technical' | 'news';
  asset: string;
  condition: string;
  threshold: number;
  createdAt: string;
  triggered?: boolean;
  triggeredAt?: string;
}

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([
    {
      id: "alert-1",
      type: "price",
      asset: "BTC",
      condition: "above",
      threshold: 95000,
      createdAt: new Date().toISOString(),
    },
    {
      id: "alert-2",
      type: "price",
      asset: "ETH",
      condition: "below",
      threshold: 3000,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "alert-3",
      type: "volume",
      asset: "SOL",
      condition: "above",
      threshold: 1000000000,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  
  const [activeAlerts, setActiveAlerts] = useState<boolean>(true);
  const [filteredAlerts, setFilteredAlerts] = useState<RealTimeAlert[]>([]);
  
  // Effect to filter alerts
  useEffect(() => {
    setFilteredAlerts(activeAlerts 
      ? alerts.filter(alert => !alert.triggered) 
      : alerts.filter(alert => alert.triggered));
  }, [alerts, activeAlerts]);
  
  // Simulate alert triggering (for demo purposes)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() > 0.7 && alerts.some(a => !a.triggered)) {
        const alertsToUpdate = [...alerts];
        const untriggeredAlerts = alertsToUpdate.filter(a => !a.triggered);
        
        if (untriggeredAlerts.length > 0) {
          const randomIndex = Math.floor(Math.random() * untriggeredAlerts.length);
          const alertToTrigger = untriggeredAlerts[randomIndex];
          
          // Find this alert in the original array
          const originalIndex = alertsToUpdate.findIndex(a => a.id === alertToTrigger.id);
          
          if (originalIndex !== -1) {
            alertsToUpdate[originalIndex] = {
              ...alertToTrigger,
              triggered: true,
              triggeredAt: new Date().toISOString()
            };
            
            setAlerts(alertsToUpdate);
            
            toast({
              title: `${alertToTrigger.asset} Alert Triggered!`,
              description: `${alertToTrigger.asset} price is ${alertToTrigger.condition} $${alertToTrigger.threshold.toLocaleString()}`,
              variant: "default",
            });
          }
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [alerts]);
  
  const handleRemoveAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "The alert has been removed successfully",
      variant: "default",
    });
  };
  
  const handleCreateAlert = () => {
    toast({
      title: "Create Alert",
      description: "This would open an alert creation dialog",
      variant: "default",
    });
  };
  
  const getAlertBadgeColor = (type: string) => {
    switch(type) {
      case 'price': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'volume': return 'bg-purple-50 text-purple-700 border-purple-200'; 
      case 'technical': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'news': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Real-Time Alerts
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleCreateAlert}>
            <BellPlus className="h-4 w-4 mr-1" />
            New Alert
          </Button>
        </div>
        <CardDescription>
          Get notified when market conditions match your criteria
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Switch 
              checked={activeAlerts} 
              onCheckedChange={setActiveAlerts} 
              id="alerts-switch"
            />
            <label htmlFor="alerts-switch" className="text-sm font-medium cursor-pointer">
              {activeAlerts ? "Active Alerts" : "Triggered Alerts"}
            </label>
          </div>
          
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto opacity-20 mb-3" />
            <p>{activeAlerts 
              ? "No active alerts. Create one to get started." 
              : "No triggered alerts yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="bg-muted/40 p-3 rounded-md border flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getAlertBadgeColor(alert.type)}>
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </Badge>
                    <span className="font-medium">{alert.asset}</span>
                  </div>
                  
                  <div className="text-sm">
                    {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.threshold.toLocaleString()}
                  </div>
                  
                  {alert.triggered ? (
                    <div className="text-xs text-muted-foreground mt-1">
                      Triggered: {new Date(alert.triggeredAt!).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(alert.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 mt-1"
                  onClick={() => handleRemoveAlert(alert.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="text-sm text-muted-foreground">
          {alerts.filter(a => !a.triggered).length} active, {alerts.filter(a => a.triggered).length} triggered
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RealTimeAlerts;
