
import React from 'react';
import { Card } from "@/components/ui/card";
import { WidgetGridProps } from '@/types/trading';

const WidgetGrid: React.FC<WidgetGridProps> = ({
  id,
  title,
  type,
  size,
  position,
  onRemove,
  onUpdatePosition,
  children
}) => {
  // Handle position update via drag & drop
  const handleDragEnd = (e: React.DragEvent) => {
    if (!onUpdatePosition) return;
    
    // Calculate new position based on drop location
    const newX = Math.round((e.clientX - window.innerWidth * 0.1) / 50) * 50;
    const newY = Math.round((e.clientY - 100) / 50) * 50;
    
    onUpdatePosition(id, { x: newX, y: newY });
  };
  
  // Size classes based on widget size
  const sizeClasses = {
    small: "w-64 h-64",
    medium: "w-80 h-80",
    large: "w-96 h-96",
    wide: "w-full md:w-2/3 h-80",
    tall: "w-64 h-128",
    full: "w-full h-128"
  };
  
  return (
    <Card
      className={`${sizeClasses[size]} absolute cursor-move overflow-hidden`}
      style={{ top: position.y, left: position.x }}
      draggable
      onDragEnd={handleDragEnd}
    >
      {children}
      
      {onRemove && (
        <button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/90 flex items-center justify-center"
          onClick={() => onRemove(id)}
        >
          &times;
        </button>
      )}
    </Card>
  );
};

export default WidgetGrid;
