
# Price Monitoring API

## Overview

The Price Monitoring API provides real-time cryptocurrency price data and monitoring capabilities. This service allows applications to receive updated price information for specified cryptocurrencies at configurable intervals.

## Core Functions

### startPriceMonitoring

```typescript
function startPriceMonitoring(
  coinIds: string[],
  onPriceUpdate: (updatedCoins: CoinOption[]) => void,
  updateInterval: number = 10000
): () => void
```

Starts monitoring prices for the specified cryptocurrencies.

**Parameters:**
- `coinIds`: Array of cryptocurrency IDs to monitor (e.g., "bitcoin", "ethereum")
- `onPriceUpdate`: Callback function that will be called with updated price data
- `updateInterval`: Update frequency in milliseconds (default: 10000ms / 10 seconds)

**Returns:**
- A cleanup function that stops the price monitoring when called

**Example:**
```typescript
import { startPriceMonitoring } from "@/services/priceMonitoring";

const cleanup = startPriceMonitoring(
  ["bitcoin", "ethereum", "solana"],
  (updatedCoins) => {
    console.log("Updated prices:", updatedCoins);
    // Process updated prices
  },
  5000 // Update every 5 seconds
);

// Later when you want to stop monitoring:
cleanup();
```

### connectToRealTimePriceStream

```typescript
function connectToRealTimePriceStream(
  symbols: string[],
  onPriceUpdate: (updatedCoins: CoinOption[]) => void
): () => void
```

Connects to a real-time price stream for the specified trading pairs (uses WebSockets in production).

**Parameters:**
- `symbols`: Array of cryptocurrency symbols to monitor
- `onPriceUpdate`: Callback function that will be called with updated price data

**Returns:**
- A cleanup function that disconnects from the price stream when called

**Example:**
```typescript
import { connectToRealTimePriceStream } from "@/services/priceMonitoring";

const disconnect = connectToRealTimePriceStream(
  ["BTC", "ETH", "SOL"],
  (updatedCoins) => {
    console.log("Streamed prices:", updatedCoins);
    // Process streamed prices
  }
);

// Later when you want to disconnect:
disconnect();
```

### getCurrentPrice

```typescript
function getCurrentPrice(coinId: string): number
```

Gets the current price for a specified cryptocurrency.

**Parameters:**
- `coinId`: Cryptocurrency ID (e.g., "bitcoin")

**Returns:**
- The current price as a number

**Example:**
```typescript
import { getCurrentPrice } from "@/services/priceMonitoring";

const btcPrice = getCurrentPrice("bitcoin");
console.log(`Current Bitcoin price: $${btcPrice}`);
```

### addCoinToMonitoring

```typescript
function addCoinToMonitoring(
  coinId: string,
  initialPrice: number
): void
```

Adds a new cryptocurrency to the monitoring system.

**Parameters:**
- `coinId`: Cryptocurrency ID to add
- `initialPrice`: Initial price for the cryptocurrency

**Example:**
```typescript
import { addCoinToMonitoring } from "@/services/priceMonitoring";

// Add a new cryptocurrency
addCoinToMonitoring("polygon", 0.75);
```

### resetPrices

```typescript
function resetPrices(): void
```

Resets all prices to their initial values (useful for testing).

**Example:**
```typescript
import { resetPrices } from "@/services/priceMonitoring";

// Reset all prices
resetPrices();
```

## Data Types

### CoinOption

```typescript
interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}
```

## Implementation Notes

- In the current implementation, price changes are simulated using random variations.
- In production, this service connects to real cryptocurrency exchange APIs.
- WebSocket connections are used where available for minimal latency.
- Fallback mechanisms ensure data availability even when primary sources fail.
- For performance reasons, consider batching price update requests when monitoring many coins.

## Rate Limiting and Quotas

- Free tier: Maximum 10 concurrent coins, 10-second minimum update interval
- Professional tier: Up to 100 concurrent coins, 1-second minimum update interval
- Enterprise tier: Unlimited coins, custom update intervals down to 100ms

## Best Practices

- Only monitor the coins you need to minimize resource usage
- Use appropriate update intervals (5-10 seconds is recommended for most use cases)
- Always implement the cleanup function to avoid memory leaks
- Handle connection errors gracefully with retry logic
- Consider using the WebSocket implementation for latency-sensitive applications
