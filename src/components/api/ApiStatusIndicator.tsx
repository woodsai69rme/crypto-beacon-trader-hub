
import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ApiStatus = 'online' | 'offline' | 'degraded' | 'unknown';

interface ApiStatusIndicatorProps {
  status: ApiStatus;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  status,
  className,
  showText = true,
  size = 'md'
}) => {
  // Determine the appropriate icon and colors based on status
  const getStatusDisplay = () => {
    switch (status) {
      case 'online':
        return {
          icon: <CheckCircle2 className={sizeClasses.icon} />,
          color: 'text-green-500',
          text: 'Online'
        };
      case 'offline':
        return {
          icon: <XCircle className={sizeClasses.icon} />,
          color: 'text-red-500',
          text: 'Offline'
        };
      case 'degraded':
        return {
          icon: <AlertCircle className={sizeClasses.icon} />,
          color: 'text-amber-500',
          text: 'Degraded'
        };
      case 'unknown':
      default:
        return {
          icon: <AlertCircle className={sizeClasses.icon} />,
          color: 'text-muted-foreground',
          text: 'Unknown'
        };
    }
  };

  // Size classes for different components
  const sizeClasses = {
    container: size === 'sm' ? 'gap-1' : size === 'lg' ? 'gap-2' : 'gap-1.5',
    icon: size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
    text: size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'
  };

  const { icon, color, text } = getStatusDisplay();

  return (
    <div className={cn('flex items-center', sizeClasses.container, color, className)}>
      {icon}
      {showText && <span className={sizeClasses.text}>{text}</span>}
    </div>
  );
};

export default ApiStatusIndicator;
