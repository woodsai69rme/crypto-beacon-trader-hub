
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Settings, CreditCard, TestTube } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { value: "/", label: "Overview", path: "/" },
    { value: "/trading", label: "Paper Trading", path: "/trading" },
    { value: "/ai-bots", label: "AI Bots", path: "/ai-bots" },
    { value: "/analytics", label: "Analytics", path: "/analytics" },
    { value: "/status", label: "Project Status", path: "/status", badge: "Complete" },
    { value: "/testing", label: "Testing", path: "/testing", badge: "New" }
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
            <TabsList className="grid grid-cols-6 w-fit">
              {navigationItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  asChild
                  className="relative"
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    {item.label === "Testing" && <TestTube className="h-4 w-4" />}
                    {item.label}
                    {item.badge && (
                      <Badge className={`text-xs ${
                        item.badge === "New" ? "bg-blue-500" : "bg-green-500"
                      } text-white`}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:block">
              Demo Mode
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>DM</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="text-sm font-medium leading-none">Demo Mode</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Authentication Disabled
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/subscription" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/testing" className="cursor-pointer">
                    <TestTube className="mr-2 h-4 w-4" />
                    <span>Platform Testing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
