
import React from 'react';
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Bell } from "lucide-react";

export const AlertHeader = () => {
  return (
    <div className="mb-4">
      <SheetTitle className="flex items-center">
        <Bell className="h-5 w-5 mr-2" />
        Price Alerts
      </SheetTitle>
      <SheetDescription>
        Get notified when assets hit your target prices
      </SheetDescription>
    </div>
  );
};
