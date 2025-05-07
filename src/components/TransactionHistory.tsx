
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

const TransactionHistory: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </CardTitle>
        <CardDescription>Record of your past transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Transaction History content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
