
import React from 'react';
import { useUI } from '@/contexts/UIContext';
import { ChevronLeft, ChevronRight, LayoutDashboard, LineChart, Bot, BookOpen, Users, Settings, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SidebarPanel: React.FC = () => {
  const { sidebarSettings, updateSidebarSettings } = useUI();
  const { collapsed = false, showLabels = true } = sidebarSettings;
  
  const toggleCollapsed = () => {
    updateSidebarSettings({
      ...sidebarSettings,
      collapsed: !collapsed
    });
  };
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trading', label: 'Trading', icon: LineChart },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'ai', label: 'AI Trading', icon: Bot },
    { id: 'news', label: 'News & Events', icon: BookOpen },
    { id: 'social', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={cn(
        "h-full border-r border-border bg-background transition-all duration-300 relative",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                CT
              </div>
              <span className="ml-2 font-semibold">Crypto Trader</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn("p-0 h-8 w-8", collapsed && "ml-auto")}
            onClick={toggleCollapsed}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start",
                collapsed && "p-3"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && showLabels && <span className="ml-3">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarPanel;
