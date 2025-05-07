
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Watchlist: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Watchlist
        </CardTitle>
        <CardDescription>Track your favorite cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Watchlist content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
