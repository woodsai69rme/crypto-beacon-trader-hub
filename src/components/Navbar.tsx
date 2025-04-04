
import { useState } from "react";
import { 
  Bitcoin, 
  BarChart2, 
  MessageCircle, 
  TrendingUp, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-crypto-dark border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-crypto-bitcoin" />
            <span className="text-xl font-bold">CryptoBeacon</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-1 text-foreground hover:text-primary">
              <BarChart2 className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-muted-foreground hover:text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>Markets</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              <span>News</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
            <Button variant="default" size="sm">Connect Wallet</Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-border mt-3">
            <div className="space-y-3">
              <a href="#" className="block px-3 py-2 rounded-md bg-secondary text-white font-medium">
                Dashboard
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white">
                Markets
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white">
                News
              </a>
              <Button variant="outline" size="sm" className="w-full justify-center mt-4">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="default" size="sm" className="w-full justify-center mt-2">
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
