
export interface ApiEndpoint {
  id?: string;
  name?: string;
  path: string;
  method: string;
  description: string;
  requiresAuth: boolean;
  parameters?: Array<{
    name: string;
    description: string;
    required: boolean;
    type: string;
    default?: string;
  }>;
  isActive?: boolean;
  url?: string;
  responseTime?: number;
  lastUsed?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  authType?: 'header' | 'query' | 'apiKey';
  authKey?: string;
  enabled: boolean;
  endpoints: Record<string, ApiEndpoint>;
  apiKey?: string;
  rateLimit?: number;
}
