
# Crypto Beacon Trader Hub - Database Schema

## Overview

This document outlines the database schema for the Crypto Beacon Trader Hub platform, describing the tables, relationships, and data models that support the application's features.

## Schema Diagram

```
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│                   │       │                   │       │                   │
│      Users        │───1:N─┤    Portfolios     │───1:N─┤  Portfolio Assets │
│                   │       │                   │       │                   │
└───────────────────┘       └───────────────────┘       └───────────────────┘
        │                            │                           │
        │                            │                           │
        │                            │                           │
        │                   ┌────────┴─────────┐                 │
        │                   │                  │                 │
        │                   │    Watchlists    │                 │
        │                   │                  │                 │
        │                   └──────────────────┘                 │
        │                            │                           │
        │                            │                           │
┌───────┴───────────┐       ┌───────┴────────┐         ┌────────┴────────┐
│                   │       │                │         │                 │
│      Alerts       │       │   Watchlist    │         │     Trades      │
│                   │       │     Items      │         │                 │
└───────────────────┘       └────────────────┘         └─────────────────┘
        │                                                      │
        │                                                      │
┌───────┴───────────┐                              ┌───────────┴─────────┐
│                   │                              │                     │
│   Alert History   │                              │    Trade History    │
│                   │                              │                     │
└───────────────────┘                              └─────────────────────┘


┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│                   │       │                   │       │                   │
│   API Providers   │───1:N─┤   API Keys        │───1:N─┤   API Usage       │
│                   │       │                   │       │                   │
└───────────────────┘       └───────────────────┘       └───────────────────┘

┌───────────────────┐       ┌───────────────────┐       
│                   │       │                   │       
│  Trading Models   │───1:N─┤  Model Backtests  │       
│                   │       │                   │       
└───────────────────┘       └───────────────────┘       
```

## Table Definitions

### Users

Stores user account information.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| email | VARCHAR | User email | UNIQUE, NOT NULL |
| password_hash | VARCHAR | Hashed password | NOT NULL |
| display_name | VARCHAR | User's display name | |
| created_at | TIMESTAMP | Account creation time | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |
| preferences | JSONB | User preferences | |
| role | VARCHAR | User role (user, admin) | NOT NULL, DEFAULT 'user' |
| last_login | TIMESTAMP | Last login time | |

### Portfolios

Stores portfolio information for users.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User who owns this portfolio | FK(Users.id), NOT NULL |
| name | VARCHAR | Portfolio name | NOT NULL |
| description | TEXT | Portfolio description | |
| created_at | TIMESTAMP | Creation time | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |
| is_default | BOOLEAN | If this is the user's default portfolio | NOT NULL, DEFAULT false |
| currency | VARCHAR | Base currency for this portfolio | NOT NULL, DEFAULT 'USD' |

### Portfolio_Assets

Stores assets within a portfolio.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| portfolio_id | UUID | Portfolio this asset belongs to | FK(Portfolios.id), NOT NULL |
| coin_id | VARCHAR | Asset identifier (e.g., 'bitcoin') | NOT NULL |
| quantity | DECIMAL | Asset quantity | NOT NULL |
| avg_buy_price | DECIMAL | Average purchase price | NOT NULL |
| created_at | TIMESTAMP | When asset was first added | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |

### Watchlists

Stores user watchlists for tracking assets.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User who owns this watchlist | FK(Users.id), NOT NULL |
| name | VARCHAR | Watchlist name | NOT NULL |
| created_at | TIMESTAMP | Creation time | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |
| is_default | BOOLEAN | If this is the user's default watchlist | NOT NULL, DEFAULT false |
| order | JSONB | Custom ordering of assets | |

### Watchlist_Items

Stores assets within a watchlist.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| watchlist_id | UUID | Watchlist this item belongs to | FK(Watchlists.id), NOT NULL |
| coin_id | VARCHAR | Asset identifier (e.g., 'bitcoin') | NOT NULL |
| added_at | TIMESTAMP | When asset was added | NOT NULL, DEFAULT now() |
| notes | TEXT | User notes about this asset | |
| custom_alerts | JSONB | User-defined alerts for this asset | |

