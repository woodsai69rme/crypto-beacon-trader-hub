
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  LineChart, 
  BarChart3, 
  BookOpen, 
  Users, 
  Settings,
  Wallet,
  Bot,
  Bell,
  AreaChart,
  Sigma,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUI } from '@/contexts/UIContext';

const SidebarPanel: React.FC = () => {
  const { sidebarSettings, updateSidebarSettings } = useUI();
  const [isCollapsed, setIsCollapsed] = useState(sidebarSettings.defaultCollapsed || false);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
        { icon: LineChart, label: 'Trading', href: '#' },
        { icon: Wallet, label: 'Portfolio', href: '#' },
      ]
    },
    {
      section: 'Analysis',
      items: [
        { icon: BarChart3, label: 'Market Data', href: '#' },
        { icon: AreaChart, label: 'Technical Analysis', href: '#' },
        { icon: Sigma, label: 'Fundamentals', href: '#' },
      ]
    },
    {
      section: 'AI Trading',
      items: [
        { icon: Bot, label: 'AI Bots', href: '#' },
        { icon: AlertTriangle, label: 'Alerts', href: '#' },
        { icon: FileText, label: 'Strategies', href: '#' },
      ]
    },
    {
      section: 'Community',
      items: [
        { icon: BookOpen, label: 'News & Events', href: '#' },
        { icon: Users, label: 'Social Trading', href: '#' },
        { icon: Bell, label: 'Notifications', href: '#' },
      ]
    }
  ];
  
  return (
    <aside className={cn(
      "h-[calc(100vh-4rem)] sticky top-16 bg-card border-r border-border overflow-y-auto transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full p-2">
        <div className="flex justify-end py-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <TooltipProvider delayDuration={300}>
          <div className="space-y-6 flex-1">
            {menuItems.map((section) => (
              <div key={section.section} className="space-y-2">
                {!isCollapsed && (
                  <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.section}
                  </div>
                )}
                
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Tooltip key={item.label} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <a
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                            isCollapsed ? "justify-center" : "justify-start"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
                          {!isCollapsed && <span>{item.label}</span>}
                        </a>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
        
        <Separator className="my-4" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <Settings className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && <span>Settings</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Settings
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default SidebarPanel;
