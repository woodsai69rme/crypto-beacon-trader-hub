
# Database Schema

## Overview

Crypto Beacon Trader Hub uses a combination of database systems to store and manage data efficiently. This document outlines the database schema, relationships, and optimization strategies.

## Core Database Tables

### Users & Authentication

#### `users`

| Column       | Type         | Attributes       | Description                        |
|-------------|--------------|------------------|------------------------------------|
| id          | UUID         | PK, NOT NULL     | Unique user identifier             |
| email       | VARCHAR(255) | UNIQUE, NOT NULL | User email address                 |
| password    | VARCHAR(255) | NOT NULL         | Hashed password                    |
| created_at  | TIMESTAMP    | NOT NULL         | Account creation timestamp         |
| updated_at  | TIMESTAMP    | NOT NULL         | Last account update                |
| last_login  | TIMESTAMP    |                  | Last login timestamp               |
| status      | VARCHAR(50)  | NOT NULL         | Account status (active, suspended) |
| tier        | VARCHAR(50)  | NOT NULL         | Subscription tier                  |

#### `profiles`

| Column        | Type         | Attributes       | Description                        |
|--------------|--------------|------------------|------------------------------------|
| id           | UUID         | PK, NOT NULL     | Matches user id                    |
| display_name | VARCHAR(255) |                  | User's display name                |
| avatar_url   | VARCHAR(255) |                  | Profile picture URL                |
| created_at   | TIMESTAMP    | NOT NULL         | Profile creation timestamp         |
| updated_at   | TIMESTAMP    | NOT NULL         | Last profile update                |
| preferences  | JSONB        |                  | User preferences                   |

### Trading Data

#### `trading_accounts`

| Column          | Type         | Attributes       | Description                       |
|----------------|--------------|------------------|-----------------------------------|
| id             | UUID         | PK, NOT NULL     | Unique account identifier         |
| user_id        | UUID         | FK, NOT NULL     | Reference to users.id             |
| name           | VARCHAR(255) | NOT NULL         | Account name                      |
| balance        | DECIMAL(24,8)| NOT NULL         | Current balance                   |
| initial_balance| DECIMAL(24,8)| NOT NULL         | Starting balance                  |
| currency       | VARCHAR(10)  | NOT NULL         | Account currency (USD, EUR, etc.) |
| created_at     | TIMESTAMP    | NOT NULL         | Account creation timestamp        |
| updated_at     | TIMESTAMP    | NOT NULL         | Last account update               |

#### `positions`

| Column             | Type         | Attributes       | Description                       |
|-------------------|--------------|------------------|-----------------------------------|
| id                | UUID         | PK, NOT NULL     | Unique position identifier        |
| account_id        | UUID         | FK, NOT NULL     | Reference to trading_accounts.id  |
| coin_id           | VARCHAR(50)  | NOT NULL         | Cryptocurrency identifier         |
| coin_symbol       | VARCHAR(20)  | NOT NULL         | Cryptocurrency symbol             |
| amount            | DECIMAL(24,8)| NOT NULL         | Position size                     |
| entry_price       | DECIMAL(24,8)| NOT NULL         | Average entry price               |
| current_price     | DECIMAL(24,8)| NOT NULL         | Current market price              |
| opened_at         | TIMESTAMP    | NOT NULL         | Position open timestamp           |
| updated_at        | TIMESTAMP    | NOT NULL         | Last position update              |
| stop_loss         | DECIMAL(24,8)|                  | Stop loss price                   |
| take_profit       | DECIMAL(24,8)|                  | Take profit price                 |

#### `trades`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | UUID         | PK, NOT NULL     | Unique trade identifier           |
| account_id       | UUID         | FK, NOT NULL     | Reference to trading_accounts.id  |
| coin_id          | VARCHAR(50)  | NOT NULL         | Cryptocurrency identifier         |
| coin_symbol      | VARCHAR(20)  | NOT NULL         | Cryptocurrency symbol             |
| type             | VARCHAR(10)  | NOT NULL         | Trade type (buy, sell)            |
| price            | DECIMAL(24,8)| NOT NULL         | Execution price                   |
| amount           | DECIMAL(24,8)| NOT NULL         | Trade amount                      |
| fee              | DECIMAL(24,8)| NOT NULL         | Transaction fee                   |
| total            | DECIMAL(24,8)| NOT NULL         | Total value (price * amount)      |
| executed_at      | TIMESTAMP    | NOT NULL         | Execution timestamp               |
| strategy_id      | UUID         |                  | Reference to trading_strategies.id|
| profit_loss      | DECIMAL(24,8)|                  | Realized profit/loss              |

### AI Trading

#### `trading_strategies`

