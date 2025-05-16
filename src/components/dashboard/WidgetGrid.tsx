
import React from 'react';
import { Widget } from '@/types/trading';
import WidgetComponent from './WidgetComponent';

interface WidgetGridProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets, onRemove }) => {
  // Function to determine column span based on widget size
  const getColSpan = (size: Widget['size']) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      case 'x-large':
        return 'col-span-4';
      default:
        return 'col-span-2';
    }
  };

  // Function to determine row span based on widget size
  const getRowSpan = (size: Widget['size']) => {
    switch (size) {
      case 'small':
        return 'row-span-1';
      case 'medium':
        return 'row-span-1';
      case 'large':
        return 'row-span-2';
      case 'x-large':
        return 'row-span-2';
      default:
        return 'row-span-1';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={`${getColSpan(widget.size)} ${getRowSpan(widget.size)}`}
        >
          <WidgetComponent
            id={widget.id}
            type={widget.type}
            title={widget.title}
            onRemove={onRemove}
            config={widget.config}
            widget={widget}
          />
        </div>
      ))}
    </div>
  );
};

export default WidgetGrid;
