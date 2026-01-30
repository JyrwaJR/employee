import { UnauthorizedError } from "@utils/errors/unAuthError";
import { requireAuth } from "./requiredAuth";
import { NextRequest } from "next/server";
import { logger } from "../logger";

export async function requireSuperAdmin(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth) {
    throw new UnauthorizedError("Unauthorized");
  }

  if (auth.user.role !== "SUPER_ADMIN") {
    logger.error("User does not have the Required permission", {
      userId: auth.user.first_name,
    });
    throw new UnauthorizedError("Permission Denied");
  }

  return auth;
}
