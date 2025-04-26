
import React from "react";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  );
};

export default LoadingSpinner;
