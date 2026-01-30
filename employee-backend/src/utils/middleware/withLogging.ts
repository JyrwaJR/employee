import { NextRequest, NextFetchEvent } from "next/server";
import { MiddlewareFactory } from "./middleware";
import { logger } from "../logger";

export const withLogging: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    logger.log("API => ", request.nextUrl.pathname);
    return next(request, _next);
  };
};
