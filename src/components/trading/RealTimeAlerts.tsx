
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing } from 'lucide-react';
import { CoinOption } from './types';
import { fetchCryptoData } from "@/services/cryptoService";

interface RealTimeAlertsProps {
  // Add props if needed
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = () => {
  const [marketData, setMarketData] = useState<CoinOption[]>([]);
  const [alerts, setAlerts] = useState<{
    id: string;
    coin: string;
    type: 'price' | 'volatility' | 'volume' | 'trend';
    message: string;
    severity: 'info' | 'warning' | 'critical';
    timestamp: Date;
  }[]>([]);
  
  // Fetch crypto data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoData();
        // Convert to CoinOption format
        const formattedData: CoinOption[] = data.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          image: coin.image,
          priceChange: coin.price_change_24h,
          changePercent: coin.price_change_percentage_24h,
          volume: coin.total_volume,
          marketCap: coin.market_cap,
          value: coin.id,
          label: `${coin.name} (${coin.symbol.toUpperCase()})`
        }));
        
        setMarketData(formattedData);
        
        // Generate mock alerts
        generateMockAlerts(formattedData);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };
    
    fetchData();
    
    // Set up interval to update data
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateMockAlerts = (coins: CoinOption[]) => {
    if (coins.length === 0) return;
    
    const mockAlertTypes = [
      { type: 'price', message: 'Price increased by more than 5% in the last hour' },
      { type: 'price', message: 'Price dropped by more than 3% in the last hour' },
      { type: 'volatility', message: 'Unusual volatility detected' },
      { type: 'volume', message: 'Trading volume spiked by 150%' },
      { type: 'trend', message: 'Possible trend reversal detected' },
      { type: 'price', message: 'Price approaching resistance level' },
      { type: 'price', message: 'Price approaching support level' }
    ];
    
    // Generate 3-7 random alerts
    const alertCount = Math.floor(Math.random() * 5) + 3;
    const newAlerts = [];
    
    for (let i = 0; i < alertCount; i++) {
      const randomCoin = coins[Math.floor(Math.random() * coins.length)];
      const randomAlert = mockAlertTypes[Math.floor(Math.random() * mockAlertTypes.length)];
      const randomSeverity = Math.random() < 0.2 ? 'critical' : Math.random() < 0.5 ? 'warning' : 'info';
      
      // Create a random time in the past 24 hours
      const randomTime = new Date();
      randomTime.setHours(randomTime.getHours() - Math.floor(Math.random() * 24));
      
      newAlerts.push({
        id: `alert-${i}-${Date.now()}`,
        coin: randomCoin.symbol,
        type: randomAlert.type as 'price' | 'volatility' | 'volume' | 'trend',
        message: randomAlert.message,
        severity: randomSeverity as 'info' | 'warning' | 'critical',
        timestamp: randomTime
      });
    }
    
    // Sort by time (newest first)
    newAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setAlerts(newAlerts);
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              Real-Time Market Alerts
            </CardTitle>
            <CardDescription>
              Automated alerts based on market conditions
            </CardDescription>
          </div>
          
          {alerts.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {alerts.length} alerts
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No market alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="border border-border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        alert.severity === 'critical' ? 'bg-red-500' : 
                        alert.severity === 'warning' ? 'bg-amber-500' : 
                        'bg-blue-500'
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{alert.coin}</span>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {alert.type}
                  </Badge>
                </div>
                
                <p className="mt-2 text-sm">{alert.message}</p>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  {formatTime(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