| Column          | Type         | Attributes       | Description                       |
|----------------|--------------|------------------|-----------------------------------|
| id             | UUID         | PK, NOT NULL     | Unique strategy identifier        |
| user_id        | UUID         | FK, NOT NULL     | Reference to users.id             |
| name           | VARCHAR(255) | NOT NULL         | Strategy name                     |
| description    | TEXT         |                  | Strategy description              |
| type           | VARCHAR(50)  | NOT NULL         | Strategy type                     |
| timeframe      | VARCHAR(10)  | NOT NULL         | Trading timeframe                 |
| parameters     | JSONB        | NOT NULL         | Strategy parameters               |
| assets         | VARCHAR[]    | NOT NULL         | Target cryptocurrencies           |
| created_at     | TIMESTAMP    | NOT NULL         | Creation timestamp                |
| updated_at     | TIMESTAMP    | NOT NULL         | Last update timestamp             |
| is_active      | BOOLEAN      | NOT NULL         | Whether strategy is active        |
| risk_level     | VARCHAR(20)  |                  | Strategy risk level               |

#### `backtest_results`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | UUID         | PK, NOT NULL     | Unique backtest identifier        |
| strategy_id      | UUID         | FK, NOT NULL     | Reference to trading_strategies.id|
| user_id          | UUID         | FK, NOT NULL     | Reference to users.id             |
| start_date       | TIMESTAMP    | NOT NULL         | Backtest start date               |
| end_date         | TIMESTAMP    | NOT NULL         | Backtest end date                 |
| initial_capital  | DECIMAL(24,8)| NOT NULL         | Starting capital                  |
| final_capital    | DECIMAL(24,8)| NOT NULL         | Ending capital                    |
| returns          | DECIMAL(10,2)| NOT NULL         | Total returns percentage          |
| win_rate         | DECIMAL(10,2)| NOT NULL         | Win rate percentage               |
| trades_count     | INTEGER      | NOT NULL         | Number of trades                  |
| max_drawdown     | DECIMAL(10,2)| NOT NULL         | Maximum drawdown percentage       |
| sharpe_ratio     | DECIMAL(10,2)|                  | Sharpe ratio                      |
| profit_factor    | DECIMAL(10,2)|                  | Profit factor                     |
| results_data     | JSONB        | NOT NULL         | Detailed backtest results         |
| created_at       | TIMESTAMP    | NOT NULL         | Creation timestamp                |

### Alerts & Notifications

#### `alerts`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | UUID         | PK, NOT NULL     | Unique alert identifier           |
| user_id          | UUID         | FK, NOT NULL     | Reference to users.id             |
| type             | VARCHAR(50)  | NOT NULL         | Alert type (price, volume, etc.)  |
| coin_id          | VARCHAR(50)  | NOT NULL         | Target cryptocurrency             |
| coin_symbol      | VARCHAR(20)  | NOT NULL         | Cryptocurrency symbol             |
| condition        | JSONB        | NOT NULL         | Alert conditions                  |
| created_at       | TIMESTAMP    | NOT NULL         | Creation timestamp                |
| expires_at       | TIMESTAMP    |                  | Expiration timestamp              |
| triggered_at     | TIMESTAMP    |                  | When alert was triggered          |
| status           | VARCHAR(20)  | NOT NULL         | Status (active, triggered, etc.)  |
| notification_channels | VARCHAR[] |                | Notification methods              |
| recurring        | BOOLEAN      |                  | Whether alert can trigger multiple times |
| note             | TEXT         |                  | User note                         |

#### `notifications`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | UUID         | PK, NOT NULL     | Unique notification identifier    |
| user_id          | UUID         | FK, NOT NULL     | Reference to users.id             |
| type             | VARCHAR(50)  | NOT NULL         | Notification type                 |
| title            | VARCHAR(255) | NOT NULL         | Notification title                |
| message          | TEXT         | NOT NULL         | Notification message              |
| created_at       | TIMESTAMP    | NOT NULL         | Creation timestamp                |
| read_at          | TIMESTAMP    |                  | When notification was read        |
| source_id        | UUID         |                  | ID of triggering entity           |
| source_type      | VARCHAR(50)  |                  | Type of triggering entity         |
| priority         | VARCHAR(20)  | NOT NULL         | Notification priority             |

### Market Data

#### `coins`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | VARCHAR(50)  | PK, NOT NULL     | Coin identifier (e.g., "bitcoin") |
| symbol           | VARCHAR(20)  | NOT NULL         | Ticker symbol (e.g., "BTC")       |
| name             | VARCHAR(100) | NOT NULL         | Full name (e.g., "Bitcoin")       |
| image_url        | VARCHAR(255) |                  | Coin logo URL                     |
| description      | TEXT         |                  | Description                       |
| website          | VARCHAR(255) |                  | Official website URL              |
| whitepaper       | VARCHAR(255) |                  | Whitepaper URL                    |
| blockchain_type  | VARCHAR(50)  |                  | Blockchain type                   |
| created_at       | TIMESTAMP    | NOT NULL         | Creation timestamp                |
| updated_at       | TIMESTAMP    | NOT NULL         | Last update timestamp             |

