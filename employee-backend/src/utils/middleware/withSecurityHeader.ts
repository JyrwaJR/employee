import { NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";

export const withSecurityHeaders: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next) => {
    const response = await next(request, _next);

    response?.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; object-src 'none';",
    );

    // Equivalent to helmet.xssFilter()
    response?.headers.set("X-XSS-Protection", "1; mode=block");

    // Equivalent to helmet.frameguard()
    response?.headers.set("X-Frame-Options", "DENY");

    // Equivalent to helmet.noSniff()
    response?.headers.set("X-Content-Type-Options", "nosniff");

    // Equivalent to helmet.referrerPolicy()
    response?.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  };
};
