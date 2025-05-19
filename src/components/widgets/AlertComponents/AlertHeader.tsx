
import React from 'react';
import { Bell } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export const AlertHeader: React.FC = () => {
  return (
    <SheetHeader>
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <SheetTitle>Price Alerts</SheetTitle>
      </div>
      <SheetDescription>
        Set up custom alerts for price movements and market events
      </SheetDescription>
    </SheetHeader>
  );
};
