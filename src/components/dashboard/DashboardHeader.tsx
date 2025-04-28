
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Bell, User, Menu } from 'lucide-react';
import { CryptoSearchProps, CoinOption, CryptoData } from '@/types/trading';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { ThemeToggle } from '../ThemeToggle';

interface DashboardHeaderProps {
  toggleSidebar?: () => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
  onOpenUserMenu?: () => void;
  onSearch?: (searchTerm: string) => void;
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({ coins, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCoins, setFilteredCoins] = useState<CoinOption[] | CryptoData[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = coins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoins(filtered.slice(0, 5));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, coins]);

  const handleSelect = (coin: CoinOption | CryptoData) => {
    onSelect(coin);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search coins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full"
        />
      </div>
      
      {showDropdown && (
        <Card className="absolute mt-1 w-full z-10">
          <CardContent className="p-1">
            {filteredCoins.length > 0 ? (
              filteredCoins.map((coin) => (
                <div 
                  key={coin.id}
                  className="flex items-center p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => handleSelect(coin)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                  </div>
                  <div className="text-sm">
                    ${('current_price' in coin ? coin.current_price : coin.price).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-muted-foreground">No results found</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  toggleSidebar,
  unreadNotifications = 0,
  onOpenNotifications,
  onOpenUserMenu,
  onSearch
}) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };

  // Mock data for the crypto search
  const mockCoins: CoinOption[] = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3010.45,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
    }
  ];

  const handleCoinSelect = (coin: CoinOption | CryptoData) => {
    toast({
      title: `Selected ${coin.name}`,
      description: `Symbol: ${coin.symbol}, Price: $${('current_price' in coin ? coin.current_price : coin.price).toFixed(2)}`
    });
  };

  return (
    <div className="w-full py-2 px-4 border-b bg-background flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <form onSubmit={handleSearch} className="hidden md:block">
          <CryptoSearch coins={mockCoins} onSelect={handleCoinSelect} />
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={onOpenNotifications}>
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" onClick={onOpenUserMenu}>
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="User" 
              className="h-7 w-7 rounded-full" 
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
