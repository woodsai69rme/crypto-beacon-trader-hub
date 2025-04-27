
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, Trash2, Plus, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  price: number;
  condition: "above" | "below";
  createdAt: Date;
  triggered: boolean;
}

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlertCoin, setNewAlertCoin] = useState<string>("bitcoin");
  const [newAlertPrice, setNewAlertPrice] = useState<string>("");
  const [newAlertCondition, setNewAlertCondition] = useState<"above" | "below">("above");
  
  // Available coins
  const availableCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", currentPrice: 61245.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", currentPrice: 3010.45 },
    { id: "solana", name: "Solana", symbol: "SOL", currentPrice: 142.87 },
    { id: "cardano", name: "Cardano", symbol: "ADA", currentPrice: 0.45 },
    { id: "ripple", name: "XRP", symbol: "XRP", currentPrice: 0.57 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", currentPrice: 0.14 },
  ];
  
  // Create a new alert
  const createAlert = () => {
    const selectedCoin = availableCoins.find(coin => coin.id === newAlertCoin);
    if (!selectedCoin) return;
    
    const price = parseFloat(newAlertPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }
    
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      price,
      condition: newAlertCondition,
      createdAt: new Date(),
      triggered: false
    };
    
    setAlerts(prev => [...prev, newAlert]);
    setNewAlertPrice("");
    
    toast({
      title: "Alert Created",
      description: `Alert for ${selectedCoin.symbol} ${newAlertCondition} $${price} created`,
    });
  };
  
  // Delete an alert
  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Simulate price checking for alerts
  useEffect(() => {
    const checkAlertsInterval = setInterval(() => {
      setAlerts(prev => {
        const updatedAlerts = [...prev];
        let alertTriggered = false;
        
        for (let i = 0; i < updatedAlerts.length; i++) {
          if (updatedAlerts[i].triggered) continue;
          
          const alert = updatedAlerts[i];
          const coin = availableCoins.find(c => c.id === alert.coinId);
          
          if (coin) {
            // Simulate price fluctuations
            const currentPrice = coin.currentPrice * (0.98 + Math.random() * 0.04);
            
            // Check if alert condition is met
            const isTriggered = 
              (alert.condition === "above" && currentPrice > alert.price) ||
              (alert.condition === "below" && currentPrice < alert.price);
              
            if (isTriggered) {
              updatedAlerts[i] = {
                ...alert,
                triggered: true
              };
              
              alertTriggered = true;
              
              // Show toast notification
              toast({
                title: "Price Alert Triggered",
                description: `${alert.coinSymbol} price is now ${alert.condition} $${alert.price}`,
                variant: "destructive"
              });
            }
          }
        }
        
        return alertTriggered ? updatedAlerts : prev;
      });
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkAlertsInterval);
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5" />
            Price Alerts
          </CardTitle>
        </div>
        <CardDescription>
          Get notified when prices reach your target
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Create new alert form */}
          <div className="bg-muted/40 p-3 rounded-lg border">
            <h3 className="text-sm font-medium mb-2">Create New Alert</h3>
            <div className="grid grid-cols-12 gap-2">
              <Select 
                value={newAlertCoin}
                onValueChange={setNewAlertCoin}
                className="col-span-4"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {availableCoins.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={newAlertCondition}
                onValueChange={(value) => setNewAlertCondition(value as "above" | "below")}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
              
              <Input 
                type="number"
                placeholder="Price"
                value={newAlertPrice}
                onChange={(e) => setNewAlertPrice(e.target.value)}
                className="col-span-3"
              />
              
              <Button 
                onClick={createAlert}
                className="col-span-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* List of active alerts */}
          <div>
            <h3 className="text-sm font-medium mb-2">Active Alerts</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border flex justify-between items-center ${
                      alert.triggered ? "bg-amber-500/10 border-amber-500/30" : "bg-muted/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{alert.coinSymbol}</span>
                        <span className="mx-1 text-muted-foreground">{alert.condition}</span>
                        <span className="font-medium">${alert.price.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Created {new Date(alert.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {alert.triggered && (
                        <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Triggered
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  No active alerts. Create one above.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
