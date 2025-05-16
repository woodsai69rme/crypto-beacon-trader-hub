
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Widget } from '@/types/trading';

export interface WidgetComponentProps {
  id: string;
  type: string;
  title: string;
  onRemove: (id: string) => void;
  widget?: Widget;
  className?: string;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({ 
  id, 
  type, 
  title, 
  onRemove,
  widget,
  className 
}) => {
  return (
    <Card className={cn("relative", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 z-10 h-6 w-6"
        onClick={() => onRemove(id)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="h-32 flex items-center justify-center">
          {/* Placeholder content based on widget type */}
          <div className="text-muted-foreground">
            {type === 'chart' && 'Chart Widget'}
            {type === 'table' && 'Table Widget'}
            {type === 'stats' && 'Statistics Widget'}
            {type === 'news' && 'News Widget'}
            {type === 'alerts' && 'Alerts Widget'}
            {type === 'portfolio' && 'Portfolio Widget'}
            {type === 'custom' && 'Custom Widget'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetComponent;
