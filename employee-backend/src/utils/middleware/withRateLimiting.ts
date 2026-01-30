import { NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";
import { logger } from "../logger";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@src/env";
import { ErrorResponse } from "../next-response";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// 1 req/s
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "5 s"),
});

export const withRateLimiting: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next) => {
    const identifier = request.headers.get("Authorization") ?? "anonymous";

    const result = await ratelimit.limit(identifier);

    if (!result.success) {
      logger.log("Rate limit exceeded", { identifier });

      const res = ErrorResponse({ message: "Too many requests", status: 429 });

      res.headers.set("X-RateLimit-Limit", String(result.limit));
      res.headers.set("X-RateLimit-Remaining", String(result.remaining));
      res.headers.set("Retry-After", "5");

      return res;
    }

    const response = await next(request, _next);

    response?.headers.set("X-RateLimit-Limit", String(result.limit));
    response?.headers.set("X-RateLimit-Remaining", String(result.remaining));

    return response;
  };
};
