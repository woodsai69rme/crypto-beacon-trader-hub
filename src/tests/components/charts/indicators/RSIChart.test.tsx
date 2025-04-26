
import { render } from '@testing-library/react';
import RSIChart from '@/components/charts/indicators/RSIChart';

// Mock the BaseIndicatorChart component
jest.mock('@/components/charts/indicators/BaseIndicatorChart', () => {
  return {
    __esModule: true,
    default: jest.fn(({ data, lines, referenceLines }) => (
      <div data-testid="base-indicator-chart">
        <span>Lines: {lines.length}</span>
        <span>Data: {data.length}</span>
        <span>ReferenceLines: {referenceLines ? referenceLines.length : 0}</span>
      </div>
    )),
  };
});

describe('RSIChart', () => {
  const mockData = [
    { date: '2023-01-01', RSI: 45 },
    { date: '2023-01-02', RSI: 55 },
    { date: '2023-01-03', RSI: 65 },
  ];

  it('renders with the correct props passed to BaseIndicatorChart', () => {
    render(<RSIChart data={mockData} />);
    
    const baseChart = document.querySelector('[data-testid="base-indicator-chart"]');
    expect(baseChart).toBeInTheDocument();
    expect(baseChart?.textContent).toContain('Lines: 1');
    expect(baseChart?.textContent).toContain('Data: 3');
    expect(baseChart?.textContent).toContain('ReferenceLines: 2'); // There should be two reference lines (30 and 70)
  });

  it('uses the provided color for the RSI line', () => {
    const customColor = '#00ff00';
    render(<RSIChart data={mockData} color={customColor} />);
    
    // The BaseIndicatorChart is mocked, but we can still get the props passed to it
    const BaseIndicatorChartMock = require('@/components/charts/indicators/BaseIndicatorChart').default;
    const lastCall = BaseIndicatorChartMock.mock.calls[BaseIndicatorChartMock.mock.calls.length - 1];
    
    // Check that the color was passed correctly
    expect(lastCall[0].lines[0].color).toBe(customColor);
  });

  it('sets domain correctly for RSI (0 to 100)', () => {
    render(<RSIChart data={mockData} />);
    
    const BaseIndicatorChartMock = require('@/components/charts/indicators/BaseIndicatorChart').default;
    const lastCall = BaseIndicatorChartMock.mock.calls[BaseIndicatorChartMock.mock.calls.length - 1];
    
    expect(lastCall[0].domain).toEqual([0, 100]);
  });
});
