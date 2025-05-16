
import React from 'react';
import { Widget } from '@/types/trading';
import WidgetComponent from './WidgetComponent';

interface WidgetGridProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number; w: number; h: number }) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, onRemoveWidget, onUpdatePosition }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
};

export default WidgetGrid;
