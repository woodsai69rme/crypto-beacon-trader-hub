
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

const FilteredNewsFeed: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Crypto News
        </CardTitle>
        <CardDescription>Latest news filtered for relevance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p>News Feed content will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilteredNewsFeed;
