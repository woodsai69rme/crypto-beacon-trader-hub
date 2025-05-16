
import React from 'react';
import { Widget } from '@/types/trading';
import WidgetComponent from './WidgetComponent';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WidgetListProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
}

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onRemoveWidget }) => {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] pr-4">
      <div className="space-y-4">
        {widgets.map(widget => (
          <WidgetComponent 
            key={widget.id} 
            id={widget.id}
            type={widget.type} 
            title={widget.title}
            onRemove={onRemoveWidget}
            widget={widget}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default WidgetList;
