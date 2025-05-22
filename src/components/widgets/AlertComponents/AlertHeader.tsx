
import React from "react";
import { Bell } from "lucide-react";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";

export const AlertHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Bell className="h-5 w-5" />
      <div>
        <SheetTitle>Price Alerts</SheetTitle>
        <SheetDescription>
          Get notified when cryptocurrencies hit your target prices
        </SheetDescription>
      </div>
    </div>
  );
};
