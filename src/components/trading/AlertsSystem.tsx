
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Trash2, BellRing } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Alert {
  id: string;
  type: 'price' | 'volume' | 'technical';
  asset: string;
  condition: 'above' | 'below' | 'crosses';
  value: number;
  active: boolean;
}

const AlertsSystem: React.FC = () => {
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [alertType, setAlertType] = useState<'price' | 'volume' | 'technical'>('price');
  const [alertAsset, setAlertAsset] = useState('bitcoin');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below' | 'crosses'>('above');
  const [alertValue, setAlertValue] = useState('');
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert-1',
      type: 'price',
      asset: 'bitcoin',
      condition: 'above',
      value: 60000,
      active: true
    },
    {
      id: 'alert-2',
      type: 'price',
      asset: 'ethereum',
      condition: 'below',
      value: 2800,
      active: true
    }
  ]);
  
  const handleAddAlert = () => {
    if (!alertValue || isNaN(Number(alertValue))) {
      toast({
        title: 'Invalid Value',
        description: 'Please enter a valid number',
        variant: 'destructive'
      });
      return;
    }
    
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      type: alertType,
      asset: alertAsset,
      condition: alertCondition,
      value: Number(alertValue),
      active: true
    };
    
    setAlerts([...alerts, newAlert]);
    setShowAddAlert(false);
    setAlertValue('');
    
    toast({
      title: 'Alert Created',
      description: `${alertAsset} ${alertCondition} ${alertValue} alert has been created`,
    });
  };
  
  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    
    toast({
      title: 'Alert Deleted',
      description: 'The alert has been deleted',
    });
  };
  
  const handleToggleAlert = (id: string, active: boolean) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active } : alert
    ));
    
    toast({
      title: active ? 'Alert Activated' : 'Alert Deactivated',
      description: active ? 'The alert has been turned on' : 'The alert has been turned off',
    });
  };
  
  const getAssetName = (assetId: string) => {
    switch (assetId) {
      case 'bitcoin':
        return 'Bitcoin (BTC)';
      case 'ethereum':
        return 'Ethereum (ETH)';
      case 'solana':
        return 'Solana (SOL)';
      case 'cardano':
        return 'Cardano (ADA)';
      default:
        return assetId;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Price Alerts
        </CardTitle>
        <CardDescription>
          Get notified when assets hit your target prices
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAddAlert ? (
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium">Create New Alert</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Alert Type</Label>
                <RadioGroup 
                  value={alertType}
                  onValueChange={(value) => setAlertType(value as any)}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="price" id="price" />
                    <Label htmlFor="price">Price</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="volume" id="volume" />
                    <Label htmlFor="volume">Volume</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical">Technical</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Asset</Label>
                <Select value={alertAsset} onValueChange={setAlertAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                    <SelectItem value="solana">Solana (SOL)</SelectItem>
                    <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={alertCondition} onValueChange={(value) => setAlertCondition(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Goes Above</SelectItem>
                    <SelectItem value="below">Goes Below</SelectItem>
                    <SelectItem value="crosses">Crosses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Value</Label>
                <Input 
                  type="text" 
                  value={alertValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setAlertValue(value);
                    }
                  }}
                  placeholder="Enter target value"
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button onClick={handleAddAlert}>Create Alert</Button>
                <Button variant="outline" onClick={() => setShowAddAlert(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => setShowAddAlert(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        )}
        
        <div className="space-y-2">
          {alerts.length === 0 && !showAddAlert ? (
            <div className="text-center py-6">
              <BellRing className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No alerts configured</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div>
                  <div className="font-medium">{getAssetName(alert.asset)}</div>
                  <div className="text-sm text-muted-foreground">
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} {alert.condition} {alert.value}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={alert.active}
                    onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {alerts.filter(a => a.active).length} active alerts
        </div>
      </CardFooter>
    </Card>
  );
};

export default AlertsSystem;
