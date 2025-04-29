
import { useState } from "react";
import { 
  Bitcoin, 
  BarChart2, 
  MessageCircle, 
  TrendingUp, 
  Settings, 
  Menu, 
  X,
  PieChart,
  LineChart,
  Calculator,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section: string) => {
    // In a real app, this would navigate to a different route
    // For now, we'll just scroll to the section if it exists, or show a toast
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast({
        title: "Navigation",
        description: `Navigating to ${section}`,
      });
    }
    
    // Close mobile menu after navigation
    setIsMenuOpen(false);
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
            <button 
              onClick={() => handleNavClick("dashboard")} 
              className="flex items-center space-x-1 text-foreground hover:text-primary"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => handleNavClick("portfolio")} 
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
            >
              <PieChart className="h-4 w-4" />
              <span>Portfolio</span>
            </button>
            <button 
              onClick={() => handleNavClick("markets")} 
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Markets</span>
            </button>
            <button 
              onClick={() => handleNavClick("trading")} 
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              <span>Trading</span>
            </button>
            <button 
              onClick={() => handleNavClick("news")} 
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              <span>News</span>
            </button>
            <button 
              onClick={() => handleNavClick("taxes")} 
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
            >
              <Calculator className="h-4 w-4" />
              <span>Taxes</span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleNavClick("settings")}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
            <Button variant="default" size="sm" onClick={() => toast({
              title: "Connect Wallet",
              description: "Wallet connection feature would open here",
            })}>Connect Wallet</Button>
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
              <button 
                onClick={() => handleNavClick("dashboard")}
                className="block w-full px-3 py-2 rounded-md bg-secondary text-white font-medium text-left"
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavClick("portfolio")}
                className="block w-full px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white text-left"
              >
                Portfolio
              </button>
              <button 
                onClick={() => handleNavClick("markets")}
                className="block w-full px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white text-left"
              >
                Markets
              </button>
              <button 
                onClick={() => handleNavClick("trading")}
                className="block w-full px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white text-left"
              >
                Trading
              </button>
              <button 
                onClick={() => handleNavClick("news")}
                className="block w-full px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white text-left"
              >
                News
              </button>
              <button 
                onClick={() => handleNavClick("taxes")}
                className="block w-full px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-white text-left"
              >
                Taxes
              </button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-center mt-4"
                onClick={() => handleNavClick("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-center mt-2"
                onClick={() => toast({
                  title: "Connect Wallet",
                  description: "Wallet connection feature would open here",
                })}
              >
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
