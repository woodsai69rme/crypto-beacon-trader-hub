
import React from 'react';
import { render } from '@testing-library/react';
import BaseIndicatorChart from '@/components/charts/indicators/BaseIndicatorChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey, stroke }: { dataKey: string, stroke: string }) => <div data-testid={`line-${dataKey}`} style={{ color: stroke }}></div>,
  XAxis: () => <div data-testid="x-axis"></div>,
  YAxis: () => <div data-testid="y-axis"></div>,
  CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
  Tooltip: () => <div data-testid="tooltip"></div>,
  Legend: () => <div data-testid="legend"></div>,
  ReferenceLine: ({ y, stroke }: { y: number, stroke: string }) => <div data-testid={`reference-line-${y}`} style={{ color: stroke }}></div>,
}));

describe('BaseIndicatorChart', () => {
  const mockData = [
    { date: '2023-01-01', value1: 100, value2: 200 },
    { date: '2023-01-02', value1: 150, value2: 250 },
  ];

  const mockLines = [
    { key: 'value1', color: 'blue' },
    { key: 'value2', color: 'red' },
  ];

  const mockReferenceLines = [
    { y: 100, stroke: 'green' },
    { y: 200, stroke: 'red' },
  ];

  it('renders with required props', () => {
    const { getByTestId } = render(
      <BaseIndicatorChart data={mockData} lines={mockLines} />
    );
    
    expect(getByTestId('responsive-container')).toBeInTheDocument();
    expect(getByTestId('line-chart')).toBeInTheDocument();
    expect(getByTestId('line-value1')).toBeInTheDocument();
    expect(getByTestId('line-value2')).toBeInTheDocument();
    expect(getByTestId('line-value1')).toHaveStyle('color: blue');
    expect(getByTestId('line-value2')).toHaveStyle('color: red');
  });

  it('renders reference lines when provided', () => {
    const { getByTestId } = render(
      <BaseIndicatorChart 
        data={mockData} 
        lines={mockLines} 
        referenceLines={mockReferenceLines} 
      />
    );
    
    expect(getByTestId('reference-line-100')).toBeInTheDocument();
    expect(getByTestId('reference-line-200')).toBeInTheDocument();
    expect(getByTestId('reference-line-100')).toHaveStyle('color: green');
    expect(getByTestId('reference-line-200')).toHaveStyle('color: red');
  });
});
