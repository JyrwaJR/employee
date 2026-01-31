import { NextRequest } from "next/server";
import { MiddlewareFactory } from "./middleware";
import { ErrorResponse } from "../next-response";
import { logger } from "../logger";

const routeWithOutAuth = [
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/refresh",
  "/api/auth/[id]",
];

export const withApiAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next) => {
    const path = request.nextUrl.pathname;
    const isPublicRoute = routeWithOutAuth.includes(path);
    if (isPublicRoute) {
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

    return next(request, _next);
  };
};
