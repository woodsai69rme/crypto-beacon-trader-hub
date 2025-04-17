
import React from "react";
import CryptoSearch from "../CryptoSearch";
import ThemeToggle from "../ThemeToggle";
import NotificationSystem from "../NotificationSystem";
import AlertsSystem from "../AlertsSystem";
import UserSettings from "../UserSettings";
import AuthDialog from "../AuthDialog";
import NotificationBadge from "../NotificationBadge";
import GlobalSearch from "../GlobalSearch";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  notificationCount: number;
  alertCount: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const DashboardHeader = ({ 
  notificationCount, 
  alertCount, 
  onRefresh, 
  isLoading = false 
}: DashboardHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isLoading}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <GlobalSearch />
        <CryptoSearch />
        <ThemeToggle />
        <div className="relative">
          <NotificationSystem />
          <NotificationBadge count={notificationCount} />
        </div>
        <div className="relative">
          <AlertsSystem />
          <NotificationBadge count={alertCount} />
        </div>
        <UserSettings />
        <AuthDialog />
      </div>
    </div>
  );
};

export default DashboardHeader;
