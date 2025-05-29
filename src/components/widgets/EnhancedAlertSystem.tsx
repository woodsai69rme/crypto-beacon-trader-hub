
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Plus, Settings, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { AlertType } from '@/types/trading';

interface Alert {
  id: string;
  type: AlertType;
  asset: string;
  condition: string;
  value: number;
  isActive: boolean;
  createdAt: string;
}

const EnhancedAlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'price',
      asset: 'BTC',
      condition: 'above',
      value: 65000,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'price',
      asset: 'ETH',
      condition: 'below',
      value: 2800,
      isActive: true,
      createdAt: '2024-01-14'
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    type: 'price' as AlertType,
    asset: '',
    condition: 'above',
    value: 0
  });

  const addAlert = () => {
    if (!newAlert.asset || !newAlert.value) return;

    const alert: Alert = {
      id: Date.now().toString(),
      type: newAlert.type,
      asset: newAlert.asset,
      condition: newAlert.condition,
      value: newAlert.value,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ type: 'price', asset: '', condition: 'above', value: 0 });
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'price': return <DollarSign className="h-4 w-4" />;
      case 'volume': return <TrendingUp className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Enhanced Alert System
          </CardTitle>
          <CardDescription>
            Set up custom alerts for price, volume, and market events
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={newAlert.type} onValueChange={(value: AlertType) => setNewAlert({...newAlert, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price Alert</SelectItem>
                <SelectItem value="volume">Volume Alert</SelectItem>
                <SelectItem value="technical">Technical Alert</SelectItem>
                <SelectItem value="news">News Alert</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Asset (BTC, ETH...)"
              value={newAlert.asset}
              onChange={(e) => setNewAlert({...newAlert, asset: e.target.value.toUpperCase()})}
            />
            
            <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
                <SelectItem value="crosses">Crosses</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Value"
              value={newAlert.value || ''}
              onChange={(e) => setNewAlert({...newAlert, value: Number(e.target.value)})}
            />
            
            <Button onClick={addAlert} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            Manage your existing alerts
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No alerts set up yet. Create your first alert above.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <Badge variant="outline">{alert.type}</Badge>
                    </div>
                    
                    <div>
                      <div className="font-medium">
                        {alert.asset} {alert.condition} ${alert.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`alert-${alert.id}`}>Active</Label>
                      <Switch
                        id={`alert-${alert.id}`}
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAlertSystem;
