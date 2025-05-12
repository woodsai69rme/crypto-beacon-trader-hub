
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Bell,
  Search,
  Settings,
  Menu,
  LogOut,
  User,
  HelpCircle,
  LayoutDashboard,
  CreditCard,
  BarChart2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const Navbar = () => {
  const { colorScheme } = useTheme();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className={`border-b border-border sticky top-0 z-50 w-full backdrop-blur-md bg-background/70`}>
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-lg hidden md:inline-block">CryptoTrader</span>
          </Link>
        </div>
        
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  isActive('/dashboard') && "bg-accent text-accent-foreground"
                )}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={isActive('/custom-dashboard') ? "bg-accent text-accent-foreground" : ""}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Trading
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li>
                    <Link to="/custom-dashboard" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Custom Dashboard</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Customize your trading dashboard with widgets
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/tax-calculator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Tax Calculator</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Calculate your cryptocurrency taxes
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/settings" legacyBehavior passHref>
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  isActive('/settings') && "bg-accent text-accent-foreground"
                )}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex-1 md:ml-auto md:mr-6 relative max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..."
            className="w-full pl-8 rounded-full bg-secondary/50 border-none"
          />
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ThemeSwitcher />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/" className="flex w-full cursor-pointer">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex w-full cursor-pointer">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/custom-dashboard" className="flex w-full cursor-pointer">Custom Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tax-calculator" className="flex w-full cursor-pointer">Tax Calculator</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex w-full cursor-pointer">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <img
                  src="https://github.com/shadcn.png"
                  alt="User"
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
