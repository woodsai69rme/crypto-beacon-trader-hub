
import React from 'react';
import { Widget } from '@/types/trading';
import WidgetComponent from './WidgetComponent';

interface WidgetListProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
}

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onRemove }) => {
  return (
    <div className="space-y-4">
      {widgets.map((widget) => (
        <div key={widget.id}>
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

export default WidgetList;
