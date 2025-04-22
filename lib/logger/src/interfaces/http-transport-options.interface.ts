/**
 * HTTP transport options interface
 */

export interface HttpTransportOptions {
  endpoint: string;
  headers?: Record<string, string>;
  batchSize?: number;
  batchInterval?: number;
}
