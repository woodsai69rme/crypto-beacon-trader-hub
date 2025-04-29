
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Globe, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MarketHours = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [activeTab, setActiveTab] = useState("crypto");
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTimeForTimezone = (date: Date, timezone: string) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
      hour12: true
    });
  };
  
  const formatDateForTimezone = (date: Date, timezone: string) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });
  };
  
  const cryptoExchanges = [
    {
      name: "Binance",
      status: "open",
      hours: "24/7",
      maintenanceTime: "Variable, announced in advance",
      location: "Global",
      timezone: "UTC",
      website: "binance.com"
    },
    {
      name: "Coinbase",
      status: "open",
      hours: "24/7",
      maintenanceTime: "Variable, typically low-volume periods",
      location: "United States",
      timezone: "America/Los_Angeles",
      website: "coinbase.com"
    },
    {
      name: "Kraken",
      status: "open",
      hours: "24/7",
      maintenanceTime: "Wednesdays, typically 00:00-02:00 UTC",
      location: "United States",
      timezone: "America/Los_Angeles",
      website: "kraken.com"
    },
    {
      name: "FTX (Bankrupt)",
      status: "closed",
      hours: "N/A",
      maintenanceTime: "N/A",
      location: "Bahamas",
      timezone: "America/Nassau",
      website: "ftx.com"
    },
    {
      name: "OKX",
      status: "open",
      hours: "24/7",
      maintenanceTime: "Variable",
      location: "Seychelles",
      timezone: "Indian/Mahe",
      website: "okx.com"
    },
    {
      name: "Bybit",
      status: "open",
      hours: "24/7",
      maintenanceTime: "Variable",
      location: "Singapore",
      timezone: "Asia/Singapore",
      website: "bybit.com"
    },
  ];
  
  const traditionalExchanges = [
    {
      name: "New York Stock Exchange (NYSE)",
      status: isMarketOpen("America/New_York", 9, 30, 16, 0, [0, 6]) ? "open" : "closed",
      hours: "9:30 AM - 4:00 PM ET, Mon-Fri",
      location: "United States",
      timezone: "America/New_York",
      website: "nyse.com"
    },
    {
      name: "Nasdaq",
      status: isMarketOpen("America/New_York", 9, 30, 16, 0, [0, 6]) ? "open" : "closed",
      hours: "9:30 AM - 4:00 PM ET, Mon-Fri",
      location: "United States",
      timezone: "America/New_York",
      website: "nasdaq.com"
    },
    {
      name: "London Stock Exchange (LSE)",
      status: isMarketOpen("Europe/London", 8, 0, 16, 30, [0, 6]) ? "open" : "closed",
      hours: "8:00 AM - 4:30 PM GMT, Mon-Fri",
      location: "United Kingdom",
      timezone: "Europe/London",
      website: "londonstockexchange.com"
    },
    {
      name: "Tokyo Stock Exchange (TSE)",
      status: isMarketOpen("Asia/Tokyo", 9, 0, 15, 0, [0, 6]) ? "open" : "closed",
      hours: "9:00 AM - 3:00 PM JST, Mon-Fri",
      location: "Japan",
      timezone: "Asia/Tokyo",
      website: "jpx.co.jp"
    },
    {
      name: "Shanghai Stock Exchange (SSE)",
      status: isMarketOpen("Asia/Shanghai", 9, 30, 15, 0, [0, 6]) ? "open" : "closed",
      hours: "9:30 AM - 3:00 PM CST, Mon-Fri",
      location: "China",
      timezone: "Asia/Shanghai",
      website: "sse.com.cn"
    },
    {
      name: "Frankfurt Stock Exchange (FRA)",
      status: isMarketOpen("Europe/Berlin", 9, 0, 17, 30, [0, 6]) ? "open" : "closed",
      hours: "9:00 AM - 5:30 PM CET, Mon-Fri",
      location: "Germany",
      timezone: "Europe/Berlin",
      website: "deutsche-boerse.com"
    },
  ];
  
  // Forex markets
  const forexMarkets = [
    {
      name: "Sydney Session",
      status: isMarketOpen("Australia/Sydney", 7, 0, 16, 0, [6, 0]) ? "open" : "closed",
      hours: "7:00 AM - 4:00 PM AEST, Mon-Fri",
      location: "Australia",
      timezone: "Australia/Sydney",
    },
    {
      name: "Tokyo Session",
      status: isMarketOpen("Asia/Tokyo", 9, 0, 18, 0, [6, 0]) ? "open" : "closed",
      hours: "9:00 AM - 6:00 PM JST, Mon-Fri",
      location: "Japan",
      timezone: "Asia/Tokyo",
    },
    {
      name: "London Session",
      status: isMarketOpen("Europe/London", 8, 0, 17, 0, [6, 0]) ? "open" : "closed",
      hours: "8:00 AM - 5:00 PM BST, Mon-Fri",
      location: "United Kingdom",
      timezone: "Europe/London",
    },
    {
      name: "New York Session",
      status: isMarketOpen("America/New_York", 8, 0, 17, 0, [6, 0]) ? "open" : "closed",
      hours: "8:00 AM - 5:00 PM ET, Mon-Fri",
      location: "United States",
      timezone: "America/New_York",
    },
  ];
  
  // Function to check if a market is open based on timezone and hours
  function isMarketOpen(
    timezone: string,
    openHour: number,
    openMinute: number,
    closeHour: number,
    closeMinute: number,
    closedDays: number[] = [] // 0 = Sunday, 6 = Saturday
  ) {
    const now = new Date();
    
    // Create date objects in the market's timezone
    const options = { timeZone: timezone };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toLocaleTimeString('en-US', options);
    
    // Get day of week in the market's timezone (0 = Sunday, 6 = Saturday)
    const dayOfWeek = new Date(dateStr).getDay();
    
    // Check if it's a closed day
    if (closedDays.includes(dayOfWeek)) {
      return false;
    }
    
    // Parse current time in the market's timezone
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Check if current time is within trading hours
    const currentMinutes = hours * 60 + minutes;
    const openTimeMinutes = openHour * 60 + openMinute;
    const closeTimeMinutes = closeHour * 60 + closeMinute;
    
    return currentMinutes >= openTimeMinutes && currentMinutes < closeTimeMinutes;
  }
  
  // Calculate time until market opens or closes
  function getTimeUntilChange(
    status: string,
    timezone: string,
    openHour: number,
    openMinute: number,
    closeHour: number,
    closeMinute: number,
    closedDays: number[] = []
  ) {
    // This is a simplified implementation - a real one would need to handle multi-day calculations
    // and timezone differences properly
    return "Coming soon";
  }
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Global Market Hours
          </CardTitle>
          
          <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">New York (ET)</SelectItem>
              <SelectItem value="America/Los_Angeles">Los Angeles (PT)</SelectItem>
              <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
              <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
              <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
              <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 bg-muted/10 border-y border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                Current time: <span className="font-medium">{formatTimeForTimezone(currentTime, selectedTimezone)}</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {formatDateForTimezone(currentTime, selectedTimezone)}
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="stocks">Stock Exchanges</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crypto" className="mt-4 space-y-4">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Exchange</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3 hidden sm:table-cell">Hours</th>
                    <th className="text-left p-3 hidden lg:table-cell">Maintenance</th>
                    <th className="text-left p-3 hidden md:table-cell">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cryptoExchanges.map((exchange) => (
                    <tr key={exchange.name} className="hover:bg-muted/20">
                      <td className="p-3 font-medium">{exchange.name}</td>
                      <td className="p-3">
                        {exchange.status === "open" ? (
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Closed
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 hidden sm:table-cell">{exchange.hours}</td>
                      <td className="p-3 hidden lg:table-cell">{exchange.maintenanceTime}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {exchange.location}
                          <ArrowRight className="h-3 w-3" />
                          {exchange.timezone.split('/')[1] || exchange.timezone}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Cryptocurrency markets operate 24/7, but exchange maintenance windows or extreme market conditions may temporarily affect trading.
            </div>
          </TabsContent>
          
          <TabsContent value="stocks" className="mt-4 space-y-4">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Exchange</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3 hidden sm:table-cell">Trading Hours</th>
                    <th className="text-left p-3 hidden md:table-cell">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {traditionalExchanges.map((exchange) => (
                    <tr key={exchange.name} className="hover:bg-muted/20">
                      <td className="p-3 font-medium">{exchange.name}</td>
                      <td className="p-3">
                        {exchange.status === "open" ? (
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Closed
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 hidden sm:table-cell">{exchange.hours}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {exchange.location}
                          <ArrowRight className="h-3 w-3" />
                          {exchange.timezone.split('/')[1] || exchange.timezone}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Stock markets have fixed trading hours and are typically closed on weekends and holidays.
              Pre-market and after-hours trading may be available on some exchanges.
            </div>
          </TabsContent>
          
          <TabsContent value="forex" className="mt-4 space-y-4">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Session</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3 hidden sm:table-cell">Hours</th>
                    <th className="text-left p-3 hidden md:table-cell">Timezone</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {forexMarkets.map((market) => (
                    <tr key={market.name} className="hover:bg-muted/20">
                      <td className="p-3 font-medium">{market.name}</td>
                      <td className="p-3">
                        {market.status === "open" ? (
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 hidden sm:table-cell">{market.hours}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {market.location}
                          <ArrowRight className="h-3 w-3" />
                          {market.timezone.split('/')[1] || market.timezone}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-xs text-muted-foreground">
              The forex market operates 24 hours a day, 5 days a week, with trading sessions overlapping
              as different financial centers around the world open and close.
            </div>
            
            <div className="bg-muted/20 p-4 rounded-md">
              <h3 className="font-medium text-sm mb-1">Forex Market Activity</h3>
              <div className="grid grid-cols-24 gap-0 h-8 rounded overflow-hidden">
                {/* Representing 24 hour time blocks with color coding for activity levels */}
                {Array.from({ length: 24 }).map((_, hour) => {
                  let activityLevel = 'bg-muted/30'; // Default low activity
                  
                  // High activity periods (overlap of sessions)
                  if ((hour >= 8 && hour < 10) || (hour >= 13 && hour < 16)) {
                    activityLevel = 'bg-green-500/50';
                  }
                  // Medium activity
                  else if ((hour >= 3 && hour < 8) || (hour >= 10 && hour < 13) || (hour >= 16 && hour < 20)) {
                    activityLevel = 'bg-green-500/30';
                  }
                  
                  return (
                    <div key={hour} className={`h-full ${activityLevel}`}>
                      <div className="h-full"></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>00:00 UTC</span>
                <span>12:00 UTC</span>
                <span>23:59 UTC</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketHours;
