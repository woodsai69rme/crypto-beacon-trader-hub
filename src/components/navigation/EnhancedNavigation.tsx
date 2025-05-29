
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Home, 
  TrendingUp, 
  Bot, 
  Settings, 
  Briefcase, 
  BarChart3, 
  Users, 
  GraduationCap,
  Zap,
  Newspaper
} from 'lucide-react';
import { useAiTrading } from '@/contexts/AiTradingContext';

const EnhancedNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { activeBots } = useAiTrading();

  const navigationItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: Home, 
      description: 'Overview and analytics' 
    },
    { 
      path: '/trading', 
      label: 'Trading', 
      icon: TrendingUp, 
      description: 'Manual and paper trading' 
    },
    { 
      path: '/ai', 
      label: 'AI Trading', 
      icon: Bot, 
      description: 'AI-powered trading bots',
      badge: activeBots.length > 0 ? activeBots.length.toString() : undefined
    },
    { 
      path: '/portfolio', 
      label: 'Portfolio', 
      icon: Briefcase, 
      description: 'Asset tracking and analytics' 
    },
    { 
      path: '/market', 
      label: 'Market Data', 
      icon: BarChart3, 
      description: 'Real-time market analysis' 
    },
    { 
      path: '/automation', 
      label: 'Automation', 
      icon: Zap, 
      description: 'N8N workflows and alerts' 
    },
    { 
      path: '/social', 
      label: 'Social Trading', 
      icon: Users, 
      description: 'Copy trading and community' 
    },
    { 
      path: '/education', 
      label: 'Education', 
      icon: GraduationCap, 
      description: 'Trading tutorials and resources' 
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'Platform configuration' 
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">Crypto Beacon</h2>
        <p className="text-sm text-muted-foreground">AI Trading Hub</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs opacity-70">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>© 2025 Crypto Beacon</p>
          <p>Paper Trading Mode Active</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Crypto Beacon</h1>
            <p className="text-xs text-muted-foreground">AI Trading Hub</p>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <NavigationContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-background border-r z-40">
        <NavigationContent />
      </div>

      {/* Mobile spacer */}
      <div className="lg:hidden h-20" />
    </>
  );
};

export default EnhancedNavigation;
