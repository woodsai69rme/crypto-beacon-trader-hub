
declare module 'ccxt' {
  export interface Exchange {
    id: string;
    name: string;
    countries: string[];
    urls: any;
    has: any;
    timeframes: any;
    fees: any;
    apiKey?: string;
    secret?: string;
    password?: string;
    sandbox?: boolean;
    enableRateLimit?: boolean;
    timeout?: number;
    loadMarkets(): Promise<any>;
    fetchBalance(): Promise<any>;
    fetchTicker(symbol: string): Promise<any>;
    fetchStatus(): Promise<any>;
    fetchOrders(symbol?: string): Promise<any>;
    fetchOHLCV(symbol: string, timeframe?: string, since?: number, limit?: number): Promise<number[][]>;
    fetchOrderBook(symbol: string): Promise<any>;
    createOrder(symbol: string, type: string, side: string, amount: number, price?: number): Promise<any>;
    close(): Promise<void>;
  }

  export interface ExchangeClass {
    new (config?: any): Exchange;
  }

  export const binance: ExchangeClass;
  export const coinbase: ExchangeClass;
  export const kraken: ExchangeClass;
  export const bybit: ExchangeClass;
  export const okx: ExchangeClass;
  export const kucoin: ExchangeClass;
  export const bitfinex: ExchangeClass;
  export const huobi: ExchangeClass;
  export const gateio: ExchangeClass;
  export const mexc: ExchangeClass;

  const ccxt: {
    [key: string]: ExchangeClass;
    binance: ExchangeClass;
    coinbase: ExchangeClass;
    kraken: ExchangeClass;
    bybit: ExchangeClass;
    okx: ExchangeClass;
    kucoin: ExchangeClass;
    bitfinex: ExchangeClass;
    huobi: ExchangeClass;
    gateio: ExchangeClass;
    mexc: ExchangeClass;
  };

  export default ccxt;
}
