
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Bot, 
  Wallet, 
  LineChart, 
  Star,
  BarChart,
  Settings,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

const MobileNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t flex justify-around items-center md:hidden">
      <Button variant="ghost" className="h-16 flex flex-col justify-center items-center gap-1 rounded-none flex-1">
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-xs">Dashboard</span>
      </Button>
      
      <Button variant="ghost" className="h-16 flex flex-col justify-center items-center gap-1 rounded-none flex-1">
        <Bot className="h-5 w-5" />
        <span className="text-xs">AI</span>
      </Button>
      
      <Button variant="ghost" className="h-16 flex flex-col justify-center items-center gap-1 rounded-none flex-1">
        <Wallet className="h-5 w-5" />
        <span className="text-xs">Portfolio</span>
      </Button>
      
      <Button variant="ghost" className="h-16 flex flex-col justify-center items-center gap-1 rounded-none flex-1">
        <LineChart className="h-5 w-5" />
        <span className="text-xs">Analytics</span>
      </Button>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="h-16 flex flex-col justify-center items-center gap-1 rounded-none flex-1">
            <Menu className="h-5 w-5" />
            <span className="text-xs">More</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex flex-col gap-4 py-4">
            <h2 className="text-lg font-bold">Menu</h2>
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start">
                <Bot className="h-5 w-5 mr-2" />
                AI Strategies
              </Button>
              <Button variant="ghost" className="justify-start">
                <Wallet className="h-5 w-5 mr-2" />
                Portfolio
              </Button>
              <Button variant="ghost" className="justify-start">
                <LineChart className="h-5 w-5 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" className="justify-start">
                <Star className="h-5 w-5 mr-2" />
                Watchlist
              </Button>
              <Button variant="ghost" className="justify-start">
                <BarChart className="h-5 w-5 mr-2" />
                On-Chain Analytics
              </Button>
              <Button variant="ghost" className="justify-start">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
