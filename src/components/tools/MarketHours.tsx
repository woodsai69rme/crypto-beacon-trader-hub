
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MarketHours: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = React.useState("crypto");
  
  const markets = {
    crypto: {
      name: "Cryptocurrency Markets",
      hours: "24/7",
      status: "open",
      exchanges: [
        { name: "Binance", status: "open", nextClose: null, nextOpen: null },
        { name: "Coinbase", status: "open", nextClose: null, nextOpen: null },
        { name: "Kraken", status: "open", nextClose: null, nextOpen: null },
        { name: "FTX", status: "maintenance", nextClose: null, nextOpen: "April 30, 2023 - 02:00 UTC" },
        { name: "Huobi", status: "open", nextClose: null, nextOpen: null }
      ]
    },
    us: {
      name: "US Stock Markets",
      hours: "9:30 AM - 4:00 PM ET (Mon-Fri)",
      status: getCurrentUSMarketStatus(),
      exchanges: [
        { name: "NYSE", status: getCurrentUSMarketStatus(), nextClose: getNextUSMarketClose(), nextOpen: getNextUSMarketOpen() },
        { name: "NASDAQ", status: getCurrentUSMarketStatus(), nextClose: getNextUSMarketClose(), nextOpen: getNextUSMarketOpen() },
        { name: "CBOE", status: getCurrentUSMarketStatus(), nextClose: getNextUSMarketClose(), nextOpen: getNextUSMarketOpen() }
      ]
    },
    forex: {
      name: "Forex Markets",
      hours: "24/5 (Sun 5PM - Fri 5PM ET)",
      status: getCurrentForexMarketStatus(),
      exchanges: [
        { name: "FX Market", status: getCurrentForexMarketStatus(), nextClose: getNextForexMarketClose(), nextOpen: getNextForexMarketOpen() }
      ]
    },
    asia: {
      name: "Asian Stock Markets",
      hours: "Various (Mon-Fri)",
      status: "closed", // Simplified for demo
      exchanges: [
        { name: "Tokyo Stock Exchange", status: "closed", nextClose: null, nextOpen: "Next trading day" },
        { name: "Hong Kong Stock Exchange", status: "closed", nextClose: null, nextOpen: "Next trading day" },
        { name: "Shanghai Stock Exchange", status: "closed", nextClose: null, nextOpen: "Next trading day" }
      ]
    }
  };
  
  function getCurrentUSMarketStatus() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Weekend check
    if (day === 0 || day === 6) return "closed";
    
    // Convert to ET (assuming ET is UTC-4, simplified)
    const etHours = (hours + 20) % 24; // Simplified conversion
    
    // Check if within trading hours (9:30 AM to 4:00 PM ET)
    if (etHours > 9 || (etHours === 9 && minutes >= 30)) {
      if (etHours < 16) return "open";
    }
    
    return "closed";
  }
  
  function getCurrentForexMarketStatus() {
    const now = new Date();
    const day = now.getDay();
    
    // Sunday 5PM ET to Friday 5PM ET
    if (day === 0) return "closed"; // Sunday before 5PM ET
    if (day === 5) return "open"; // Friday before 5PM ET
    if (day === 6) return "closed"; // Saturday
    
    return "open"; // Monday to Thursday
  }
  
  function getNextUSMarketOpen() {
    return "9:30 AM ET tomorrow";
  }
  
  function getNextUSMarketClose() {
    return "4:00 PM ET today";
  }
  
  function getNextForexMarketOpen() {
    return "Sunday 5:00 PM ET";
  }
  
  function getNextForexMarketClose() {
    return "Friday 5:00 PM ET";
  }
  
  const selectedMarketData = markets[selectedMarket as keyof typeof markets];

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Market Hours
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Trading hours for global financial markets
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium block mb-2">Select Market</label>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger>
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crypto">Cryptocurrency Markets</SelectItem>
              <SelectItem value="us">US Stock Markets</SelectItem>
              <SelectItem value="forex">Forex Markets</SelectItem>
              <SelectItem value="asia">Asian Stock Markets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="border-t border-border pt-4">
          <h3 className="text-xl font-medium">{selectedMarketData.name}</h3>
          <div className="flex items-center mt-2">
            <div className="flex items-center mr-4">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{selectedMarketData.hours}</span>
            </div>
            <div className="flex items-center">
              <span className={`h-2.5 w-2.5 rounded-full mr-1 ${
                selectedMarketData.status === 'open' ? 'bg-green-500' : 
                selectedMarketData.status === 'maintenance' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}></span>
              <span className="text-sm font-medium">{selectedMarketData.status.charAt(0).toUpperCase() + selectedMarketData.status.slice(1)}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Exchanges</h4>
            <div className="space-y-3">
              {selectedMarketData.exchanges.map((exchange, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/10 rounded-md">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{exchange.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span 
                      className={`h-2 w-2 rounded-full mr-1.5 ${
                        exchange.status === 'open' ? 'bg-green-500' : 
                        exchange.status === 'maintenance' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                    ></span>
                    <span 
                      className={`text-sm ${
                        exchange.status === 'open' ? 'text-green-500' : 
                        exchange.status === 'maintenance' ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}
                    >
                      {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Next Schedule</h4>
            <div className="space-y-3">
              {selectedMarketData.status === 'open' && selectedMarketData.exchanges[0].nextClose && (
                <div className="p-3 bg-red-500/10 rounded-md border border-red-500/20">
                  <span className="text-sm font-medium">Market Closes:</span>
                  <span className="text-sm ml-2">{selectedMarketData.exchanges[0].nextClose}</span>
                </div>
              )}
              {selectedMarketData.status === 'closed' && selectedMarketData.exchanges[0].nextOpen && (
                <div className="p-3 bg-green-500/10 rounded-md border border-green-500/20">
                  <span className="text-sm font-medium">Market Opens:</span>
                  <span className="text-sm ml-2">{selectedMarketData.exchanges[0].nextOpen}</span>
                </div>
              )}
              
              {selectedMarketData.status === 'maintenance' && selectedMarketData.exchanges.some(e => e.status === 'maintenance' && e.nextOpen) && (
                <div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                  <span className="text-sm font-medium">Maintenance Ends:</span>
                  <span className="text-sm ml-2">
                    {selectedMarketData.exchanges.find(e => e.status === 'maintenance')?.nextOpen}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 border-t border-border pt-4">
            <h4 className="font-medium mb-1">Current Time</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary/10 rounded-md">
                <span className="text-xs text-muted-foreground block">Local Time</span>
                <span className="font-mono font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="p-3 bg-secondary/10 rounded-md">
                <span className="text-xs text-muted-foreground block">UTC</span>
                <span className="font-mono font-medium">
                  {new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketHours;
