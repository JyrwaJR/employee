import { UnauthorizedError } from "../errors/unAuthError";
import { requireAuth } from "./requiredAuth";
import { NextRequest } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const auth = await requireAuth(req);

  if (!auth) throw new UnauthorizedError("Unauthorized");

  if (auth.user.role !== "SUPER_ADMIN" && auth.user.role !== "ADMIN")
    throw new UnauthorizedError("Permission Denied");

  return auth;
}
