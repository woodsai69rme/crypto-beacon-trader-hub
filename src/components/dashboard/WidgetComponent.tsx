
import React from 'react';
import { Widget } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface WidgetComponentProps {
  widget: Widget;
  onRemove?: (id: string) => void;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({ widget, onRemove }) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'custom':
        return widget.customContent ? <div dangerouslySetInnerHTML={{ __html: widget.customContent }} /> : <div>Custom Widget</div>;
      case 'price-chart':
        return <div>Price Chart Widget</div>;
      case 'portfolio-summary':
        return <div>Portfolio Summary Widget</div>;
      case 'watchlist':
        return <div>Watchlist Widget</div>;
      case 'news':
        return <div>News Widget</div>;
      case 'alerts':
        return <div>Alerts Widget</div>;
      case 'trading':
        return <div>Trading Widget</div>;
      case 'aiTrading':
        return <div>AI Trading Widget</div>;
      case 'aiAnalysis':
        return <div>AI Analysis Widget</div>;
      default:
        return <div>Widget Content</div>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">{widget.title}</CardTitle>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemove(widget.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>{renderWidgetContent()}</CardContent>
    </Card>
  );
};

export default WidgetComponent;