#### `market_data`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | UUID         | PK, NOT NULL     | Unique record identifier          |
| coin_id          | VARCHAR(50)  | FK, NOT NULL     | Reference to coins.id             |
| price            | DECIMAL(24,8)| NOT NULL         | Current price                     |
| market_cap       | DECIMAL(32,2)|                  | Market capitalization             |
| volume_24h       | DECIMAL(32,2)|                  | 24-hour trading volume           |
| change_24h       | DECIMAL(10,2)|                  | 24-hour price change percentage   |
| timestamp        | TIMESTAMP    | NOT NULL         | Data timestamp                    |
| rank             | INTEGER      |                  | Market cap rank                   |
| circulating_supply | DECIMAL(30,8) |               | Circulating supply                |
| max_supply       | DECIMAL(30,8)|                  | Maximum supply                    |

#### `ohlcv_data`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| coin_id          | VARCHAR(50)  | PK, FK, NOT NULL | Reference to coins.id             |
| timestamp        | TIMESTAMP    | PK, NOT NULL     | Candle timestamp                  |
| timeframe        | VARCHAR(10)  | PK, NOT NULL     | Timeframe (1m, 1h, 1d, etc.)     |
| open             | DECIMAL(24,8)| NOT NULL         | Opening price                     |
| high             | DECIMAL(24,8)| NOT NULL         | Highest price                     |
| low              | DECIMAL(24,8)| NOT NULL         | Lowest price                      |
| close            | DECIMAL(24,8)| NOT NULL         | Closing price                     |
| volume           | DECIMAL(32,8)| NOT NULL         | Trading volume                    |

### API Connections

#### `api_connections`

| Column            | Type         | Attributes       | Description                       |
|------------------|--------------|------------------|-----------------------------------|
| id               | UUID         | PK, NOT NULL     | Unique connection identifier      |
| user_id          | UUID         | FK, NOT NULL     | Reference to users.id             |
| provider         | VARCHAR(50)  | NOT NULL         | API provider                      |
| name             | VARCHAR(100) | NOT NULL         | Connection name                   |
| api_key          | VARCHAR(255) | NOT NULL         | Encrypted API key                 |
| api_secret       | VARCHAR(255) |                  | Encrypted API secret (if needed)  |
| passphrase       | VARCHAR(255) |                  | Encrypted passphrase (if needed)  |
| created_at       | TIMESTAMP    | NOT NULL         | Creation timestamp                |
| updated_at       | TIMESTAMP    | NOT NULL         | Last update timestamp             |
| permissions      | VARCHAR[]    |                  | Granted permissions               |
| status           | VARCHAR(20)  | NOT NULL         | Connection status                 |

## Database Relationships

### User-Related Relationships

```
users
  ├── 1:1 profiles
  ├── 1:N trading_accounts
  ├── 1:N trading_strategies
  ├── 1:N alerts
  ├── 1:N notifications
  └── 1:N api_connections
```

### Trading Relationships

```
trading_accounts
  ├── 1:N positions
  └── 1:N trades

trading_strategies
  ├── 1:N backtest_results
  └── 1:N trades
```

### Market Data Relationships

```
coins
  ├── 1:N market_data
  └── 1:N ohlcv_data
```

## Database Optimizations

### Indexing Strategy

| Table          | Index Name                    | Columns                      | Type      | Purpose                             |
|---------------|-------------------------------|------------------------------|-----------|-------------------------------------|
| users         | idx_users_email               | email                        | BTREE     | Login lookups                       |
| trades        | idx_trades_account_time       | account_id, executed_at      | BTREE     | Account trade history               |
| trades        | idx_trades_strategy           | strategy_id                  | BTREE     | Strategy trade lookup               |
| positions     | idx_positions_account         | account_id                   | BTREE     | Account positions                   |
| alerts        | idx_alerts_user_status        | user_id, status              | BTREE     | Active alerts by user               |
| ohlcv_data    | idx_ohlcv_timeframe_time      | coin_id, timeframe, timestamp | BTREE     | Historical data retrieval          |
| market_data   | idx_market_data_timestamp     | timestamp                    | BTREE     | Time-series lookups                 |

### Partitioning Strategy

The `ohlcv_data` table is partitioned by timeframe and date ranges to manage the large volume of time-series data:

