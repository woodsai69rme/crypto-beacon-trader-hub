
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ThemeSwitcher from "../settings/ThemeSwitcher";
import CryptoSearch from "../CryptoSearch";
import { CoinOption } from "@/types/trading";
import { useRouter } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export interface DashboardHeaderProps {
  notificationCount?: number;
  alertCount?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  notificationCount = 0,
  alertCount = 0,
  onRefresh,
  isLoading = false
}) => {
  const handleCoinSelect = (coin: CoinOption) => {
    // In a real app, navigate to coin detail page
    // For now, just show a toast
    toast({
      title: `Selected ${coin.name}`,
      description: `You selected ${coin.name} (${coin.symbol?.toUpperCase()})`
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="flex-1 max-w-md">
        <CryptoSearch onCoinSelect={handleCoinSelect} />
      </div>
      
      <div className="flex items-center gap-2">
        {notificationCount > 0 && (
          <Button variant="ghost" size="icon" className="relative" aria-label={`${notificationCount} notifications`}>
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px]" variant="destructive">
              {notificationCount}
            </Badge>
          </Button>
        )}
        
        {alertCount > 0 && (
          <Button variant="ghost" size="icon" className="relative" aria-label={`${alertCount} alerts`}>
            <AlertTriangle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px]" variant="destructive">
              {alertCount}
            </Badge>
          </Button>
        )}
        
        <ThemeSwitcher />
        
        <Button 
          variant="outline" 
          size="icon"
          disabled={isLoading} 
          onClick={onRefresh}
          aria-label="Refresh dashboard"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
