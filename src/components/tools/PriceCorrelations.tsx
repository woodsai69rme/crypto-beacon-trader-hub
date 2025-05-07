
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";

const PriceCorrelations: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Price Correlations
        </CardTitle>
        <CardDescription>Analyze correlations between different assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>Price Correlations content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelations;
