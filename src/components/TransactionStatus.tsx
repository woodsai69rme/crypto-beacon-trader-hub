
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionStatusVariant } from "@/types/trading";

export type TransactionStatusType = "success" | "failed" | "pending" | "warning";

interface TransactionStatusProps {
  status: TransactionStatusType;
  text?: string;
  className?: string;
}

const statusConfig = {
  success: {
    label: "Success",
    icon: CheckCircle,
    variant: "success" as TransactionStatusVariant
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    variant: "destructive" as TransactionStatusVariant
  },
  pending: {
    label: "Pending",
    icon: Clock,
    variant: "pending" as TransactionStatusVariant
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    variant: "warning" as TransactionStatusVariant
  }
};

const TransactionStatus = ({ 
  status, 
  text, 
  className 
}: TransactionStatusProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  
  return (
    <Badge variant={config.variant} className={cn("flex items-center gap-1", className)}>
      <StatusIcon className="w-3 h-3" />
      <span>{text || config.label}</span>
    </Badge>
  );
};

export default TransactionStatus;