### Trades

Stores user trade history.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User who made the trade | FK(Users.id), NOT NULL |
| portfolio_id | UUID | Portfolio for this trade | FK(Portfolios.id), NOT NULL |
| coin_id | VARCHAR | Asset identifier (e.g., 'bitcoin') | NOT NULL |
| type | VARCHAR | Trade type (buy, sell) | NOT NULL |
| quantity | DECIMAL | Asset quantity | NOT NULL |
| price | DECIMAL | Price per unit | NOT NULL |
| total_value | DECIMAL | Total value of trade | NOT NULL |
| fee | DECIMAL | Transaction fee | NOT NULL, DEFAULT 0 |
| timestamp | TIMESTAMP | When trade occurred | NOT NULL, DEFAULT now() |
| exchange | VARCHAR | Exchange where trade was executed | |
| notes | TEXT | User notes about this trade | |
| tags | VARCHAR[] | User-defined tags | |

### Alerts

Stores user price alerts and notifications.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User who created the alert | FK(Users.id), NOT NULL |
| coin_id | VARCHAR | Asset identifier (e.g., 'bitcoin') | NOT NULL |
| condition | VARCHAR | Alert condition (above, below) | NOT NULL |
| price | DECIMAL | Target price | NOT NULL |
| created_at | TIMESTAMP | Creation time | NOT NULL, DEFAULT now() |
| expires_at | TIMESTAMP | Expiration time | |
| is_active | BOOLEAN | If alert is active | NOT NULL, DEFAULT true |
| notification_channels | VARCHAR[] | How to notify (email, push, sms) | NOT NULL, DEFAULT ARRAY['app'] |
| triggered_at | TIMESTAMP | When alert was triggered | |
| notes | TEXT | User notes about this alert | |

### Alert_History

Stores history of triggered alerts.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| alert_id | UUID | Original alert | FK(Alerts.id), NOT NULL |
| user_id | UUID | User who created the alert | FK(Users.id), NOT NULL |
| triggered_at | TIMESTAMP | When alert was triggered | NOT NULL, DEFAULT now() |
| price_at_trigger | DECIMAL | Asset price when triggered | NOT NULL |
| notification_sent | BOOLEAN | If notification was sent | NOT NULL, DEFAULT false |
| notification_channels | VARCHAR[] | Channels notification was sent to | |

### API_Providers

Stores information about supported API providers.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| name | VARCHAR | Provider name | NOT NULL |
| base_url | VARCHAR | API base URL | NOT NULL |
| description | TEXT | Provider description | |
| docs_url | VARCHAR | Documentation URL | |
| auth_method | VARCHAR | Authentication method | |
| rate_limit_window | INTERVAL | Rate limit time window | |
| rate_limit_count | INTEGER | Requests allowed per window | |
| created_at | TIMESTAMP | When provider was added | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |
| is_active | BOOLEAN | If provider is active | NOT NULL, DEFAULT true |

### API_Keys

Stores user API keys for external services.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User who owns this key | FK(Users.id), NOT NULL |
| provider_id | UUID | API provider | FK(API_Providers.id), NOT NULL |
| name | VARCHAR | Key name | NOT NULL |
| api_key | VARCHAR | Encrypted API key | NOT NULL |
| api_secret | VARCHAR | Encrypted API secret | |
| permissions | VARCHAR[] | Key permissions | |
| created_at | TIMESTAMP | Creation time | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |
| last_used | TIMESTAMP | When key was last used | |
| is_active | BOOLEAN | If key is active | NOT NULL, DEFAULT true |

### API_Usage

Tracks API usage for rate limiting.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User making the request | FK(Users.id), NOT NULL |
| provider_id | UUID | API provider | FK(API_Providers.id), NOT NULL |
| endpoint | VARCHAR | API endpoint | NOT NULL |
| timestamp | TIMESTAMP | Request time | NOT NULL, DEFAULT now() |
| response_time | INTEGER | Response time in ms | |
| status_code | INTEGER | HTTP status code | |
| error | TEXT | Error message if any | |
| request_details | JSONB | Additional request details | |

