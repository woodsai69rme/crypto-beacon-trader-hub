
import React from 'react';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export const AlertHeader: React.FC = () => {
  return (
    <SheetHeader className="mb-5">
      <SheetTitle>Alerts</SheetTitle>
      <SheetDescription>
        Create and manage price alerts for cryptocurrencies.
      </SheetDescription>
    </SheetHeader>
  );
};
