import { NextRequest, NextFetchEvent } from "next/server";
import { MiddlewareFactory } from "./middleware";
import { logger } from "../logger";
import z from "zod";
import { ErrorResponse } from "../next-response";

const isValidUrl = z.url("Invalid URL");

export const withRouteValidiation: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // validate url
    try {
      const url = isValidUrl.parse(request.nextUrl.pathname);
      logger.log("API => ", url);
    } catch (error) {
      logger.error("withRouteValidiation: Invalid URL", error);
      return ErrorResponse({
        message: "Invalid URL",
        status: 400,
      });
    }
    return next(request, _next);
  };
};
