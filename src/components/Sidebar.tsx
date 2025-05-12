
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  BarChart2, 
  Users, 
  LineChart, 
  PieChart, 
  Calculator,
  Menu, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div 
      className={`bg-secondary/20 h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <Link to="/" className="font-bold text-xl">
              CryptoTrade
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className={collapsed ? 'mx-auto' : ''}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-2 px-2">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`w-full justify-${collapsed ? 'center' : 'start'}`}
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                {!collapsed && <span>Dashboard</span>}
              </Button>
            </Link>
            
            <Link to="/analytics">
              <Button 
                variant="ghost" 
                className={`w-full justify-${collapsed ? 'center' : 'start'}`}
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                {!collapsed && <span>Analytics</span>}
              </Button>
            </Link>
            
            <Link to="/custom-dashboard">
              <Button 
                variant="ghost" 
                className={`w-full justify-${collapsed ? 'center' : 'start'}`}
              >
                <PieChart className="h-5 w-5 mr-2" />
                {!collapsed && <span>Custom Dashboard</span>}
              </Button>
            </Link>
            
            <Link to="/tax-calculator">
              <Button 
                variant="ghost" 
                className={`w-full justify-${collapsed ? 'center' : 'start'}`}
              >
                <Calculator className="h-5 w-5 mr-2" />
                {!collapsed && <span>Tax Calculator</span>}
              </Button>
            </Link>
          </div>
          
          {!collapsed && (
            <div className="mt-6 px-4">
              <h3 className="text-xs uppercase text-muted-foreground font-semibold mb-2">
                Analytics
              </h3>
            </div>
          )}
          
          <div className="space-y-2 px-2 mt-2">
            <Button 
              variant="ghost" 
              className={`w-full justify-${collapsed ? 'center' : 'start'}`}
            >
              <LineChart className="h-5 w-5 mr-2" />
              {!collapsed && <span>Charts</span>}
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-${collapsed ? 'center' : 'start'}`}
            >
              <Users className="h-5 w-5 mr-2" />
              {!collapsed && <span>Social</span>}
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Link to="/settings">
            <Button 
              variant="ghost" 
              className={`w-full justify-${collapsed ? 'center' : 'start'}`}
            >
              <Settings className="h-5 w-5 mr-2" />
              {!collapsed && <span>Settings</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
