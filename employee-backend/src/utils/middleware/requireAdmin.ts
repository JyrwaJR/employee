import { UnauthorizedError } from "../errors/unAuthError";
import { requireAuth } from "./requiredAuth";
import { NextRequest } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const user = await requireAuth(req);

  if (!user) throw new UnauthorizedError("Unauthorized");

  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")
    throw new UnauthorizedError("Permission Denied");

  return user;
}
