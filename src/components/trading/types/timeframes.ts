
export interface ExtendedTradingTimeframe {
  id: string;
  label: string;
  value: string;
  duration: number;
  candleCount: number;
  description: string;
}

export const tradingTimeframes: ExtendedTradingTimeframe[] = [
  {
    id: "1m",
    label: "1 Minute",
    value: "1m",
    duration: 60,
    candleCount: 120,
    description: "One minute candlesticks, ideal for scalping"
  },
  {
    id: "5m",
    label: "5 Minutes",
    value: "5m",
    duration: 300,
    candleCount: 288,
    description: "Five minute candlesticks, good for short-term trading"
  },
  {
    id: "15m",
    label: "15 Minutes",
    value: "15m",
    duration: 900,
    candleCount: 192,
    description: "Fifteen minute candlesticks, popular for intraday trading"
  },
  {
    id: "1h",
    label: "1 Hour",
    value: "1h",
    duration: 3600,
    candleCount: 168,
    description: "One hour candlesticks, good for day trading"
  },
  {
    id: "4h",
    label: "4 Hours",
    value: "4h",
    duration: 14400,
    candleCount: 90,
    description: "Four hour candlesticks, suitable for swing trading"
  },
  {
    id: "1d",
    label: "1 Day",
    value: "1d",
    duration: 86400,
    candleCount: 90,
    description: "Daily candlesticks, ideal for position trading"
  },
  {
    id: "1w",
    label: "1 Week",
    value: "1w",
    duration: 604800,
    candleCount: 52,
    description: "Weekly candlesticks, good for long-term trend analysis"
  }
];
