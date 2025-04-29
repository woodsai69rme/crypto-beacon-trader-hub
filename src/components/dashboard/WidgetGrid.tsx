
import React from 'react';
import { Widget, WidgetGridProps } from '@/types/trading';
import WidgetComponent from './WidgetComponent';

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, onRemove, onUpdatePosition }) => {
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('widgetId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, position: { x: number, y: number }) => {
    e.preventDefault();
    const widgetId = e.dataTransfer.getData('widgetId');
    if (onUpdatePosition) {
      onUpdatePosition(widgetId, position);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={`
            ${widget.size === 'small' ? 'col-span-1 row-span-1' : ''}
            ${widget.size === 'medium' ? 'col-span-1 row-span-2' : ''}
            ${widget.size === 'large' ? 'col-span-2 row-span-2' : ''}
            ${widget.size === 'wide' ? 'col-span-2 row-span-1' : ''}
            ${widget.size === 'tall' ? 'col-span-1 row-span-3' : ''}
            ${widget.size === 'full' ? 'col-span-3 row-span-2' : ''}
          `}
          draggable
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, { x: widget.position.x, y: widget.position.y })}
        >
          <WidgetComponent widget={widget} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};

export default WidgetGrid;