```sql
-- Example partitioning for ohlcv_data
CREATE TABLE ohlcv_data (
    coin_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    open DECIMAL(24,8) NOT NULL,
    high DECIMAL(24,8) NOT NULL,
    low DECIMAL(24,8) NOT NULL,
    close DECIMAL(24,8) NOT NULL,
    volume DECIMAL(32,8) NOT NULL,
    PRIMARY KEY (coin_id, timeframe, timestamp)
) PARTITION BY LIST (timeframe);

-- Create partitions for different timeframes
CREATE TABLE ohlcv_data_1m PARTITION OF ohlcv_data FOR VALUES IN ('1m');
CREATE TABLE ohlcv_data_5m PARTITION OF ohlcv_data FOR VALUES IN ('5m');
CREATE TABLE ohlcv_data_1h PARTITION OF ohlcv_data FOR VALUES IN ('1h');
CREATE TABLE ohlcv_data_1d PARTITION OF ohlcv_data FOR VALUES IN ('1d');

-- Further partition by date range
ALTER TABLE ohlcv_data_1d PARTITION BY RANGE (timestamp);

CREATE TABLE ohlcv_data_1d_y2020 PARTITION OF ohlcv_data_1d
    FOR VALUES FROM ('2020-01-01') TO ('2021-01-01');
    
CREATE TABLE ohlcv_data_1d_y2021 PARTITION OF ohlcv_data_1d
    FOR VALUES FROM ('2021-01-01') TO ('2022-01-01');
    
CREATE TABLE ohlcv_data_1d_y2022 PARTITION OF ohlcv_data_1d
    FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
    
CREATE TABLE ohlcv_data_1d_y2023 PARTITION OF ohlcv_data_1d
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
    
CREATE TABLE ohlcv_data_1d_y2024 PARTITION OF ohlcv_data_1d
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Materialized Views

Materialized views are used to optimize frequently accessed aggregate data:

```sql
-- Example materialized view for daily price summary
CREATE MATERIALIZED VIEW daily_price_summary AS
SELECT 
    coin_id,
    DATE_TRUNC('day', timestamp) AS day,
    FIRST_VALUE(open) OVER (PARTITION BY coin_id, DATE_TRUNC('day', timestamp) ORDER BY timestamp) AS open,
    MAX(high) AS high,
    MIN(low) AS low,
    LAST_VALUE(close) OVER (PARTITION BY coin_id, DATE_TRUNC('day', timestamp) ORDER BY timestamp) AS close,
    SUM(volume) AS volume
FROM ohlcv_data
WHERE timeframe = '1h'
GROUP BY coin_id, DATE_TRUNC('day', timestamp);

-- Refresh schedule
-- Refreshed daily at 00:05 UTC
```

### Data Retention Policies

| Table          | Retention Period | Archival Strategy                                      |
|---------------|------------------|--------------------------------------------------------|
| market_data   | 30 days          | Aggregated into daily snapshots after retention period |
| ohlcv_data_1m | 7 days           | Removed after retention period                        |
| ohlcv_data_5m | 30 days          | Removed after retention period                        |
| ohlcv_data_1h | 90 days          | Archived to cold storage after retention period       |
| ohlcv_data_1d | Indefinite       | Kept in database                                      |
| trades        | Indefinite       | Kept in database                                      |
| notifications | 90 days          | Archived to cold storage after retention period       |

## Database Security

### Row-Level Security (RLS)

Row-level security policies ensure users can only access their own data:

```sql
-- Example RLS policy for trading_accounts
CREATE POLICY trading_accounts_user_isolation ON trading_accounts
    USING (user_id = current_user_id());

-- Example RLS policy for positions
CREATE POLICY positions_user_isolation ON positions
    USING (account_id IN (SELECT id FROM trading_accounts WHERE user_id = current_user_id()));
```

### Data Encryption

Sensitive data is encrypted using application-level encryption:

- API credentials (api_key, api_secret, passphrase)
- Personal information

### Audit Logging

All data modifications are tracked in audit logs:

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    user_id UUID,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Database Evolution

### Migration Strategy

Database migrations are managed using a schema versioning system:

1. All migrations are tracked in version control
2. Migrations are applied sequentially and are immutable
3. Each migration includes both up and down scripts
4. Migrations are tested in staging before production deployment

### Backward Compatibility

Backward compatibility is maintained through:

- Schema changes utilize temporary dual-write periods
- API versioning coordinates with schema changes
- Database views abstract schema details from application code

## Performance Considerations

### Query Optimization

Common query patterns are optimized:

- User dashboard data retrieval
- Historical price data for charts
- Portfolio performance calculations
- Trade history pagination

### Connection Pooling

Connection pooling settings:

- Min connections: 5
- Max connections: 50
- Connection timeout: 30 seconds
- Idle timeout: 10 minutes

### Monitoring and Alerts

Database performance is monitored for:

- Query execution time
- Index usage
- Cache hit ratio
- Disk space utilization
- Connection count
