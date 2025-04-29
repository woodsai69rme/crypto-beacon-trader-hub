
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const TradingCalendar: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // Mock data for trading events
  const tradingEvents = [
    { date: 3, type: "win", profit: 320 },
    { date: 5, type: "loss", loss: 120 },
    { date: 8, type: "win", profit: 450 },
    { date: 12, type: "win", profit: 180 },
    { date: 17, type: "loss", loss: 240 },
    { date: 21, type: "win", profit: 510 },
    { date: 25, type: "loss", loss: 90 },
    { date: 28, type: "win", profit: 370 },
  ];
  
  const getMonthDays = () => {
    // Get number of days in current month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  const renderDays = () => {
    const totalDays = getMonthDays();
    const firstDay = getFirstDayOfMonth();
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(
        <div key={`empty-${i}`} className="h-14 border border-border/30 bg-muted/10 rounded-md"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const event = tradingEvents.find(event => event.date === day);
      
      daysArray.push(
        <div 
          key={`day-${day}`} 
          className={`h-14 border border-border/40 p-1 rounded-md relative hover:bg-muted/20 transition-colors ${
            day === currentDate.getDate() ? "bg-primary/10 border-primary/30" : "bg-muted/5"
          }`}
        >
          <div className="absolute top-1 left-1 text-xs">{day}</div>
          
          {event && (
            <div 
              className={`absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                event.type === "win" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
              }`}
            >
              {event.type === "win" ? "W" : "L"}
            </div>
          )}
          
          {event && (
            <div 
              className={`text-xs absolute bottom-1 left-1 font-medium ${
                event.type === "win" ? "text-green-500" : "text-red-500"
              }`}
            >
              {event.type === "win" ? `+$${event.profit}` : `-$${event.loss}`}
            </div>
          )}
        </div>
      );
    }
    
    return daysArray;
  };
  
  return (
    <Card className="border border-border shadow-lg">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-bold">{currentMonth} {currentYear}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline">Today</Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-1">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className="flex gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">Winning Trades: 5</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs">Losing Trades: 3</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Win Rate: 62.5%</div>
        </div>
        
        <div className="bg-muted/20 p-3 rounded-lg">
          <div className="text-sm font-medium mb-1">Monthly Performance</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-500">+$1,670.00</span>
            <span className="text-xs text-muted-foreground">8 trading days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingCalendar;
