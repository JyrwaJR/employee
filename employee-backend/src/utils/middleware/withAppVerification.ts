import { NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";
import { ErrorResponse } from "../next-response";
import { logger } from "../logger";

export const withAppVerification: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next) => {
    const appSecret = request.headers.get("x-app-secret");

    if (appSecret !== process.env.INTERNAL_APP_SECRET) {
      logger.log("withAppVerification: Invalid app secret");
      return ErrorResponse({
        message: "Unauthorized",
        status: 401,
      });
    }

    return next(request, _next);
  };
};
