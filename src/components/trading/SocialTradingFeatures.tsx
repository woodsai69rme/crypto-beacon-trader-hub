
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const SocialTradingFeatures: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Trading
        </CardTitle>
        <CardDescription>Share strategies and follow top traders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Social Trading content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialTradingFeatures;
