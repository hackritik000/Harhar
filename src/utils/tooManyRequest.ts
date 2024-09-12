import type { NewApiContext } from "@/interface/extended.interface";
import {
  TOO_MANY_REQUEST_COUNT_LIMIT,
  TOO_MANY_REQUEST_TIME_LIMIT,
} from "./constant";

export const TooManyRequest = (context: NewApiContext): boolean => {
  const currentTime = Date.now();

  // Initialize request metadata if not present
  if (!context.requestMetadata) {
    context.requestMetadata = {
      requestCount: {
        count: 1,
        timestamp: currentTime,
      },
    };
    return false;
  }

  const { count, timestamp } = context.requestMetadata.requestCount;

  // Check if the current request is within the time limit
  if (currentTime - timestamp < TOO_MANY_REQUEST_TIME_LIMIT) {
    // If count is within the limit, increment the count and continue
    if (count < TOO_MANY_REQUEST_COUNT_LIMIT) {
      context.requestMetadata.requestCount = {
        count: count + 1,
        timestamp: timestamp,
      };
      return false;
    } else {
      // Too many requests, deny further requests
      return true;
    }
  }

  // Reset request count if time limit has passed
  context.requestMetadata.requestCount = {
    count: 1,
    timestamp: currentTime,
  };
  return false;
};
