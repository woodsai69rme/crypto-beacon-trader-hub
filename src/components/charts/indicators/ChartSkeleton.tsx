
import React from "react";
import { Skeleton } from "@/components/ui/loading-skeleton";

interface ChartSkeletonProps {
  height?: number;
}

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = 200 }) => {
  return (
    <div className={`h-${height} flex items-center justify-center`}>
      <Skeleton variant="rectangular" height={height} width="100%" />
    </div>
  );
};

export default ChartSkeleton;
