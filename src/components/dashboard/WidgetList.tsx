
import React from 'react';
import { Widget, WidgetListProps } from '@/types/trading';
import WidgetComponent from './WidgetComponent';

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onRemove }) => {
  return (
    <div className="space-y-5 animate-fade-in">
      {widgets.map((widget) => (
        <div key={widget.id} className="transition-all duration-300 hover:shadow-md">
          <WidgetComponent widget={widget} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};

export default WidgetList;
