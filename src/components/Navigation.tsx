
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Bot, Workflow } from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Trading', icon: TrendingUp },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/bots', label: 'AI Bots', icon: Bot },
    { path: '/automation', label: 'Automation', icon: Workflow }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CryptoTrader Pro</span>
              <Badge variant="secondary" className="text-xs">AUD</Badge>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
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
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Real-time Data
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
