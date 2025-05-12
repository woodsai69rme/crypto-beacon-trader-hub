
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Layout, 
  BarChart2, 
  Calculator, 
  BarChart,
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/custom-dashboard', label: 'Custom Dashboard', icon: Layout },
    { path: '/analytics', label: 'Analytics', icon: BarChart },
    { path: '/analytics-dashboard', label: 'Analytics Dashboard', icon: BarChart2 },
    { path: '/tax-calculator', label: 'Tax Calculator', icon: Calculator },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="outline" 
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {/* Sidebar for both mobile and desktop */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-background border-r z-40 transition-all duration-300",
        expanded ? "w-64" : "w-16",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className={cn(
              "font-bold text-xl transition-opacity",
              expanded ? "opacity-100" : "opacity-0 md:hidden"
            )}>
              Trading Platform
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={toggleSidebar}
            >
              {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          
          <div className="flex-1 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2.5 transition-colors",
                  location.pathname === item.path
                    ? "bg-muted/80 font-medium"
                    : "hover:bg-muted/50",
                  expanded ? "justify-start" : "justify-center"
                )}
              >
                <item.icon size={20} />
                <span className={cn(
                  "ml-3 transition-all",
                  expanded ? "opacity-100" : "opacity-0 w-0 hidden"
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="p-4 border-t flex justify-center">
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                expanded ? "" : "p-2"
              )}
            >
              <BarChart2 size={16} className="mr-2" />
              <span className={cn(
                expanded ? "opacity-100" : "opacity-0 w-0 hidden"
              )}>
                Status: Live
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-30 transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
};

export default Sidebar;
