
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "launch" | "fork" | "conference" | "report" | "other";
  description: string;
}

const MarketCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });
  
  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Bitcoin Halving",
      date: "2024-04-17",
      type: "fork",
      description: "The Bitcoin block reward will be reduced by 50%"
    },
    {
      id: "2",
      title: "Ethereum Shanghai Update",
      date: "2024-04-12",
      type: "fork",
      description: "Major Ethereum network upgrade"
    },
    {
      id: "3",
      title: "Cardano Summit",
      date: "2024-04-23",
      type: "conference",
      description: "Annual conference for Cardano ecosystem"
    },
    {
      id: "4",
      title: "Solana New DeFi Protocol Launch",
      date: "2024-05-05",
      type: "launch",
      description: "Major new DeFi protocol launching on Solana"
    },
    {
      id: "5",
      title: "Fed Interest Rate Decision",
      date: "2024-05-15",
      type: "report",
      description: "Federal Reserve interest rate announcement"
    }
  ];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const previousMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  };
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth.year, currentMonth.month);
    
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === currentMonth.month && 
        today.getFullYear() === currentMonth.year;
      
      days.push(
        <div 
          key={day} 
          className={`relative flex h-8 w-8 items-center justify-center rounded-full text-sm
            ${isToday ? "bg-primary text-primary-foreground" : ""}
            ${dayEvents.length > 0 ? "font-bold" : ""}
          `}
        >
          {day}
          {dayEvents.length > 0 && (
            <span 
              className="absolute -bottom-1 h-1 w-1 rounded-full bg-crypto-bitcoin"
              title={dayEvents.map(e => e.title).join(', ')}
            ></span>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const renderUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    
    return (
      <div className="mt-4 space-y-3">
        <h3 className="text-sm font-medium">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        ) : (
          upcomingEvents.map(event => (
            <div key={event.id} className="rounded-md border border-border p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <span 
                  className={`rounded-full px-2 py-0.5 text-xs
                    ${event.type === 'launch' ? 'bg-crypto-green/20 text-crypto-green' : ''}
                    ${event.type === 'fork' ? 'bg-crypto-bitcoin/20 text-crypto-bitcoin' : ''}
                    ${event.type === 'conference' ? 'bg-crypto-ethereum/20 text-crypto-ethereum' : ''}
                    ${event.type === 'report' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                    ${event.type === 'other' ? 'bg-gray-500/20 text-gray-400' : ''}
                  `}
                >
                  {event.type}
                </span>
              </div>
              <h4 className="mt-1 text-sm font-medium">{event.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
            </div>
          ))
        )}
      </div>
    );
  };
  
  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">Market Calendar</h2>
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <Button variant="ghost" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">
          {monthNames[currentMonth.month]} {currentMonth.year}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      
      <div className="mt-1 grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
      
      {renderUpcomingEvents()}
    </div>
  );
};

export default MarketCalendar;
