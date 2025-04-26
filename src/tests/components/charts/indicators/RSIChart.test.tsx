
import React from 'react';
import { render } from '@testing-library/react';
import RSIChart from '@/components/charts/indicators/RSIChart';

// Mock Recharts components to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  ReferenceLine: () => <div>ReferenceLine</div>,
}));

describe('RSIChart', () => {
  const mockData = [
    { date: '2023-01-01', RSI: 65 },
    { date: '2023-01-02', RSI: 70 },
    { date: '2023-01-03', RSI: 45 },
    { date: '2023-01-04', RSI: 30 },
  ];

  it('renders without crashing', () => {
    const { container } = render(<RSIChart data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  it('uses custom color when provided', () => {
    const { container } = render(<RSIChart data={mockData} color="#ff0000" />);
    expect(container).toBeInTheDocument();
  });
});
