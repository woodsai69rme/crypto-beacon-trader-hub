
import React from "react";
import CryptoSearch from "../CryptoSearch";
import ThemeToggle from "../ThemeToggle";
import NotificationSystem from "../NotificationSystem";
import AlertsSystem from "../AlertsSystem";
import UserSettings from "../UserSettings";
import AuthDialog from "../AuthDialog";
import NotificationBadge from "../NotificationBadge";

interface DashboardHeaderProps {
  notificationCount: number;
  alertCount: number;
}

const DashboardHeader = ({ notificationCount, alertCount }: DashboardHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
      <div className="flex items-center gap-2">
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
