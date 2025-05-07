
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Check, AlertTriangle } from "lucide-react";

interface AlertPromptProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const AlertPrompt: React.FC<AlertPromptProps> = ({
  type = 'info',
  title,
  description,
  onDismiss,
  actionLabel,
  onAction,
  className
}) => {
  // Icon based on the alert type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Alert variant based on type
  const getVariant = () => {
    switch (type) {
      case 'success':
        return 'default'; // You can create custom variants in your theme
      case 'warning':
        return 'destructive';
      case 'error':
        return 'destructive';
      case 'info':
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      <div className="flex items-start">
        <div className="mr-2">{getIcon()}</div>
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
          
          {(onDismiss || onAction) && (
            <div className="flex justify-end space-x-2 mt-2">
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
        </div>
      </div>
    </Alert>
  );
};

export default AlertPrompt;
