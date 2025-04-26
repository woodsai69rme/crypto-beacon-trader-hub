
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const CorrelationExplainer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="p-3 border rounded-md bg-muted/50 text-sm themed-text-secondary">
      <h4 className="font-medium mb-1 themed-text">What is Correlation?</h4>
      <p>Correlation measures how assets move in relation to each other:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li><strong>Positive correlation (0 to 1):</strong> Assets tend to move in the same direction</li>
        <li><strong>Negative correlation (0 to -1):</strong> Assets tend to move in opposite directions</li>
        <li><strong>No correlation (near 0):</strong> Assets move independently of each other</li>
      </ul>
      <p className="mt-2">Diversifying with negatively correlated assets can help reduce portfolio risk.</p>
    </div>
  );
};