### Trading_Models

Stores information about trading models.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| user_id | UUID | User who created this model | FK(Users.id), NOT NULL |
| name | VARCHAR | Model name | NOT NULL |
| description | TEXT | Model description | |
| type | VARCHAR | Model type (prediction, trading, etc.) | NOT NULL |
| configuration | JSONB | Model configuration | NOT NULL |
| created_at | TIMESTAMP | Creation time | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | Last update time | NOT NULL, DEFAULT now() |
| is_active | BOOLEAN | If model is active | NOT NULL, DEFAULT true |
| performance | JSONB | Performance metrics | |

### Model_Backtests

Stores backtest results for trading models.

| Column Name | Type | Description | Constraints |
|-------------|------|-------------|------------|
| id | UUID | Unique identifier | PK |
| model_id | UUID | Trading model | FK(Trading_Models.id), NOT NULL |
| start_date | TIMESTAMP | Backtest start date | NOT NULL |
| end_date | TIMESTAMP | Backtest end date | NOT NULL |
| assets | VARCHAR[] | Assets included in backtest | NOT NULL |
| results | JSONB | Backtest results | NOT NULL |
| performance_metrics | JSONB | Performance metrics | NOT NULL |
| created_at | TIMESTAMP | When backtest was run | NOT NULL, DEFAULT now() |
| notes | TEXT | Notes about this backtest | |

## Data Relationships

1. **Users to Portfolios**: One-to-many. A user can have multiple portfolios.
2. **Portfolios to Portfolio_Assets**: One-to-many. A portfolio can contain multiple assets.
3. **Users to Watchlists**: One-to-many. A user can have multiple watchlists.
4. **Watchlists to Watchlist_Items**: One-to-many. A watchlist can contain multiple items.
5. **Users to Trades**: One-to-many. A user can have multiple trades.
6. **Users to Alerts**: One-to-many. A user can set multiple alerts.
7. **Alerts to Alert_History**: One-to-many. An alert can be triggered multiple times.
8. **Users to API_Keys**: One-to-many. A user can have multiple API keys.
9. **API_Providers to API_Keys**: One-to-many. A provider can have multiple API keys.
10. **Users to Trading_Models**: One-to-many. A user can create multiple trading models.
11. **Trading_Models to Model_Backtests**: One-to-many. A model can have multiple backtests.

## Indexing Strategy

To optimize query performance, the following indices are implemented:

1. **Users table**: Index on email for fast login queries
2. **Portfolios table**: Index on (user_id, is_default) for fast retrieval of default portfolio
3. **Portfolio_Assets table**: Composite index on (portfolio_id, coin_id) for fast asset lookup
4. **Trades table**: Index on (user_id, timestamp) for chronological retrieval
5. **Alerts table**: Index on (user_id, is_active) and (coin_id, price, condition) for alert triggering
6. **API_Usage table**: Index on (user_id, provider_id, timestamp) for rate limit checking

## Data Validation Rules

1. **Email**: Must be valid email format and unique
2. **Passwords**: Must meet minimum complexity requirements
3. **Asset quantities**: Must be positive numbers
4. **Prices**: Must be non-negative numbers
5. **Timestamps**: Future dates not allowed except for alert expiration
6. **API keys**: Encrypted at rest and in transit

## Security Considerations

1. **Encryption**: API keys and secrets encrypted using AES-256
2. **Row-Level Security**: Database policies restrict access to user's own data
3. **Sensitive Data**: PII and financial data handled according to data protection regulations
4. **Audit Trail**: Changes to sensitive data logged in audit tables
5. **Authentication**: Multi-factor authentication supported for account access

## Migration Strategy

The database schema supports version-controlled migrations using:

1. **Numbered migrations**: Sequential upgrade/downgrade scripts
2. **Change logs**: Documentation of schema changes
3. **Data preservation**: Migrations preserve existing data

This database schema is designed to support all current and planned features of the Crypto Beacon Trader Hub platform, with emphasis on data integrity, performance, and security.
