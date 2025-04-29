
import React, { useState } from 'react';
import { Bell, Search, Settings, ChevronDown, LogOut, User, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from "../ThemeToggle";
import { CryptoSearchProps, DashboardHeaderProps, User as UserType } from '@/types/trading';

// User placeholder data - in a real app, this would come from auth context
const userPlaceholder: UserType = {
  id: "user1",
  email: "trader@example.com",
  displayName: "Crypto Trader",
  photoURL: "https://avatars.githubusercontent.com/u/12345678",
  createdAt: new Date().toISOString(),
  settings: {
    notifications: true
  }
};

const CryptoSearch: React.FC<CryptoSearchProps> = ({ coins, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const filteredCoins = searchTerm.length > 0 
    ? coins.filter(
        coin => 
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5) 
    : [];
  
  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search coins..."
          className="w-full bg-background pl-8 pr-10"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(e.target.value.length > 0);
          }}
        />
        {isSearching && (
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => {
              setSearchTerm('');
              setIsSearching(false);
            }}
          >
            <span className="sr-only">Clear</span>
            <span aria-hidden="true">×</span>
          </Button>
        )}
      </div>
      
      {isSearching && filteredCoins.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="py-1">
            {filteredCoins.map((coin: any) => (
              <li key={coin.id}>
                <button
                  className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    onSelect(coin);
                    setSearchTerm('');
                    setIsSearching(false);
                  }}
                >
                  {coin.image && (
                    <img 
                      src={coin.image} 
                      alt={coin.name} 
                      className="mr-2 h-5 w-5"
                    />
                  )}
                  <span>{coin.name}</span>
                  <span className="ml-1 text-muted-foreground">({coin.symbol.toUpperCase()})</span>
                  {(coin.price || coin.current_price) && (
                    <span className="ml-auto font-medium">
                      ${(coin.price || coin.current_price).toLocaleString()}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isSearching && searchTerm.length > 0 && filteredCoins.length === 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-4 shadow-md">
          <p className="text-center text-sm text-muted-foreground">No coins found</p>
        </div>
      )}
    </div>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ notificationCount, alertCount, onRefresh, isLoading }) => {
  const [user] = useState<UserType>(userPlaceholder);
  
  const handleCoinSelect = (coin: any) => {
    console.log("Selected coin:", coin);
    // In a real app, you would navigate to the coin detail page or perform some other action
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="flex items-center space-x-2 font-medium">
            <span className="text-primary text-lg font-bold">CryptoTrader</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium ml-6">
            <a href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground">Dashboard</a>
            <a href="/trading" className="transition-colors hover:text-foreground/80 text-muted-foreground">Trading</a>
            <a href="/portfolio" className="transition-colors hover:text-foreground/80 text-muted-foreground">Portfolio</a>
            <a href="/settings" className="transition-colors hover:text-foreground/80 text-muted-foreground">Settings</a>
          </nav>
        </div>

        <div className="flex-1 md:grow-0 md:w-96">
          <CryptoSearch 
            coins={[
              { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 65000, image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
              { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3400, image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" }
            ]} 
            onSelect={handleCoinSelect} 
          />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <Bell className={`h-5 w-5 ${isLoading ? "animate-pulse" : ""}`} />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Settings className="h-5 w-5" />
                  {alertCount > 0 && (
                    <Badge
                      variant="outline"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] border-amber-500 text-amber-500"
                    >
                      {alertCount}
                    </Badge>
                  )}
                  <span className="sr-only">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="col-span-4">Quick settings content will go here</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
                    <AvatarFallback>
                      {(user.displayName?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
