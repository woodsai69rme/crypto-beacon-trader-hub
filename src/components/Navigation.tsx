
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Bot, 
  BarChart3, 
  Activity,
  Settings,
  Globe
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { activeCurrency, formatCurrency } = useCurrency();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/trading', label: 'Trading', icon: TrendingUp },
    { path: '/ai-bots', label: 'AI Bots', icon: Bot },
    { path: '/analytics', label: 'Analytics', icon: Activity },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CryptoTrader</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Data
            </Badge>
            
            <Badge variant="secondary">
              {activeCurrency}
            </Badge>
            
            <div className="text-sm text-muted-foreground">
              Paper Trading Mode
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
