
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton = ({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) => {
  const baseClasses = "bg-muted rounded";
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-skeleton-wave",
    none: "",
  };
  
  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };
  
  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
};

interface MultiSkeletonProps extends SkeletonProps {
  count: number;
  spacing?: number | string;
}

export const MultiSkeleton = ({
  count,
  spacing = "0.5rem",
  ...props
}: MultiSkeletonProps) => {
  return (
    <div className="flex flex-col" style={{ gap: spacing }}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} {...props} />
      ))}
    </div>
  );
};

export const CryptoCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("p-4 rounded-lg border", className)}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton variant="text" width={120} className="mb-2" />
          <Skeleton variant="text" width={80} height={8} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton variant="rectangular" height={120} className="mb-4" />
      <div className="flex justify-between">
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  );
};

export default Skeleton;
