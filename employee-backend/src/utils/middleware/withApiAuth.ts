import { NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";
import { ErrorResponse } from "../next-response";
import { logger } from "../logger";
import { JWT } from "@src/libs/auth/jwt";

const routeWithOutAuth = [
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/refresh",
];

export const withApiAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next) => {
    const path = request.nextUrl.pathname;
    const isPublicRoute = routeWithOutAuth.includes(path);
    const isRefreshRoute = path === "/api/auth/refresh";

    if (isPublicRoute || isRefreshRoute) {
      return next(request, _next);
    }

    const header = request.headers.get("Authorization");

    const token = header?.split(" ")[1];

    if (!token) {
      logger.log("withAuthApi: No token found");
      return ErrorResponse({
        message: "Unauthorized",
        status: 401,
      });
    }

    try {
      await JWT.verifyAccessToken(token);
    } catch (error) {
      logger.log("withAuthApi: Invalid token", error);
      return ErrorResponse({
        message: "Unauthorized: Invalid token",
        status: 401,
      });
    }

    return next(request, _next);
  };
};
