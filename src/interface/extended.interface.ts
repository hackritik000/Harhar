import type { ActionAPIContext } from "astro:actions";

export interface NewApiContext extends ActionAPIContext {
  requestMetadata?: {
    requestCount: {
      count: number;
      timestamp: number; // Use a number (timestamp) for easier time comparisons
    };
  };
}
