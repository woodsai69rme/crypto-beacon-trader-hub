
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, ArrowLeft, ArrowRight, AlertCircle, TrendingUp, TrendingDown, Calendar as CalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

const TradingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [eventFilter, setEventFilter] = useState('all');
  
  // Example trading events
  const tradingEvents = [
    {
      id: "event-1",
      title: "FOMC Meeting",
      date: new Date(2023, 3, 25), // April 25, 2023
      type: "economic",
      impact: "high",
      description: "Federal Reserve interest rate decision and statement"
    },
    {
      id: "event-2",
      title: "BTC Quarterly Options Expiry",
      date: new Date(2023, 3, 28), // April 28, 2023
      type: "crypto",
      impact: "medium",
      description: "Bitcoin quarterly options contracts expire"
    },
    {
      id: "event-3",
      title: "US GDP Data",
      date: new Date(2023, 3, 27), // April 27, 2023
      type: "economic",
      impact: "medium",
      description: "Q1 2023 US GDP preliminary data release"
    },
    {
      id: "event-4",
      title: "ETH Shanghai Upgrade",
      date: new Date(2023, 3, 12), // April 12, 2023
      type: "crypto",
      impact: "high",
      description: "Ethereum network upgrade enabling staking withdrawals"
    },
    {
      id: "event-5",
      title: "US CPI Data",
      date: new Date(2023, 3, 14), // April 14, 2023
      type: "economic",
      impact: "high",
      description: "Consumer Price Index data - inflation metrics"
    },
    {
      id: "event-6",
      title: "Personal Trade: BTC Long",
      date: new Date(2023, 3, 15), // April 15, 2023
      type: "personal",
      impact: "low",
      description: "Entered BTC long position at $60,450",
      result: "profit",
      pnl: "+3.2%"
    },
    {
      id: "event-7",
      title: "Personal Trade: SOL Short",
      date: new Date(2023, 3, 20), // April 20, 2023
      type: "personal",
      impact: "low",
      description: "Entered SOL short position at $138",
      result: "loss",
      pnl: "-2.1%"
    },
  ];
  
  // Generate calendar days
  const generateCalendarDays = () => {
    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      return eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      });
    } else {
      // Week view
      const startOfWeek = currentDate;
      const endOfWeek = addDays(currentDate, 6);
      
      return eachDayOfInterval({
        start: startOfWeek,
        end: endOfWeek
      });
    }
  };
  
  // Filter events for a specific day
  const getEventsForDay = (day: Date) => {
    return tradingEvents.filter(event => {
      const sameDay = isSameDay(event.date, day);
      
      if (eventFilter === 'all') return sameDay;
      return sameDay && event.type === eventFilter;
    });
  };
  
  // Navigate to previous period (month/week)
  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      setCurrentDate(subDays(currentDate, 7));
    }
  };
  
  // Navigate to next period (month/week)
  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };
  
  // Get impact badge style
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Low</Badge>;
      default:
        return null;
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'economic':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'crypto':
        return <AlertCircle className="h-4 w-4 text-purple-400" />;
      case 'personal':
        return <CalendarIcon className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };
  
  const days = generateCalendarDays();
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Trading Calendar
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={view === 'month' ? 'bg-muted' : ''}
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={view === 'week' ? 'bg-muted' : ''}
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy')
                : `Week of ${format(currentDate, 'MMM d')} - ${format(addDays(currentDate, 6), 'MMM d, yyyy')}`
              }
            </h2>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="economic">Economic</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="personal">Personal Trades</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {view === 'month' ? (
          <div className="grid grid-cols-7 gap-px bg-muted p-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2 text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Empty spaces for days before the first day of month */}
            {Array.from({ length: days[0].getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2 bg-card border border-muted/10" />
            ))}
            
            {days.map((day) => {
              const events = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toString()}
                  className={`p-2 ${
                    isToday
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-card border border-muted/10'
                  }`}
                >
                  <div className="h-full flex flex-col">
                    <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="flex-1">
                      {events.length > 0 ? (
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-[10px] px-1 py-0.5 rounded truncate ${
                                event.impact === 'high'
                                  ? 'bg-red-500/10 border-l-2 border-red-500'
                                  : event.impact === 'medium'
                                  ? 'bg-amber-500/10 border-l-2 border-amber-500'
                                  : 'bg-muted/50 border-l-2 border-muted-foreground'
                              }`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          
                          {events.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Week view
          <div className="divide-y divide-border">
            {days.map((day) => {
              const events = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toString()}
                  className={`p-4 ${isToday ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    <div>
                      <div className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                        {format(day, 'EEEE')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(day, 'MMMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pl-10">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start gap-3 p-2 rounded-md bg-muted/20 border-l-2 border-primary/50"
                        >
                          <div className="mt-0.5">{getTypeIcon(event.type)}</div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{event.title}</div>
                              {getImpactBadge(event.impact)}
                            </div>
                            
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              <span>All day</span>
                            </div>
                            
                            <div className="text-sm mt-2">{event.description}</div>
                            
                            {event.type === 'personal' && (
                              <div className={`text-xs mt-1 flex items-center ${
                                event.result === 'profit' ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {event.result === 'profit' ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {event.pnl}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground p-2">No events</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingCalendar;
