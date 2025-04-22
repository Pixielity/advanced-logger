/**
 * HTTP transport - sends logs to a remote endpoint
 */

import type { Transport } from "../interfaces/transport.interface";
import type { LogLevelType } from "../types/log-level.type";
import type { HttpTransportOptions } from "../interfaces/http-transport-options.interface";
import type { LogEntry } from "../interfaces/log-entry.interface";

export class HttpTransport implements Transport {
  private endpoint: string;
  private headers: Record<string, string>;
  private batchSize: number;
  private batchInterval: number;
  private batch: LogEntry[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isClient: boolean;

  constructor(options: HttpTransportOptions) {
    this.endpoint = options.endpoint;
    this.headers = options.headers || {
      "Content-Type": "application/json",
    };
    this.batchSize = options.batchSize || 10;
    this.batchInterval = options.batchInterval || 5000; // 5 seconds
    this.isClient = typeof window !== "undefined";

    // Start the timer for batch sending
    this.startTimer();
  }

  private startTimer(): void {
    if (this.isClient && !this.timer) {
      this.timer = setInterval(() => {
        this.sendBatch();
      }, this.batchInterval);
    }
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async sendBatch(): Promise<void> {
    if (this.batch.length === 0) return;

    const batchToSend = [...this.batch];
    this.batch = [];

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(batchToSend),
      });
    } catch (error) {
      console.error("Failed to send logs to HTTP endpoint:", error);
      // Put the logs back in the batch
      this.batch = [...batchToSend, ...this.batch];
    }
  }

  log(
    level: LogLevelType,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>
  ): void {
    // Add to batch
    this.batch.push({
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      context,
    });

    // Send immediately if batch size reached
    if (this.batch.length >= this.batchSize) {
      this.sendBatch();
    }
  }

  /**
   * Force send any pending logs
   */
  async flush(): Promise<void> {
    await this.sendBatch();
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopTimer();
    this.sendBatch();
  }
}
