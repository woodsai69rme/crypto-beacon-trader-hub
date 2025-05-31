
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { value: "/", label: "Overview", path: "/" },
    { value: "/trading", label: "Paper Trading", path: "/trading" },
    { value: "/ai-bots", label: "AI Bots", path: "/ai-bots" },
    { value: "/analytics", label: "Analytics", path: "/analytics" },
    { value: "/status", label: "Project Status", path: "/status", badge: "Complete" }
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                CB
              </div>
              <h1 className="text-xl font-bold">Crypto Beacon Trader Hub</h1>
            </Link>
          </div>
          
          <Tabs value={currentPath} className="w-auto">
            <TabsList className="grid grid-cols-5 w-fit">
              {navigationItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  asChild
                  className="relative"
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <Badge className="bg-green-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
