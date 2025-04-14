
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

type AlertType = "warning" | "info" | "success" | "error";

interface AlertPromptProps {
  type: AlertType;
  title: string;
  description?: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
    borderClass: "border-yellow-500/50"
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    borderClass: "border-blue-500/50"
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-green-500",
    borderClass: "border-green-500/50"
  },
  error: {
    icon: XCircle,
    iconClass: "text-destructive",
    borderClass: "border-destructive/50"
  }
};

const AlertPrompt = ({
  type,
  title,
  description,
  onDismiss,
  actionLabel,
  onAction,
  className
}: AlertPromptProps) => {
  const config = alertConfig[type];
  const AlertIcon = config.icon;
  
  return (
    <Alert className={`${config.borderClass} ${className}`}>
      <AlertIcon className={`h-4 w-4 ${config.iconClass}`} />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      
      {(onDismiss || onAction) && (
        <div className="flex justify-end gap-2 mt-2">
          {onDismiss && (
            <Button variant="outline" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
          {onAction && actionLabel && (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
};

export default AlertPrompt;
