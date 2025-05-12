
import React from 'react';
import { Widget } from '@/types/trading';
import WidgetComponent from './WidgetComponent';

interface WidgetGridProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number, y: number }) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, onRemove, onUpdatePosition }) => {
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent, position: { x: number, y: number }) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    
    if (onUpdatePosition && id) {
      onUpdatePosition(id, position);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <div 
          key={widget.id}
          draggable
          onDragStart={(e) => handleDragStart(e, widget.id)}
          onDrop={(e) => handleDrop(e, widget.position || { x: 0, y: 0 })}
          onDragOver={handleDragOver}
          className="cursor-grab active:cursor-grabbing"
        >
          <WidgetComponent 
            type={widget.type} 
            title={widget.title}
          />
        </div>
      ))}
    </div>
  );
};

export default WidgetGrid;
