
import { render } from '@testing-library/react';
import MACDChart from '@/components/charts/indicators/MACDChart';

// Mock the BaseIndicatorChart component
jest.mock('@/components/charts/indicators/BaseIndicatorChart', () => {
  return {
    __esModule: true,
    default: jest.fn(({ data, lines }) => (
      <div data-testid="base-indicator-chart">
        <span>Lines: {lines.length}</span>
        <span>Data: {data.length}</span>
      </div>
    )),
  };
});

describe('MACDChart', () => {
  const mockData = [
    { date: '2023-01-01', MACD: 0.5, Signal: 0.3, Histogram: 0.2 },
    { date: '2023-01-02', MACD: 0.6, Signal: 0.4, Histogram: 0.2 },
    { date: '2023-01-03', MACD: 0.7, Signal: 0.5, Histogram: 0.2 },
  ];

  it('renders with the correct props passed to BaseIndicatorChart', () => {
    render(<MACDChart data={mockData} />);
    
    const baseChart = document.querySelector('[data-testid="base-indicator-chart"]');
    expect(baseChart).toBeInTheDocument();
    expect(baseChart?.textContent).toContain('Lines: 3');
    expect(baseChart?.textContent).toContain('Data: 3');
  });

  it('uses the provided color for the main line', () => {
    const customColor = '#ff00ff';
    const { container } = render(<MACDChart data={mockData} color={customColor} />);
    
    // The BaseIndicatorChart is mocked, but we can still get the props passed to it
    const BaseIndicatorChartMock = require('@/components/charts/indicators/BaseIndicatorChart').default;
    const lastCall = BaseIndicatorChartMock.mock.calls[BaseIndicatorChartMock.mock.calls.length - 1];
    
    // Check that the color was passed correctly
    expect(lastCall[0].lines[0].color).toBe(customColor);
  });
});
