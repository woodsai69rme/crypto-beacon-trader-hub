
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const TradingCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<"day" | "month">("month");
  
  const events = [
    {
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      title: "BTC Options Expiry",
      type: "market",
      importance: "high"
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      title: "Eth Network Upgrade",
      type: "technical",
      importance: "medium"
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      title: "Fed Interest Rate Decision",
      type: "economic",
      importance: "high"
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      title: "BTC/USD Long Position",
      type: "trade",
      importance: "medium"
    }
  ];
  
  // Function to check if a day has an event
  const hasEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Function to get events for the selected day
  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  const today = new Date();

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Trading Calendar
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Monitor upcoming market events and your trading schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-7/12">
            <div className="bg-card rounded-md p-4 border border-border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => day && setDate(day)}
                className="rounded-md"
                modifiers={{
                  hasEvent: (day) => hasEvent(day)
                }}
                modifiersStyles={{
                  hasEvent: { 
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))", 
                    fontWeight: "bold" 
                  }
                }}
              />
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:w-5/12">
            <div className="bg-card rounded-md p-4 border border-border h-full">
              <h3 className="font-medium mb-3">
                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {getDayEvents(date).length > 0 ? (
                <div className="space-y-3">
                  {getDayEvents(date).map((event, idx) => (
                    <div key={idx} className="p-3 rounded-md bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.type === 'market' ? 'bg-blue-500/20 text-blue-500' : 
                          event.type === 'technical' ? 'bg-purple-500/20 text-purple-500' : 
                          event.type === 'economic' ? 'bg-yellow-500/20 text-yellow-600' : 
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-xs font-medium ${
                          event.importance === 'high' ? 'text-red-500' : 
                          event.importance === 'medium' ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>
                          {event.importance.charAt(0).toUpperCase() + event.importance.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <p>No events scheduled</p>
                  <Button variant="link" size="sm">Add Event</Button>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Upcoming Events</h4>
                <div className="space-y-2">
                  {events
                    .filter(event => event.date >= today)
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 rounded hover:bg-secondary/10">
                        <span>{event.title}</span>
                        <span className="text-muted-foreground">
                          {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingCalendar;
