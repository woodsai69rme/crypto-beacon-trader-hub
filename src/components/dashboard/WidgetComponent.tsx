
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { WidgetComponentProps } from '@/types/trading';

const WidgetComponent: React.FC<WidgetComponentProps> = ({ 
  id, 
  type, 
  title, 
  onRemove,
  config,
  widget
}) => {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  // Render different content based on widget type
  const renderWidgetContent = () => {
    switch (type) {
      case 'price-chart':
        return <div className="h-40 flex items-center justify-center">Price Chart Content</div>;
      case 'portfolio-summary':
        return <div className="h-40 flex items-center justify-center">Portfolio Summary Content</div>;
      case 'watchlist':
        return <div className="h-40 flex items-center justify-center">Watchlist Content</div>;
      case 'news':
        return <div className="h-40 flex items-center justify-center">News Content</div>;
      case 'alerts':
        return <div className="h-40 flex items-center justify-center">Alerts Content</div>;
      case 'trading':
        return <div className="h-40 flex items-center justify-center">Trading Content</div>;
      case 'aiTrading':
        return <div className="h-40 flex items-center justify-center">AI Trading Content</div>;
      case 'aiAnalysis':
        return <div className="h-40 flex items-center justify-center">AI Analysis Content</div>;
      case 'custom':
        return widget?.customContent ? (
          <div dangerouslySetInnerHTML={{ __html: widget.customContent }} />
        ) : (
          <div className="h-40 flex items-center justify-center">Custom Widget Content</div>
        );
      default:
        return <div className="h-40 flex items-center justify-center">Widget Content</div>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

export default WidgetComponent;
