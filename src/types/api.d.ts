export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  logo?: string;
  documentation?: string;
  version?: string;
  authMethod?: 'header' | 'query' | 'none';
  apiKeyName?: string;
  requiresAuth?: boolean;
  enabled?: boolean;
  priority?: number;
  rateLimitPerMinute?: number;
  rateLimitPerDay?: number;
  rateLimitPerMonth?: number;
  defaultHeaders?: Record<string, string>;
  defaultParams?: Record<string, string>;
  endpoints?: ApiEndpoint[];
  apiKey?: string;
  apiSecret?: string;
  website?: string;
  docs?: string;
  authRequired?: boolean;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  requiresAuth?: boolean;
  params?: ApiParameter[];
  headers?: ApiParameter[];
  body?: ApiParameter[];
  rateLimited?: boolean;
  cacheDuration?: number; // in seconds
}

export interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime: string;
  endpoint?: string;
}
